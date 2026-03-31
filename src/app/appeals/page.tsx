'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AppealsPage() {
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // В будущем здесь будет обработчик отправки формы в БД или Discord Webhook
  };

  return (
    <div style={{ padding: 'var(--space-2xl) 0', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" className="btn" style={{ marginBottom: 'var(--space-md)', opacity: 0.7 }}>← На главную</Link>
      <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Электронная приёмная</h1>
      <p className="section-subtitle" style={{ marginBottom: 'var(--space-2xl)' }}>Единый портал для подачи обращений, жалоб на сотрудников и заявлений в прокуратуру.</p>

      {submitted ? (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.15)', 
          border: '1px solid rgba(16, 185, 129, 0.3)', 
          padding: '2rem', 
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#10B981', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Обращение отправлено</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Ваше обращение принято в обработку. Номер талона: #{Math.floor(Math.random() * 10000)}</p>
          <button onClick={() => setSubmitted(false)} className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>Отправить новое</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Тип обращения</label>
            <select required style={{ 
              width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', 
              border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px',
              fontFamily: 'inherit', fontSize: '1rem'
            }}>
              <option value="">Выберите тип...</option>
              <option value="complaint">Жалоба на сотрудника (LSPD/SHERIFF/FIB)</option>
              <option value="prosecutor">Обращение в Прокуратуру</option>
              <option value="question">Вопрос Губернатору</option>
              <option value="other">Прочее</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Имя Фамилия (IC)</label>
              <input required type="text" placeholder="John Doe" style={{ 
                width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', 
                border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px',
                fontFamily: 'inherit', fontSize: '1rem'
              }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Номер телефона / Почта</label>
              <input required type="text" placeholder="555-1234 или email@domain.com" style={{ 
                width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', 
                border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px',
                fontFamily: 'inherit', fontSize: '1rem'
              }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Суть обращения</label>
            <textarea required rows={6} placeholder="Опишите ситуацию или ваш вопрос подробно..." style={{ 
              width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', 
              border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px',
              fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical'
            }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Доказательства или документы (ссылки)</label>
            <input type="text" placeholder="Imgur / YouTube (опционально)" style={{ 
              width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', 
              border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px',
              fontFamily: 'inherit', fontSize: '1rem'
            }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
            Отправить обращение
          </button>
        </form>
      )}
    </div>
  );
}
