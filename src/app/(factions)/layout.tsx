'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getFaction, type FactionId, getStatusLabel, getStatusColor } from '@/config/factions';
import styles from './layout.module.css';

export default function FactionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const factionId = pathname.split('/')[1] as FactionId;
  const faction = getFaction(factionId);

  if (!faction) return <>{children}</>;

  return (
    <div className={styles.layout} style={{ '--accent': faction.accentColor, '--accent-dim': faction.accentColorDim, '--accent-glow': `${faction.accentColor}25` } as React.CSSProperties}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarIcon}>{faction.icon}</span>
          <div>
            <div className={styles.sidebarName}>{faction.name}</div>
            <div className={styles.sidebarStatus} style={{ color: getStatusColor(faction.status) }}>
              {getStatusLabel(faction.status)}
            </div>
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          {faction.navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`${styles.sidebarLink} ${isActive ? styles.active : ''}`}>
                <span className={styles.linkIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className={styles.content}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Главная</Link>
          <span className={styles.sep}>/</span>
          <Link href={`/${factionId}`}>{faction.name}</Link>
          {pathname !== `/${factionId}` && (
            <>
              <span className={styles.sep}>/</span>
              <span className={styles.current}>
                {faction.navItems.find(n => n.href === pathname)?.label || pathname.split('/').pop()}
              </span>
            </>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
