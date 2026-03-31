'use server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function makeMeRootAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return { error: 'Вы не авторизованы!' };

  // Выдаем права 'admin' во всех 7 фракциях штата
  const factions = ['government', 'lspd', 'ems', 'sheriff', 'fib', 'usss', 'sang'];

  for (const f of factions) {
    await prisma.userRole.upsert({
      where: {
        userId_factionId: { userId: session.user.id, factionId: f }
      },
      update: { roleLevel: 'admin' },
      create: { userId: session.user.id, factionId: f, roleLevel: 'admin' }
    });
  }

  // Обновляем кэш, чтобы дашборд сразу отобразил изменения
  revalidatePath('/dashboard');
  revalidatePath('/');
  
  return { success: true };
}
