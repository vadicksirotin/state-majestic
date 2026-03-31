'use client';
import { useState } from 'react';
import { submitPassRequest } from '@/app/actions/factionPagesOps';
import { useSession } from 'next-auth/react';
import { type FactionConfig } from '@/config/factions';

export function PassRequestFormClient({ faction }: { faction: FactionConfig }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      alert("Необходимо авторизоваться через Discord");
      return;
    }
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const purpose = fd.get('purpose') as string;
    const duration = fd.get('duration') as string;

    try {
      await submitPassRequest(faction.id, purpose, duration);
      setSuccess(true);
    } catch(err: any) {
      alert('Ошибка отправки: ' + err.message);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <h2 style={{ color: '#10B981', marginBottom: '1rem' }}>Запрос пропуска отправлен!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Ожидайте одобрения руководства. Вы получите уведомление в дискорде или в игре.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-2xl) 0' }}>
      <h1 className="section-title">Запрос пропуска на территорию</h1>
      <p className="section-subtitle">Заполните данные для временного {faction.name} Pass</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '2rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Ваше имя (Игровое)</label>
          <input name="name" defaultValue={session?.user?.name || ''} readOnly style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', cursor: 'not-allowed' }} />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Подробная цель получения пропуска</label>
          <textarea name="purpose" rows={3} required placeholder="Например: Поставка материалов, визит к детективу, перевод." style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', fontFamily: 'inherit' }} />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Срок действия</label>
          <select name="duration" required style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}>
            <option value="1 час">1 час</option>
            <option value="3 часа">3 часа</option>
            <option value="1 день (Гостевой)">1 день (Гостевой)</option>
            <option value="На срок контракта">На срок контракта</option>
          </select>
        </div>

        <button type="submit" disabled={loading || !session} className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', width: '100%' }}>
          {loading ? 'Отправка...' : session ? 'Оформить заявку на пропуск' : 'Войдите чтобы оставить заявку'}
        </button>
      </form>
    </div>
  );
}
