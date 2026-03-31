import Link from 'next/link';
import { getFaction } from '@/config/factions';

export default function RulesPage() {
  return (
    <div style={{ padding: 'var(--space-2xl) 0', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <Link href="/" className="btn" style={{ marginBottom: 'var(--space-md)', opacity: 0.7 }}>← На главную</Link>
      <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>Правила Государственных Структур</h1>
      <p className="section-subtitle" style={{ marginBottom: 'var(--space-2xl)' }}>Единый свод правил для всех сотрудников гос. организаций штата San Andreas.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        <section style={{ background: 'rgba(255,255,255,0.03)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: 'var(--space-md)' }}>1. Общие положения</h2>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <li>1.1. Данные правила являются обязательными для исполнения всеми сотрудниками государственных структур.</li>
            <li>1.2. Незнание правил не освобождает от ответственности (IC и OOC).</li>
            <li>1.3. Каждый сотрудник обязан соблюдать субординацию, этический кодекс и законы штата.</li>
          </ul>
        </section>

        <section style={{ background: 'rgba(255,255,255,0.03)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: 'var(--space-md)' }}>2. Обязанности сотрудников</h2>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <li>2.1. Знать и соблюдать законодательную базу штата, внутренний устав своей фракции.</li>
            <li>2.2. Качественно и добросовестно выполнять свои должностные обязанности.</li>
            <li>2.3. Быть беспристрастным при выполнении служебного долга.</li>
            <li>2.4. Сохранять конфиденциальность информации, полученной в ходе служебной деятельности.</li>
          </ul>
        </section>

        <section style={{ background: 'rgba(255,255,255,0.03)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#EF4444', marginBottom: 'var(--space-md)' }}>3. Строго запрещено</h2>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <li>3.1. Использовать служебное положение в личных целях.</li>
            <li>3.2. Нарушать субординацию при общении с коллегами и гражданами.</li>
            <li>3.3. Разглашать государственную тайну.</li>
            <li>3.4. Отсутствовать на рабочем месте в рабочее время без уважительной причины.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
