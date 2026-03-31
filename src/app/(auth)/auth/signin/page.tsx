'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FACTION_LIST } from '@/config/factions';
import styles from './page.module.css';

export default function MockSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Имитация задержки логина
    setTimeout(() => {
      // Здесь в будущем будет установка реальной сессии NextAuth
      // Пока просто эмулируем переход на dashboard
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>SM</div>
          <span>State Majestic</span>
        </div>
        
        <h1 className={styles.title}>Вход в систему</h1>
        <p className={styles.desc}>Авторизуйтесь через Discord для доступа к закрытым разделам фракций и персонализированному порталу.</p>
        
        <form onSubmit={handleLogin}>
          <button type="submit" disabled={loading} className={`btn btn-discord ${styles.loginBtn}`}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <svg width="24" height="18" viewBox="0 0 71 55" fill="currentColor"><path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.3 37.3 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.1a58.7 58.7 0 0017.7 9a.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.6 38.6 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .3 36.3 36.3 0 01-5.5 2.7.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.8.2.2 0 00.3.1A58.5 58.5 0 0070.3 45.6v-.1c1.4-14.9-2.4-27.8-10.1-39.3a.2.2 0 00-.1-.1zM23.7 37.3c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7zm23 0c-3.4 0-6.2-3.1-6.2-7s2.7-7 6.2-7 6.3 3.2 6.2 7-2.8 7-6.2 7z"/></svg>
                Продолжить с Discord
              </>
            )}
          </button>
        </form>

        <div className={styles.info}>
          <p>После авторизации система проверит ваши роли на серверах фракций:</p>
          <div className={styles.factionPills}>
            {FACTION_LIST.map(f => (
              <span key={f.id} className={styles.pill} style={{ '--fc': f.accentColor } as React.CSSProperties}>
                {f.icon} {f.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
