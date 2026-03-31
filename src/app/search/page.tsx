import { prisma } from "@/lib/prisma";
import { getFaction } from "@/config/factions";
import Link from 'next/link';
import { DataTable } from '@/components/ui/DataTable';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  let users: any[] = [];
  let news: any[] = [];

  if (query.trim().length > 1) {
    // Поиск по пользователям и их ростеру (case-insensitive)
    users = await prisma.rosterEntry.findMany({
      where: {
        user: { name: { contains: query } }
      },
      include: { user: true }
    });

    // Поиск по новостям
    news = await prisma.newsPost.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
          { tags: { contains: query } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  const userColumns = [
    { key: 'name', header: 'Сотрудник', render: (row: any) => <strong>{row.user.name}</strong> },
    { key: 'faction', header: 'Структура', render: (row: any) => getFaction(row.factionId as any)?.name || row.factionId },
    { key: 'rank', header: 'Звание', render: (row: any) => row.rank },
  ];

  return (
    <div style={{ padding: 'var(--space-2xl) 0', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="section-title">Государственный Архив</h1>
      <p className="section-subtitle">Поиск по реестрам сотрудников и официальным публикациям Weazel News.</p>

      <form style={{ display: 'flex', gap: 'var(--space-md)', margin: 'var(--space-2xl) 0' }}>
        <input 
          type="text" 
          name="q" 
          defaultValue={query}
          placeholder="Введите имя сотрудника, номер бейджа или слово из новости..." 
          style={{ 
            flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.3)', 
            border: '1px solid var(--accent)', color: 'white', 
            borderRadius: 'var(--radius-lg)', fontSize: '1.1rem' 
          }} 
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>
          Найти
        </button>
      </form>

      {query && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: 'var(--space-md)' }}>Найденные сотрудники ({users.length})</h2>
            <DataTable data={users} columns={userColumns} emptyText="Сотрудники не найдены или данные засекречены." />
          </section>

          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: 'var(--space-md)' }}>Найденные публикации ({news.length})</h2>
            {news.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Публикаций по запросу не найдено.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {news.map(post => (
                  <Link key={post.id} href="/news" style={{ 
                    display: 'block', padding: 'var(--space-md)', 
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)', color: 'inherit', textDecoration: 'none'
                  }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'block' }}>{post.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{getFaction(post.factionId as any)?.name} • {new Date(post.createdAt).toLocaleDateString()}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
