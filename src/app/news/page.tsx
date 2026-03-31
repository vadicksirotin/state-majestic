import { prisma } from "@/lib/prisma";
import { getFaction } from "@/config/factions";
import Link from 'next/link';
import Image from 'next/image';

export default async function NewsPage() {
  const news = await prisma.newsPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ padding: 'var(--space-2xl) 0', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="section-title">Weazel News Live</h1>
      <p className="section-subtitle">Официальные сводки, новости Правительства и объявления гос. структур.</p>
      
      <div style={{ marginTop: 'var(--space-3xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {news.length === 0 ? (
          <div style={{ padding: 'var(--space-3xl)', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ color: 'var(--text-muted)' }}>В штате пока тихо. Нет новых публикаций.</p>
          </div>
        ) : (
          news.map(post => {
            const faction = getFaction(post.factionId as any);
            return (
              <article key={post.id} style={{ 
                background: 'linear-gradient(135deg, rgba(18,26,43,0.7), rgba(26,35,64,0.4))',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {post.imageUrl && (
                  <div style={{ height: '300px', width: '100%', position: 'relative', background: '#000' }}>
                    <Image src={post.imageUrl} alt={post.title} fill style={{ objectFit: 'cover', opacity: 0.8 }} />
                  </div>
                )}
                <div style={{ padding: 'var(--space-xl)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-md)' }}>
                    <Link href={`/${post.factionId}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}>
                      <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }}>{faction?.icon}</span>
                      <span style={{ fontWeight: 600, color: 'var(--gold)' }}>{faction?.name}</span>
                    </Link>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(post.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: 'var(--space-md)', lineHeight: 1.3 }}>
                    {post.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-lg)', whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </p>
                  
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    {post.tags.split(',').map(tag => tag.trim()).map((tag, i) => (
                      <span key={i} style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        padding: '4px 12px', 
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
