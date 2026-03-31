'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FACTION_LIST } from '@/config/factions';
import styles from './Header.module.css';

export function Header() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [factionsOpen, setFactionsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>SM</div>
          <span className={styles.logoText}>State Majestic</span>
        </Link>

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={() => setMobileOpen(false)}>Главная</Link>
          
          <div className={styles.dropdown} onMouseEnter={() => setFactionsOpen(true)} onMouseLeave={() => setFactionsOpen(false)}>
            <button className={styles.navLink}>
              Структуры <span className={styles.arrow}>▾</span>
            </button>
            {factionsOpen && (
              <div className={styles.dropdownMenu}>
                {FACTION_LIST.map(f => (
                  <Link key={f.id} href={`/${f.id}`} className={styles.dropdownItem} onClick={() => { setFactionsOpen(false); setMobileOpen(false); }}>
                    <span className={styles.dropdownIcon}>{f.icon}</span>
                    <div>
                      <div className={styles.dropdownName}>{f.name}</div>
                      <div className={styles.dropdownDesc}>{f.motto}</div>
                    </div>
                    <span className={styles.statusDot} style={{ backgroundColor: f.status === 'open' ? '#22C55E' : f.status === 'recruitment' ? '#F59E0B' : f.status === 'closed' ? '#EF4444' : '#8B5CF6' }} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/news" className={styles.navLink} onClick={() => setMobileOpen(false)}>Новости</Link>
          <Link href="/search" className={styles.navLink} onClick={() => setMobileOpen(false)}>Поиск</Link>
        </nav>

        <div className={styles.actions}>
          {status === 'loading' ? (
            <div style={{ width: 100, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }} />
          ) : session ? (
            <div className={styles.userMenu}>
              <Link href="/dashboard" className={styles.profileLink}>
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className={styles.avatar} width={36} height={36} />
                ) : (
                  <div className={styles.avatarFallback}>{session?.user?.name?.[0] || '?'}</div>
                )}
                <span className={styles.userName}>{session.user.name}</span>
              </Link>
              <button onClick={() => signOut()} className="btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                Выйти
              </button>
            </div>
          ) : (
            <button onClick={() => signIn('discord')} className={`btn btn-discord ${styles.loginBtn}`}>
              <svg width="20" height="15" viewBox="0 0 71 55" fill="currentColor"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.3 37.3 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.1a58.7 58.7 0 0017.7 9a.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.6 38.6 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .3 36.3 36.3 0 01-5.5 2.7.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.8.2.2 0 00.3.1A58.5 58.5 0 0070.3 45.6v-.1c1.4-14.9-2.4-27.8-10.1-39.3a.2.2 0 00-.1-.1zM23.7 37.3c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm23 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7z"/></svg>
              Войти
            </button>
          )}

          <button className={styles.burger} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
