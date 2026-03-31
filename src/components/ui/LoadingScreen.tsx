'use client';
import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Имитируем прогресс загрузки + ждём реальные ресурсы
    let frame: number;
    let current = 0;

    const tick = () => {
      // Быстро до 70%, потом замедляемся
      if (current < 70) {
        current += 2 + Math.random() * 3;
      } else if (current < 90) {
        current += 0.5 + Math.random();
      }
      current = Math.min(current, 92);
      setProgress(current);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    let finished = false;

    // Ждём полную загрузку window
    const onLoad = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      // Плавно доводим до 100
      let final = progress;
      const finishInterval = setInterval(() => {
        final += 4;
        if (final >= 100) {
          final = 100;
          clearInterval(finishInterval);
          setProgress(100);
          setTimeout(() => setLoaded(true), 300);
          setTimeout(() => setHidden(true), 1000);
        }
        setProgress(final);
      }, 30);
    };

    if (document.readyState === 'complete') {
      setTimeout(onLoad, 500);
    } else {
      window.addEventListener('load', () => setTimeout(onLoad, 300));
    }

    // Fallback: Убираем экран принудительно через 3 секунды, если load не сработал
    const fallbackTimeout = setTimeout(onLoad, 3000);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallbackTimeout);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`${styles.overlay} ${loaded ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        {/* Логотип */}
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>SM</div>
          <div className={styles.glowRing} />
        </div>

        <h1 className={styles.title}>STATE MAJESTIC</h1>
        <p className={styles.subtitle}>Единый портал государственных структур</p>

        {/* Прогресс-бар */}
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            <div className={styles.progressGlow} style={{ left: `${progress}%` }} />
          </div>
          <div className={styles.progressText}>
            <span>Загрузка ресурсов...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Анимированные точки */}
        <div className={styles.dots}>
          <span className={styles.dot} style={{ animationDelay: '0s' }} />
          <span className={styles.dot} style={{ animationDelay: '0.15s' }} />
          <span className={styles.dot} style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}
