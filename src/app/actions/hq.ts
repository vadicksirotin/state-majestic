'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const checkHqAccess = async (factionId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  
  // Проверяем, есть ли у пользователя роль High Command или Admin в этой фракции
  const hasAccess = session.user.roles?.some(
    r => r.factionId === factionId && ['high-command', 'admin'].includes(r.roleLevel)
  );

  return hasAccess;
};

export async function processApplication(applicationId: string, factionId: string, status: 'approved' | 'rejected') {
  const hasAccess = await checkHqAccess(factionId);
  if (!hasAccess) throw new Error("У вас нет прав для управления заявками этой структуры.");

  const app = await prisma.application.update({
    where: { id: applicationId },
    data: { status }
  });

  // Если заявка одобрена, мы могли бы автоматически добавлять человека в RosterEntry
  if (status === 'approved') {
    // Проверим, нет ли его уже в составе
    const existingEntry = await prisma.rosterEntry.findUnique({
      where: {
        userId_factionId: {
          userId: app.userId,
          factionId: app.factionId
        }
      }
    });

    if (!existingEntry) {
      await prisma.rosterEntry.create({
        data: {
          userId: app.userId,
          factionId: app.factionId,
          rank: 'Trainee', // Старший состав сможет изменить позже
        }
      });
    }
  }

  revalidatePath(`/${factionId}/hq`);
  return { success: true };
}
