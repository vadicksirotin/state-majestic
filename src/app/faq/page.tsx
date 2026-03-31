'use client';
import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    q: 'Как вступить в ряды государственных структур?',
    a: 'Для вступления необходимо соответствовать минимальным критериям фракции (возраст, уровень и т.д.). Выберите нужную структуру на главной странице, нажмите "Подать заявку" и заполните форму. После одобрения вас пригласят на собеседование в игре.'
  },
  {
    q: 'Могу ли я состоять в нескольких фракциях одновременно?',
    a: 'К сожалению, нет. Согласно правилам, вы можете быть сотрудником только одной государственной или криминальной организации одновременно.'
  },
  {
    q: 'Где посмотреть устав моей фракции?',
    a: 'Устав вашей фракции доступен в Личном кабинете после логина, либо на странице самой фракции в разделе информации.'
  },
  {
    q: 'Как мне получить повышение?',
    a: 'Система повышений зависит от вашего отдела и регламентирована руководством. Как правило, вам необходимо проявить активность, написать "Отчет на повышение" через Личный кабинет и дождаться одобрения от High Command.'
  },
  {
    q: 'Что делать, если я получил выговор?',
    a: 'Выговоры (устные и строгие) выдаются за нарушения устава или правил сервера. Для снятия выговора обратитесь к руководству своей фракции или выполните специальные задания, предусмотренные системой отработок.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ padding: 'var(--space-2xl) 0', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" className="btn" style={{ marginBottom: 'var(--space-md)', opacity: 0.7 }}>← На главную</Link>
      <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>FAQ (Частые вопросы)</h1>
      <p className="section-subtitle" style={{ marginBottom: 'var(--space-2xl)' }}>Ответы на самые популярные вопросы о работе портала и государственных структур.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                style={{ 
                  width: '100%', 
                  padding: '1.25rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem'
                }}
              >
                {faq.q}
                <span style={{ 
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.3s ease',
                  color: 'var(--gold)'
                }}>▼</span>
              </button>
              
              <div style={{ 
                maxHeight: isOpen ? '300px' : '0', 
                opacity: isOpen ? 1 : 0, 
                transition: 'all 0.3s ease',
                padding: isOpen ? '0 1.25rem 1.25rem 1.25rem' : '0 1.25rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                {faq.a}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
