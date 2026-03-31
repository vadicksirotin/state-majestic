'use client';
import { useState } from 'react';
import { submitItemRequest, submitPromotionReport } from '@/app/actions/factionOps';

interface EmployeeActionsProps {
  factionId: string;
  factionName: string;
}

export function EmployeeActions({ factionId, factionName }: EmployeeActionsProps) {
  const [activeModal, setActiveModal] = useState<'report' | 'request' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await submitPromotionReport(factionId, fd.get('content') as string);
    setLoading(false);
    setActiveModal(null);
    alert('Отчёт на повышение отправлен на рассмотрение!');
  };

  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await submitItemRequest(factionId, {
      itemName: fd.get('itemName') as string,
      amount: Number(fd.get('amount')),
      reason: fd.get('reason') as string,
    });
    setLoading(false);
    setActiveModal(null);
    alert('Запрос на спец. средства отправлен!');
  };

  const modalOverlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const modalBox: React.CSSProperties = {
    background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
    padding: '2rem', width: '90%', maxWidth: '500px',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px',
    marginBottom: '1rem', fontFamily: 'inherit',
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button onClick={() => setActiveModal('report')} className="btn" style={{
          background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', padding: '0.6rem 1.2rem',
        }}>
          📝 Отчёт на повышение
        </button>
        <button onClick={() => setActiveModal('request')} className="btn" style={{
          background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '0.6rem 1.2rem',
        }}>
          🛡️ Запрос спец. средств
        </button>
      </div>

      {activeModal === 'report' && (
        <div style={modalOverlay} onClick={() => setActiveModal(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              📝 Отчёт на повышение — {factionName}
            </h3>
            <form onSubmit={handleReport}>
              <textarea
                name="content"
                placeholder="Опишите свои достижения, проведённые операции, ссылки на доказательства..."
                rows={6} required style={inputStyle}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'Отправка...' : 'Отправить отчёт'}
                </button>
                <button type="button" onClick={() => setActiveModal(null)} className="btn" style={{ opacity: 0.6 }}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'request' && (
        <div style={modalOverlay} onClick={() => setActiveModal(null)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              🛡️ Запрос спец. средств — {factionName}
            </h3>
            <form onSubmit={handleRequest}>
              <input name="itemName" placeholder="Предмет (Бронежилет, Дефибриллятор, Снайперка...)" required style={inputStyle} />
              <input name="amount" type="number" defaultValue={1} min={1} max={99} placeholder="Кол-во" required style={inputStyle} />
              <textarea name="reason" placeholder="Причина запроса (операция, дежурство...)" rows={3} required style={inputStyle} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'Отправка...' : 'Отправить запрос'}
                </button>
                <button type="button" onClick={() => setActiveModal(null)} className="btn" style={{ opacity: 0.6 }}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
