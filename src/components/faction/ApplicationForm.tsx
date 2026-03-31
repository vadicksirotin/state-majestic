'use client';
import { useState } from 'react';
import { submitMultiApplication } from '@/app/actions/factionPagesOps';
import { useSession } from 'next-auth/react';

export function ApplicationForm({ factionId, type, title }: { factionId: string, type: 'transfer' | 'recovery' | 'academy', title: string }) {
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
    const data: Record<string, string> = {};
    fd.forEach((value, key) => { data[key] = value.toString() });

    try {
      await submitMultiApplication(factionId, type, data);
      setSuccess(true);
    } catch(err: any) {
      alert('Ошибка отправки: ' + err.message);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <h2 style={{ color: '#10B981', marginBottom: '1rem' }}>Заявка успешно отправлена!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Руководство рассмотрит ее в ближайшее время. Ожидайте решения.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-2xl) 0' }}>
      <h1 className="section-title">{title}</h1>
      <p className="section-subtitle">Заполните форму строго по шаблону</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '2rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        
        {type === 'transfer' && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Ваша текущая фракция</label>
              <input name="currentFaction" required placeholder="Напр: LSPD" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Ваш текущий ранг</label>
              <input name="currentRank" required placeholder="Напр: 5-й ранг, Офицер" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Ссылка на одобрение лидера (Скриншот)</label>
              <input name="proof" type="url" required placeholder="https://imgur.com/..." style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
            </div>
          </>
        )}

        {type === 'recovery' && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Ваш старый ранг</label>
              <input name="oldRank" required placeholder="Какой ранг у вас был до увольнения?" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Дата и причина увольнения</label>
              <input name="dismissalReason" required placeholder="Напр: 12.03.2023 - ПСЖ" style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Док-ва работы (Скриншот /history)</label>
              <input name="historyProof" type="url" required placeholder="https://imgur.com/..." style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
            </div>
          </>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Комментарий к заявке (Опционально)</label>
          <textarea name="comment" rows={3} placeholder="Любая дополнительная информация..." style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', fontFamily: 'inherit' }} />
        </div>

        <button type="submit" disabled={loading || !session} className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', width: '100%' }}>
          {loading ? 'Отправка...' : session ? 'Отправить заявку' : 'Войдите чтобы оставить заявку'}
        </button>
      </form>
    </div>
  );
}
