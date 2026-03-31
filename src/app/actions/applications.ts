'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitApplication(factionId: string, formData: Record<string, string>) {
  // В будущем userId будет браться из сессии NextAuth
  // const session = await auth();
  // if (!session) throw new Error('Unauthorized');
  
  const mockUserId = 'guest_user_' + Math.random().toString(36).substr(2, 9);

  // Создаем юзера-заглушку, если у нас нет реальной авторизации
  const user = await prisma.user.create({
    data: {
      name: formData.fullName || 'Аноним',
      discordId: mockUserId, // Временная заглушка
    }
  });

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      factionId,
      status: 'pending',
      formData: JSON.stringify(formData),
    }
  });

  revalidatePath(`/${factionId}/apply`);
  return { success: true, applicationId: application.id };
}
