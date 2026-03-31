import Link from 'next/link';
import { FACTION_LIST } from '@/config/factions';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>SM</div>
              <span className={styles.logoText}>State Majestic</span>
            </div>
            <p className={styles.brandDesc}>Единый портал государственных структур штата San Andreas. Все фракции, документы и заявки в одном месте.</p>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Структуры</h4>
            {FACTION_LIST.map(f => (
              <Link key={f.id} href={`/${f.id}`} className={styles.link}>{f.icon} {f.name}</Link>
            ))}
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Портал</h4>
            <Link href="/news" className={styles.link}>Новости</Link>
            <Link href="/search" className={styles.link}>Поиск</Link>
            <Link href="/dashboard" className={styles.link}>Личный кабинет</Link>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Информация</h4>
            <Link href="/rules" className={styles.link}>Правила штата</Link>
            <Link href="/faq" className={styles.link}>FAQ</Link>
            <Link href="/appeals" className={styles.link}>Обращения</Link>
            <a href="https://discord.gg/statemajestic" target="_blank" rel="noopener noreferrer" className={styles.link}>Discord</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© 2024–2026 State Majestic. Все права защищены.</p>
          <p className={styles.disclaimer}>Проект не связан с Rockstar Games. Создано для RP-сообщества.</p>
        </div>
      </div>
    </footer>
  );
}
