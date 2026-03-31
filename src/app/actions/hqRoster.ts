'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateMemberRank(id: string, newRank: string) {
  await prisma.rosterEntry.update({
    where: { id },
    data: { rank: newRank }
  });
  revalidatePath('/[factionId]/hq', 'layout');
}

export async function fireMember(id: string, factionId: string) {
  // Получаем userId перед удалением
  const entry = await prisma.rosterEntry.findUnique({ where: { id }});
  
  await prisma.rosterEntry.delete({
    where: { id }
  });

  // Также удаляем права из UserRole
  if (entry) {
    await prisma.userRole.deleteMany({
      where: { userId: entry.userId, factionId }
    });
  }

  revalidatePath('/[factionId]/hq', 'layout');
  revalidatePath('/[factionId]/roster', 'layout');
}
