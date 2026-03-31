'use client';
import { useState } from 'react';
import { createLink, deleteLink } from '@/app/actions/factionSystemOps';

export interface FactionLink {
  id: string;
  label: string;
  href: string;
  icon: string | null;
  isInternal: boolean;
  accessLevel: number;
}

export function LinkManager({ factionId, links, ranks }: { factionId: string, links: FactionLink[], ranks: Array<{ id: string, name: string, weight: number }> }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ф-я для нового линка
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');
  const [icon, setIcon] = useState('🔗');
  const [isInternal, setIsInternal] = useState(false);
  const [minRank, setMinRank] = useState(1);

  const INTERNAL_PAGES = [
    { label: '🎖️ Звания', href: `/${factionId}/ranks` },
    { label: '📜 Приказы', href: `/${factionId}/orders` },
    { label: '📋 Устав', href: `/${factionId}/drill` },
    { label: '🔄 Переводы', href: `/${factionId}/transfers` },
    { label: '♻️ Восстановление', href: `/${factionId}/recovery` },
    { label: '📄 Пропуска', href: `/${factionId}/passes` },
    { label: '📄 Документы', href: `/${factionId}/docs` },
    { label: '⭐ Руководство', href: `/${factionId}/high-staff` }
  ];

  const handleInternalSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      const match = INTERNAL_PAGES.find(p => p.href === val);
      if (match) {
        setHref(match.href);
        const iconMatch = match.label.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u);
        const realLabel = match.label.replace(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u, '');
        setIcon(iconMatch ? iconMatch[0] : '🔗');
        setLabel(realLabel);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !href) return;
    setLoading(true);
    await createLink(factionId, label, href, isInternal, icon, minRank);
    setModalOpen(false);
    setLoading(false);
    // сброс
    setLabel(''); setHref(''); setIcon('🔗');
  };

  return (
    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h3 style={{ marginBottom: '1rem', color: '#10B981' }}>🔗 Быстрые Ссылки</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Создайте кнопки для навигации сотрудников (Google Формы, Discord или внутренние страницы сайта).
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
        {links.map(link => (
          <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
            <span>{link.icon} {link.label}</span>
            <button
              onClick={async () => await deleteLink(factionId, link.id)}
              disabled={loading}
              style={{ background: 'none', border: 'none', color: '#EF4444', opacity: 0.6, cursor: 'pointer', outline: 'none' }}
              title="Удалить ссылку"
            >×</button>
          </div>
        ))}
        <button onClick={() => setModalOpen(true)} className="btn" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
          + Добавить ссылку
        </button>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1.5rem' }}>Создать ссылку</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div style={{ display: 'flex', gap: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px' }}>
                <button type="button" onClick={() => setIsInternal(false)} style={{ flex: 1, padding: '0.5rem', background: !isInternal ? 'var(--accent)' : 'transparent', color: !isInternal ? 'black' : 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Внешняя</button>
                <button type="button" onClick={() => setIsInternal(true)} style={{ flex: 1, padding: '0.5rem', background: isInternal ? 'var(--accent)' : 'transparent', color: isInternal ? 'black' : 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Внутренняя</button>
              </div>

              {isInternal && (
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Выберите раздел сайта</label>
                  <select onChange={handleInternalSelect} style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', marginTop: '4px' }}>
                    <option value="">-- Выбрать страницу --</option>
                    {INTERNAL_PAGES.map(p => <option key={p.href} value={p.href}>{p.label}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '60px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Эмодзи</label>
                  <input type="text" value={icon} onChange={e => setIcon(e.target.value)} maxLength={2} style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', textAlign: 'center', marginTop: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Название кнопки</label>
                  <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="Напр: Заявки в SWAT" required style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', marginTop: '4px' }} />
                </div>
              </div>

              {!isInternal && (
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>URL Ссылка (https://)</label>
                  <input type="url" value={href} onChange={e => setHref(e.target.value)} placeholder="https://google.com/forms/..." required style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', marginTop: '4px' }} />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Кому доступна кнопка?</label>
                <select value={minRank} onChange={e => setMinRank(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', marginTop: '4px' }}>
                  <option value={1}>Всем сотрудникам (с 1 ранга)</option>
                  {[...ranks].sort((a, b) => a.weight - b.weight).map(r => (
                    <option key={r.id} value={r.weight}>Начиная с: {r.weight}. {r.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" disabled={loading} className="btn" style={{ flex: 1 }}>Сохранить</button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn" style={{ background: 'transparent', opacity: 0.7 }}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
