'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FACTION_LIST, getStatusLabel, getStatusColor } from '@/config/factions';
import { HeroModel } from '@/components/three/HeroModel';
import styles from './page.module.css';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return <section ref={ref} className={`reveal ${className}`}>{children}</section>;
}

const NEWS_ITEMS = [
  { title: 'Губернатор подписал указ о реформе LSPD', date: '30 марта 2026', tag: 'Правительство', color: '#C9A84C' },
  { title: 'EMS объявляет набор в отдел реабилитации', date: '29 марта 2026', tag: 'EMS', color: '#EF4444' },
  { title: 'SANG провели учения у форта Занкудо', date: '28 марта 2026', tag: 'SANG', color: '#84CC16' },
  { title: 'FIB раскрыл крупную операцию', date: '27 марта 2026', tag: 'FIB', color: '#F59E0B' },
];

const STEPS = [
  { num: '01', title: 'Изучите', desc: 'Ознакомьтесь со структурами штата и выберите направление' },
  { num: '02', title: 'Выберите', desc: 'Определите фракцию, которая вам ближе по духу' },
  { num: '03', title: 'Подайте заявку', desc: 'Заполните форму на странице выбранной структуры' },
  { num: '04', title: 'Пройдите отбор', desc: 'Собеседование и обучение в академии фракции' },
  { num: '05', title: 'Служите штату', desc: 'Станьте частью команды и развивайтесь в карьере' },
];

