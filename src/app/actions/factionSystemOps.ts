'use server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function checkLeaderAccess(factionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Not authorized');
  const userRole = await prisma.userRole.findUnique({
    where: { userId_factionId: { userId: session.user.id, factionId } }
  });
  if (userRole?.roleLevel !== 'leadership' && userRole?.roleLevel !== 'admin') {
    throw new Error('Access denied (Leadership required)');
  }
}

// ---------------------------------
// RANKS
// ---------------------------------
export async function createRank(factionId: string, name: string) {
  await checkLeaderAccess(factionId);
  const existingRanks = await prisma.factionRank.findMany({ where: { factionId } });
  
  // При создании ранга, все старые ранги получают +1, а этот становится рангом 1
  for (const r of existingRanks) {
    await prisma.factionRank.update({
      where: { id: r.id },
      data: { weight: r.weight + 1 }
    });
  }
  
  await prisma.factionRank.create({
    data: { factionId, name, weight: 1 }
  });
  revalidatePath(`/${factionId}`);
}

export async function deleteRank(factionId: string, rankId: string) {
  await checkLeaderAccess(factionId);
  const target = await prisma.factionRank.findUnique({ where: { id: rankId } });
  if (!target) return;
  
  await prisma.factionRank.delete({ where: { id: rankId } });
  
  // Сдвигаем все ранги, которые были ВЫШЕ удаленного, на 1 шаг вниз (-1)
  const higherRanks = await prisma.factionRank.findMany({
    where: { factionId, weight: { gt: target.weight } }
  });
  
  for (const r of higherRanks) {
    await prisma.factionRank.update({
      where: { id: r.id },
      data: { weight: r.weight - 1 }
    });
  }
  revalidatePath(`/${factionId}`);
}

export async function reorderRanks(factionId: string, newOrderIds: string[]) {
  await checkLeaderAccess(factionId);
  // newOrderIds - это массив ID от самого младшего (вес 1) к самому старшему (макс вес)
  // Мы предполагаем, что массив отсортирован по возрастанию ранга, либо наоборот, зависит от UI.
  // Пусть 0-й элемент массива получает weight = 1, 1-й -> 2 и т.д.
  
  const updates = newOrderIds.map((id, index) => 
    prisma.factionRank.update({
      where: { id },
      data: { weight: index + 1 }
    })
  );
  await prisma.$transaction(updates);
  revalidatePath(`/${factionId}`);
}

// Установить ранг High Command Threshold
export async function setHighCommandRank(factionId: string, rankWeight: number) {
  await checkLeaderAccess(factionId);
  await prisma.factionSettings.upsert({
    where: { factionId },
    update: { highCommandRank: rankWeight },
    create: { factionId, highCommandRank: rankWeight, leaderRank: 15 }
  });
  revalidatePath(`/${factionId}`);
}

// ---------------------------------
// LINKS
// ---------------------------------
export async function createLink(factionId: string, label: string, href: string, isInternal: boolean, icon: string, accessLevel: number) {
  await checkLeaderAccess(factionId);
  const linksCount = await prisma.factionLink.count({ where: { factionId } });
  await prisma.factionLink.create({
    data: {
      factionId, label, href, isInternal, icon, accessLevel, order: linksCount
    }
  });
  revalidatePath(`/${factionId}`);
}

export async function deleteLink(factionId: string, linkId: string) {
  await checkLeaderAccess(factionId);
  await prisma.factionLink.delete({ where: { id: linkId } });
  revalidatePath(`/${factionId}`);
}

export async function updateLinkOrder(factionId: string, linkOrderIds: string[]) {
  await checkLeaderAccess(factionId);
  const updates = linkOrderIds.map((id, index) => 
    prisma.factionLink.update({
      where: { id },
      data: { order: index }
    })
  );
  await prisma.$transaction(updates);
  revalidatePath(`/${factionId}`);
}
