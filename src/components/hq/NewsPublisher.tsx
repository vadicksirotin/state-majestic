'use client';
import { useState } from 'react';
import { publishNews } from '@/app/actions/hqNews';

export function NewsPublisher({ factionId }: { factionId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    await publishNews(factionId, {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tags: formData.get('tags') as string,
    });

    e.currentTarget.reset();
    setLoading(false);
    alert('Новость успешно опубликована!');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '600px' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
        Только Правительство (gov) и Weazel News имеют доступ к этой панели по закону штата. Опубликованные записи появятся в разделе /news.
      </p>

      <input 
        name="title"
        placeholder="Заголовок новости (например: 'Обновление налогового кодекса')" 
        required 
        style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: 'var(--radius-md)' }}
      />
      <textarea 
        name="content"
        placeholder="Текст публикации..." 
        rows={6}
        required 
        style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: 'var(--radius-md)' }}
      />
      <input 
        name="tags"
        placeholder="Теги через запятую (Gov, Выборы, Финансы)" 
        required 
        style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: 'var(--radius-md)' }}
      />
      
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '0.8rem' }}>
        {loading ? 'Публикация...' : 'Опубликовать Новость'}
      </button>
    </form>
  );
}
