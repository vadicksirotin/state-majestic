'use client';
import { useState } from 'react';
import { type FactionConfig } from '@/config/factions';
import { submitApplication } from '@/app/actions/applications';
import styles from './ApplicationForm.module.css';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  options?: string[];
  required?: boolean;
}

const DEFAULT_FIELDS: FormField[] = [
  { id: 'fullName', label: 'Имя Фамилия (RP)', type: 'text', required: true },
  { id: 'age', label: 'Сколько лет проживаете в штате (Уровень)', type: 'number', required: true },
  { id: 'experience', label: 'Опыт работы в гос. структурах', type: 'textarea', required: true },
  { id: 'reason', label: 'Почему вы хотите к нам?', type: 'textarea', required: true },
];

export function ApplicationForm({ faction }: { faction: FactionConfig }) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await submitApplication(faction.id, formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка при отправке заявки');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (submitted) {
    return (
      <div className={styles.success}>
        <h3>✅ Заявка успешно отправлена!</h3>
        <p>Ожидайте ответа в разделе уведомлений или в Discord {faction.name}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {DEFAULT_FIELDS.map(f => (
        <label key={f.id} className={styles.field}>
          <span className={styles.label}>{f.label} {f.required && <span className={styles.req}>*</span>}</span>
          {f.type === 'textarea' ? (
            <textarea 
              className={styles.input} 
              rows={4} 
              required={f.required}
              value={formData[f.id] || ''}
              onChange={e => handleChange(f.id, e.target.value)}
            />
          ) : (
            <input 
              className={styles.input} 
              type={f.type} 
              required={f.required}
              value={formData[f.id] || ''}
              onChange={e => handleChange(f.id, e.target.value)}
            />
          )}
        </label>
      ))}
      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
        {loading ? 'Отправка...' : 'Отправить заявление'}
      </button>
    </form>
  );
}
