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

  revalidatePath('/admin');
  return { success: true };
}

export async function adminRemoveUserRole(userId: string, factionId: string) {
  await requireDev();

  await prisma.userRole.deleteMany({
    where: { userId, factionId },
  });

  revalidatePath('/admin');
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
