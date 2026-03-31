'use client';
import { useState } from 'react';
import { saveFactionDocument, deleteFactionDocument } from '@/app/actions/factionPagesOps';
import { FACTIONS } from '@/config/factions';

export function FactionPagesManager({ factionId, existingDocs }: { factionId: string, existingDocs: { id: string, slug: string, title: string, content: string }[] }) {
  const faction = FACTIONS[factionId as keyof typeof FACTIONS];
  const allNavItems = faction?.navItems || [];
  
  // Доступные для редактирования кастомные slug-и
  // Не включаем сюда системные (ranks, orders, docs, transfers, recovery, passes, high-staff, drill, hq, apply, roster)
  const SYSTEM_SLUGS = ['ranks', 'orders', 'docs', 'transfers', 'recovery', 'passes', 'high-staff', 'drill', 'hq', 'apply', 'roster', 'decrees', 'regulations'];
  const editableRoutes = allNavItems.filter(nav => {
    const s = nav.href.split('/').pop();
    return s && !SYSTEM_SLUGS.includes(s) && nav.href !== `/${factionId}`;
  });

  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectSlug = (slug: string) => {
    setSelectedSlug(slug);
    const doc = existingDocs.find(d => d.slug === slug);
    if (doc) {
      setTitle(doc.title);
      setContent(doc.content);
    } else {
      const route = editableRoutes.find(r => r.href.endsWith(slug));
      setTitle(route ? route.label : '');
      setContent('');
    }
  };

  const handleSave = async () => {
    if (!selectedSlug || !title || !content) return alert('Заполните все поля');
    setLoading(true);
    await saveFactionDocument(factionId, selectedSlug, title, content);
    alert('Страница успешно сохранена!');
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить контент этой страницы? Она снова станет "Заглушкой".')) return;
    setLoading(true);
    await deleteFactionDocument(factionId, selectedSlug);
    setContent('');
    setSelectedSlug('');
    alert('Страница удалена');
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', marginBottom: '1rem', fontFamily: 'inherit'
  };

  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Выберите раздел, чтобы наполнить его текстом или ссылками. Все ваши сотрудники увидят этот текст при переходе по ссылке.
      </p>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem',  color: 'var(--text-secondary)' }}>Раздел сайта (Вкладка)</label>
        <select value={selectedSlug} onChange={e => handleSelectSlug(e.target.value)} style={inputStyle}>
          <option value="">-- Выберите страницу для редактирования --</option>
          {editableRoutes.map(r => {
            const slug = r.href.split('/').pop() || '';
            const isFilled = existingDocs.some(d => d.slug === slug);
            return (
              <option key={slug} value={slug}>{r.icon} {r.label} {isFilled ? '✅ (Заполнена)' : '❌ (Пустая)'}</option>
            );
          })}
        </select>
      </div>

      {selectedSlug && (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem',  color: 'var(--text-secondary)' }}>Заголовок страницы (H1)</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Напр: Основные регламенты патрулирования" style={inputStyle} />
          
          <label style={{ display: 'block', marginBottom: '0.5rem',  color: 'var(--text-secondary)' }}>Содержимое страницы (Текст)</label>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Совет: Вы можете просто вставить сюда ссылку на ваш Google Документ, если вам так удобнее. Либо скопируйте нужный текст.</p>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={12} required placeholder="Текст страницы..." style={{ ...inputStyle, resize: 'vertical' }} />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>{loading ? 'Сохранение...' : '💾 Опубликовать страницу'}</button>
            {existingDocs.some(d => d.slug === selectedSlug) && (
              <button onClick={handleDelete} disabled={loading} className="btn" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>🗑️ Удалить контент</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
