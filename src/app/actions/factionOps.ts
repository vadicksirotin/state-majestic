'use server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitItemRequest(factionId: string, data: { itemName: string; amount: number; reason: string }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Не авторизован');

  await prisma.itemRequest.create({
    data: {
      requesterId: session.user.id,
      factionId,
      itemName: data.itemName,
      amount: data.amount,
      reason: data.reason,
    }
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function submitPromotionReport(factionId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Не авторизован');

  await prisma.promotionReport.create({
    data: {
      reporterId: session.user.id,
      factionId,
      content,
    }
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function reviewItemRequest(requestId: string, status: 'approved' | 'rejected') {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Не авторизован');

  await prisma.itemRequest.update({
    where: { id: requestId },
    data: { status, reviewedBy: session.user.name || session.user.id }
  });

  revalidatePath('/');
  return { success: true };
}

export async function reviewPromotionReport(reportId: string, status: 'approved' | 'rejected') {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Не авторизован');

  await prisma.promotionReport.update({
    where: { id: reportId },
    data: { status, reviewedBy: session.user.name || session.user.id }
  });

  revalidatePath('/');
  return { success: true };
}

export async function issueReprimand(userId: string, factionId: string, reason: string, type: 'verbal' | 'written') {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Не авторизован');

  await prisma.reprimand.create({
    data: {
      userId,
      factionId,
      issuerId: session.user.id,
      reason,
      type,
    }
  });

  await prisma.activityLog.create({
    data: {
      factionId,
      action: 'ISSUED_REPRIMAND',
      details: `${session.user.name} выдал ${type === 'verbal' ? 'устный' : 'письменный'} выговор: ${reason}`,
      actorId: session.user.id,
    }
  });

  revalidatePath('/');
  return { success: true };
}

export async function removeReprimand(reprimandId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Не авторизован');

  await prisma.reprimand.update({
    where: { id: reprimandId },
    data: { isActive: false }
  });

  revalidatePath('/');
  return { success: true };
}

// --- Leader Actions ---
export async function updateFactionSettings(factionId: string, data: { highCommandRank?: number; leaderRank?: number; charterText?: string }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Не авторизован');

  await prisma.factionSettings.upsert({
    where: { factionId },
    update: data,
    create: {
      factionId,
      highCommandRank: data.highCommandRank ?? 10,
      leaderRank: data.leaderRank ?? 15,
      charterText: data.charterText ?? null,
    }
  });

  revalidatePath('/');
  return { success: true };
}

export async function createDepartment(factionId: string, name: string, description?: string) {
  await prisma.department.create({
    data: { factionId, name, description }
  });
  revalidatePath('/');
}

export async function deleteDepartment(id: string) {
  await prisma.department.delete({ where: { id } });
  revalidatePath('/');
}

export async function updateMemberPermissions(rosterId: string, permissions: string[]) {
  await prisma.rosterEntry.update({
    where: { id: rosterId },
    data: { permissions: JSON.stringify(permissions) }
  });
  revalidatePath('/');
}

export async function updateMemberRankWeight(rosterId: string, rankWeight: number) {
  await prisma.rosterEntry.update({
    where: { id: rosterId },
    data: { rankWeight }
  });
  revalidatePath('/');
}
