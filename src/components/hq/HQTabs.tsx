'use client';
import { useState } from 'react';
import styles from './HQTabs.module.css';

interface HQTabsProps {
  factionId: string;
  applicationsComponent: React.ReactNode;
  rosterComponent: React.ReactNode;
  newsComponent?: React.ReactNode;
  reviewsComponent?: React.ReactNode;
  leaderComponent?: React.ReactNode;
  isLeader?: boolean;
}

export function HQTabs({ factionId, applicationsComponent, rosterComponent, newsComponent, reviewsComponent, leaderComponent, isLeader }: HQTabsProps) {
  const [activeTab, setActiveTab] = useState<'applications' | 'roster' | 'reviews' | 'news' | 'settings'>('applications');

  const canPostNews = factionId === 'government' || factionId === 'weazel';

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'applications' ? styles.active : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Заявки
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'roster' ? styles.active : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          Управление составом
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Запросы и Отчёты
        </button>
        {canPostNews && newsComponent && (
          <button 
            className={`${styles.tab} ${activeTab === 'news' ? styles.active : ''}`}
            onClick={() => setActiveTab('news')}
          >
            Новости
          </button>
        )}
        {isLeader && leaderComponent && (
          <button 
            className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Настройки
          </button>
        )}
      </div>

      <div className={styles.content}>
        {activeTab === 'applications' && applicationsComponent}
        {activeTab === 'roster' && rosterComponent}
        {activeTab === 'reviews' && reviewsComponent}
        {activeTab === 'news' && canPostNews && newsComponent}
        {activeTab === 'settings' && isLeader && leaderComponent}
      </div>
    </div>
  );
}
