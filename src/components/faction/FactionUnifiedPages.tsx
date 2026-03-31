import { prisma } from '@/lib/prisma';
import { type FactionConfig } from '@/config/factions';
import { notFound } from 'next/navigation';

// 1. RANKS LIST
export async function RanksList({ faction }: { faction: FactionConfig }) {
  const ranks = await prisma.factionRank.findMany({
    where: { factionId: faction.id },
    orderBy: { weight: 'desc' }
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-xl) 0' }}>
      <h1 className="section-title">Система званий и иерархия</h1>
      <p className="section-subtitle">Официальный реестр должностей {faction.name}</p>
      
      {ranks.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Ранги еще не настроены руководителем.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
          {ranks.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{r.name}</div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.6rem', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Вес: {r.weight}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 2. HIGH STAFF LIST
export async function HighStaffList({ faction }: { faction: FactionConfig }) {
  const settings = await prisma.factionSettings.findUnique({ where: { factionId: faction.id } });
  const threshold = settings?.highCommandRank ?? 10;
  
  const hcs = await prisma.rosterEntry.findMany({
    where: { factionId: faction.id, rankWeight: { gte: threshold } },
    include: { user: true },
    orderBy: { rankWeight: 'desc' }
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-xl) 0' }}>
      <h1 className="section-title">Руководящий состав (High Command)</h1>
      <p className="section-subtitle">Офицеры с доступом от {threshold} ранга.</p>
      
      {hcs.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Состав руководства не найден.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginTop: '2rem' }}>
          {hcs.map(member => (
            <div key={member.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                👤
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{member.user.name}</div>
              <div style={{ color: faction.accentColor, fontSize: '0.9rem', marginTop: '0.3rem' }}>{member.rank}</div>
              {member.department && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{member.department}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 3. CHARTER PAGE
export async function CharterPage({ faction }: { faction: FactionConfig }) {
  const settings = await prisma.factionSettings.findUnique({ where: { factionId: faction.id } });
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-xl) 0' }}>
      <h1 className="section-title">Устав и Регламенты</h1>
      <p className="section-subtitle">Внутренний свод правил фракции {faction.name}</p>
      
      <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
        {settings?.charterText ? settings.charterText : <em style={{ color: 'var(--text-muted)' }}>Устав еще не опубликован руководством.</em>}
      </div>
    </div>
  );
}

// 4. ORDERS LIST
export async function OrdersList({ faction }: { faction: FactionConfig }) {
  const orders = await prisma.factionOrder.findMany({
    where: { factionId: faction.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-xl) 0' }}>
      <h1 className="section-title">Официальные приказы</h1>
      <p className="section-subtitle">Документальные распоряжения руководства</p>
      
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Приказов пока нет.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{o.createdAt.toLocaleDateString()}</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: faction.accentColor }}>{o.title}</h3>
              <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{o.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 5. DOCS HUB (Fallback placeholder for docs listing)
export async function DocsHub({ faction }: { faction: FactionConfig }) {
  const docs = await prisma.factionDocument.findMany({
    where: { factionId: faction.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--space-xl) 0' }}>
      <h1 className="section-title">Библиотека документов</h1>
      <p className="section-subtitle">Внутренние гайды, регламенты и статьи {faction.name}</p>
      
      {docs.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <p style={{ color: 'var(--text-muted)' }}>В базе знаний пока нет ни одной статьи.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginTop: '2rem' }}>
          {docs.map(doc => (
            <a key={doc.id} href={`/${faction.id}/${doc.slug}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px', display: 'block', textDecoration: 'none', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{doc.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Обновлено: {doc.updatedAt.toLocaleDateString()}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// 6. PLACEHOLDER PAGE
export function PlaceholderPage({ faction, title, slug }: { faction: FactionConfig, title: string, slug: string }) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🚧</div>
      <h1 className="section-title" style={{ justifyContent: 'center' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '1.5rem auto 0' }}>
        Данный раздел находится в разработке. Лидер фракции ({faction.name}) может наполнить его контентом в панели <strong>HQ / Настройки</strong>. Путь для привязки: <code>/{faction.id}/{slug}</code>
      </p>
    </div>
  );
}

// 7. FACTION DOCUMENT VIEW
export function DocumentView({ faction, doc }: { faction: FactionConfig, doc: any }) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-xl) 0' }}>
      <h1 className="section-title">{doc.title}</h1>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        Опубликовано: {doc.createdAt.toLocaleDateString()}
      </div>
      
      <div style={{ lineHeight: '1.8', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
        {doc.content}
      </div>
    </div>
  );
}

// 8. PASS REQUEST FORM (placeholder for now, you can extract it into Client Component later)
import { PassRequestFormClient } from './PassRequestFormClient';
export function PassRequestForm({ faction }: { faction: FactionConfig }) {
  return <PassRequestFormClient faction={faction} />;
}
