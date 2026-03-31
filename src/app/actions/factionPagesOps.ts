'use server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitMultiApplication(factionId: string, type: string, formData: Record<string, string>) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Необходимо войти через Discord');

  await prisma.application.create({
    data: {
      userId: session.user.id,
      factionId,
      type, // 'academy' | 'transfer' | 'recovery'
      status: 'pending',
      formData: JSON.stringify(formData),
    }
  });

  revalidatePath(`/${factionId}/${type === 'transfer' ? 'transfers' : type === 'recovery' ? 'recovery' : 'apply'}`);
  return { success: true };
}

export async function submitPassRequest(factionId: string, purpose: string, duration: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Необходимо войти через Discord');

  await prisma.passRequest.create({
    data: {
      factionId,
      discordId: session.user.discordId || '0',
      name: session.user.name || 'Аноним',
      purpose,
      duration,
      status: 'pending'
    }
  });

  revalidatePath(`/${factionId}/passes`);
  return { success: true };
}
