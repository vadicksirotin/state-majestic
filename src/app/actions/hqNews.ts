'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function publishNews(factionId: string, data: { title: string, content: string, tags: string }) {
  await prisma.newsPost.create({
    data: {
      factionId,
      title: data.title,
      content: data.content,
      tags: data.tags
    }
  });

  revalidatePath('/news');
}
