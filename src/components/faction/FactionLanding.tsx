import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { type FactionConfig, getStatusLabel, getStatusColor } from '@/config/factions';
import styles from './FactionLanding.module.css';

interface Props {
  faction: FactionConfig;
  features?: { icon: string; title: string; desc: string }[];
  stats?: { label: string; value: string }[];
}

export async function FactionLanding({ faction, features = [], stats = [] }: Props) {
  const dbLinks = await prisma.factionLink.findMany({
    where: { factionId: faction.id },
    orderBy: { order: 'asc' }
  });

  return (
    <div className={styles.landing}>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.badge} style={{ color: getStatusColor(faction.status), borderColor: `${getStatusColor(faction.status)}40` }}>
            {getStatusLabel(faction.status)}
          </div>
          <h1 className={styles.title}>{faction.fullName}</h1>
          <p className={styles.motto}>«{faction.motto}»</p>
          <p className={styles.desc}>{faction.description}</p>
          <div className={styles.actions}>
            <Link href={`/${faction.id}/apply`} className="btn btn-primary">Подать заявку</Link>
            <Link href={`/${faction.id}/roster`} className="btn btn-secondary">Состав</Link>
          </div>
        </div>
      </div>

      {stats.length > 0 && (
        <div className={styles.statsRow}>
          {stats.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {features.length > 0 && (
        <div className={styles.features}>
          <h2 className={styles.sectionTitle}>Подразделения и функции</h2>
          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.quickLinks}>
        <h2 className={styles.sectionTitle}>Быстрые ссылки</h2>
        <div className={styles.linkGrid}>
          {faction.navItems.filter(n => n.access === 'guest').map(n => (
            <Link key={n.href} href={n.href} className={styles.quickLink}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
          {dbLinks.filter((l: any) => l.accessLevel === 1).map((l: any) => (
            <Link key={l.id} href={l.href} target={l.isInternal ? '_self' : '_blank'} className={styles.quickLink}>
              <span>{l.icon || '🔗'}</span>
              <span>{l.label}</span>
              <span className={styles.arrow}>{l.isInternal ? '→' : '↗'}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
