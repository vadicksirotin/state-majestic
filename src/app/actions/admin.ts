'use server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isDevUser } from '@/lib/devAuth';
import { revalidatePath } from 'next/cache';

async function requireDev() {
  const session = await getServerSession(authOptions);
  if (!session || !isDevUser(session.user.discordId)) {
    throw new Error('Доступ запрещён: только DEV');
  }
  return session;
}

export async function adminSetUserRole(userId: string, factionId: string, roleLevel: string) {
  await requireDev();
  
  await prisma.userRole.upsert({
    where: { userId_factionId: { userId, factionId } },
    update: { roleLevel },
    create: { userId, factionId, roleLevel },
  });

  // Если даём leadership/curator/admin - автоматически добавляем в ростер с правами лидера
  // Пропускаем, если роль Глобальная (factionId: 'global')
  const leadershipRoles = ['leadership', 'curator', 'admin'];
  if (leadershipRoles.includes(roleLevel) && factionId !== 'global') {
    // 1. Убеждаемся что в БД есть ранг Лидер для этой фракции
    let leaderRank = await prisma.factionRank.findFirst({
      where: { factionId, weight: { gte: 15 } }
    });
    
    if (!leaderRank) {
      leaderRank = await prisma.factionRank.create({
        data: { factionId, name: 'Лидер', weight: 15 }
      });
    }

    // 2. Добавляем в ростер
    await prisma.rosterEntry.upsert({
      where: { userId_factionId: { userId, factionId } },
      update: { rank: leaderRank.name, rankWeight: leaderRank.weight },
      create: { userId, factionId, rank: leaderRank.name, rankWeight: leaderRank.weight },
    });

    // 3. Убеждаемся что есть настройки фракции с правильным порогом
    await prisma.factionSettings.upsert({
      where: { factionId },
      update: { leaderRank: leaderRank.weight },
      create: { factionId, leaderRank: leaderRank.weight, highCommandRank: 10 }
    });
  }

  revalidatePath('/admin');
  revalidatePath(`/${factionId}/hq`);
  return { success: true };
}

export async function adminRemoveUserRole(userId: string, factionId: string) {
  await requireDev();

  await prisma.userRole.deleteMany({
    where: { userId, factionId },
  });

  // При удалении роли — удаляем и из ростера (так как теперь это единая сущность "Должность")
  await prisma.rosterEntry.deleteMany({
    where: { userId, factionId }
  });

  revalidatePath('/admin');
  revalidatePath(`/${factionId}/hq`);
  return { success: true };
}

export async function adminSetRosterEntry(
  userId: string, 
  factionId: string, 
  rank: string, 
  rankWeight: number, 
  department?: string
) {
  await requireDev();

  await prisma.rosterEntry.upsert({
    where: { userId_factionId: { userId, factionId } },
    update: { rank, rankWeight, department: department || null },
    create: { userId, factionId, rank, rankWeight, department: department || null },
  });

  revalidatePath('/admin');
  return { success: true };
}

export async function adminRemoveRosterEntry(userId: string, factionId: string) {
  await requireDev();

  await prisma.rosterEntry.deleteMany({
    where: { userId, factionId },
  });

  revalidatePath('/admin');
  return { success: true };
}

export async function adminSearchUsers(query: string) {
  if (!query || query.length < 1) return [];
  
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { discordId: { contains: query } },
      ]
    },
    include: {
      roles: true,
      rosterEntries: true,
    },
    take: 20,
  });

  return users;
}