// Генерируем статичные значения для частиц один раз, чтобы избежать Hydration Mismatch
const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  left: `${(Math.sin(i * 1.5) * 50 + 50).toFixed(2)}%`,
  top: `${(Math.cos(i * 2.3) * 50 + 50).toFixed(2)}%`,
  delay: `${(Math.abs(Math.sin(i * 3.1) * 8)).toFixed(2)}s`,
  duration: `${(6 + Math.abs(Math.cos(i * 1.7) * 6)).toFixed(2)}s`,
}));

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* === HERO === */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroGlow1} />
          <div className={styles.heroGlow2} />
          <div className={styles.heroGrid} />
          {PARTICLES.map((p, i) => (
            <div key={i} className={styles.particle} style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }} />
          ))}
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}>Единый портал штата</div>
          <h1 className={styles.heroTitle}>
            STATE<br /><span className={styles.heroAccent}>MAJESTIC</span>
          </h1>
          <p className={styles.heroSub}>
            Центральный портал всех государственных структур штата San Andreas.
            Правительство, полиция, медицина, армия и спецслужбы — в одной системе.
          </p>
          <div className={styles.heroCta}>
            <button className="btn btn-discord" onClick={() => signIn('discord')}>
              <svg width="20" height="15" viewBox="0 0 71 55" fill="currentColor"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.3 37.3 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.1a58.7 58.7 0 0017.7 9a.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.6 38.6 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .3 36.3 36.3 0 01-5.5 2.7.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.8.2.2 0 00.3.1A58.5 58.5 0 0070.3 45.6v-.1c1.4-14.9-2.4-27.8-10.1-39.3a.2.2 0 00-.1-.1zM23.7 37.3c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm23 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7z" /></svg>
              Войти через Discord
            </button>
            <Link href="#factions" className="btn btn-primary">Изучить структуры</Link>
            <Link href="#newcomer" className="btn btn-secondary">Подать заявку</Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}><span className={styles.statNum}>7</span><span className={styles.statLabel}>Структур</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span className={styles.statNum}>80+</span><span className={styles.statLabel}>Разделов</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span className={styles.statNum}>24/7</span><span className={styles.statLabel}>Онлайн</span></div>
          </div>
        </div>
        <div className={styles.heroModel}>
          <HeroModel />
          <div className={styles.modelGlow} />
        </div>
        <div className={styles.heroScroll}>
          <div className={styles.scrollLine} />
          <span>Scroll</span>
        </div>
      </section>

      {/* === FACTIONS === */}
      <Section className={`section ${styles.factions}`}>
        <div className="container" id="factions">
          <div className="divider" />
          <h2 className="section-title">Государственные структуры</h2>
          <p className="section-subtitle">Каждая структура — отдельная зона со своей командой, документами и карьерой</p>
          <div className={styles.factionGrid}>
            {FACTION_LIST.map(f => (
              <Link key={f.id} href={`/${f.id}`} className={styles.factionCard} style={{ '--fc': f.accentColor } as React.CSSProperties}>
                <div className={styles.factionCardGlow} />
                <div className={styles.factionHeader}>
                  <span className={styles.factionIcon}>{f.icon}</span>
                  <span className={styles.factionBadge} style={{ color: getStatusColor(f.status), borderColor: `${getStatusColor(f.status)}40` }}>
                    <span className={styles.badgeDot} style={{ background: getStatusColor(f.status) }} />
                    {getStatusLabel(f.status)}
                  </span>
                </div>
                <h3 className={styles.factionName}>{f.name}</h3>
                <p className={styles.factionFullName}>{f.fullName}</p>
                <p className={styles.factionDesc}>{f.description}</p>
                <div className={styles.factionFooter}>
                  <span className={styles.factionLink}>Подробнее →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* === HOW STATE WORKS === */}
      <Section className={`section ${styles.structure}`}>
        <div className="container">
          <div className="divider" />
          <h2 className="section-title">Как устроен штат</h2>
          <p className="section-subtitle">Иерархия и взаимодействие государственных структур</p>
          <div className={styles.orgChart}>
            <div className={styles.orgTop}>
              <div className={styles.orgNode} style={{ '--nc': '#C9A84C' } as React.CSSProperties}>
                <span>🏛️</span>
                <strong>Government</strong>
                <small>Высшая власть</small>
              </div>
            </div>
            <div className={styles.orgLine} />
            <div className={styles.orgRow}>
              {[
                { icon: '🚔', name: 'LSPD', desc: 'Полиция', color: '#3B82F6' },
                { icon: '⭐', name: 'Sheriff', desc: 'Шериф', color: '#D97706' },
                { icon: '🚑', name: 'EMS', desc: 'Медицина', color: '#EF4444' },
              ].map(n => (
                <div key={n.name} className={styles.orgNode} style={{ '--nc': n.color } as React.CSSProperties}>
                  <span>{n.icon}</span><strong>{n.name}</strong><small>{n.desc}</small>
                </div>
              ))}
            </div>
            <div className={styles.orgLine} />
            <div className={styles.orgRow}>
              {[
                { icon: '🕵️', name: 'FIB', desc: 'Федеральное бюро', color: '#F59E0B' },
                { icon: '🛡️', name: 'USSS', desc: 'Секретная служба', color: '#D4AF37' },
                { icon: '🪖', name: 'SANG', desc: 'Нац. гвардия', color: '#84CC16' },
              ].map(n => (
                <div key={n.name} className={styles.orgNode} style={{ '--nc': n.color } as React.CSSProperties}>
                  <span>{n.icon}</span><strong>{n.name}</strong><small>{n.desc}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* === RECRUITMENT === */}
      <Section className={`section ${styles.recruitment}`}>
        <div className="container">
          <div className="divider" />
          <h2 className="section-title">Открыт набор</h2>
          <p className="section-subtitle">Структуры, которые сейчас ищут новых сотрудников</p>
          <div className={styles.recruitGrid}>
            {FACTION_LIST.filter(f => f.status === 'open' || f.status === 'recruitment').map(f => (
              <Link key={f.id} href={`/${f.id}/apply`} className={styles.recruitCard} style={{ '--fc': f.accentColor } as React.CSSProperties}>
                <div className={styles.recruitIcon}>{f.icon}</div>
                <div>
                  <h4 className={styles.recruitName}>{f.name}</h4>
                  <p className={styles.recruitStatus} style={{ color: getStatusColor(f.status) }}>{getStatusLabel(f.status)}</p>
                </div>
                <span className={styles.recruitArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* === NEWCOMER PATH === */}
      <Section className={`section ${styles.newcomer}`} >
        <div className="container" id="newcomer">
          <div className="divider" />
          <h2 className="section-title">Путь новичка</h2>
          <p className="section-subtitle">5 простых шагов от гражданского до сотрудника</p>
          <div className={styles.timeline}>
            {STEPS.map((s, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineNum}>{s.num}</div>
                <div className={styles.timelineContent}>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* === NEWS === */}
      <Section className={`section ${styles.news}`}>
        <div className="container">
          <div className="divider" />
          <div className={styles.newsHeader}>
            <div>
              <h2 className="section-title">Новости и объявления</h2>
              <p className="section-subtitle">Последние события в жизни штата</p>
            </div>
            <Link href="/news" className="btn btn-secondary">Все новости →</Link>
          </div>
          <div className={styles.newsGrid}>
            {NEWS_ITEMS.map((n, i) => (
              <article key={i} className={styles.newsCard}>
                <div className={styles.newsTag} style={{ color: n.color, borderColor: `${n.color}40` }}>{n.tag}</div>
                <h4 className={styles.newsTitle}>{n.title}</h4>
                <time className={styles.newsDate}>{n.date}</time>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* === WEAZEL NEWS === */}
      <Section className={`section ${styles.weazel}`}>
        <div className="container">
          <div className={styles.weazelBanner}>
            <div className={styles.weazelGlow} />
            <div className={styles.weazelContent}>
              <div className={styles.weazelLogo}>📺 WEAZEL NEWS</div>
              <h3 className={styles.weazelTitle}>Официальный медиа-канал штата</h3>
              <p className={styles.weazelDesc}>Репортажи, интервью, аналитика. Голос штата San Andreas.</p>
              <div className={styles.weazelLinks}>
                <Link href="/news" className="btn btn-primary">Читать новости</Link>
                <Link href="/news" className="btn btn-secondary">Стажировки и вакансии</Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* === CONTACTS === */}
      <Section className={`section ${styles.contacts}`}>
        <div className="container">
          <div className="divider" />
          <h2 className="section-title">Контакты и обращения</h2>
          <p className="section-subtitle">Свяжитесь с нами или подайте обращение</p>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>💬</span>
              <h4>Discord</h4>
              <p>Основной канал связи со всеми структурами штата</p>
              <a href="https://discord.gg/statemajestic" target="_blank" rel="noopener noreferrer" className="btn btn-discord" style={{ width: '100%', marginTop: 'auto' }}>Перейти в Discord</a>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>📨</span>
              <h4>Обращения</h4>
              <p>Официальные обращения к правительству и структурам</p>
              <Link href="/appeals" className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>Подать обращение</Link>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>📢</span>
              <h4>Жалобы</h4>
              <p>Сообщите о нарушениях сотрудников государственных структур</p>
              <Link href="/appeals" className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>Подать жалобу</Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
