import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getFaction } from "@/config/factions";
import { makeMeRootAdmin } from '@/app/actions/dev';
import { isDevUser } from '@/lib/devAuth';
import { EmployeeActions } from "@/components/employee/EmployeeActions";
import styles from "./Dashboard.module.css";
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const userId = session.user.id;

  const applications = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  const rosterEntries = await prisma.rosterEntry.findMany({
    where: { userId }
  });

  // Получаем настройки фракций для определения Хай-Ранга
  const factionSettingsAll = await prisma.factionSettings.findMany();
  const settingsMap: Record<string, any> = {};
  factionSettingsAll.forEach(s => { settingsMap[s.factionId] = s; });

  // Получаем активные выговоры
  const reprimands = await prisma.reprimand.findMany({
    where: { userId, isActive: true }
  });

  // Получаем мои запросы
  const myItemRequests = await prisma.itemRequest.findMany({
    where: { requesterId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const myReports = await prisma.promotionReport.findMany({
    where: { reporterId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      default: return 'На рассмотрении';
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className="section-title">Личный кабинет</h1>
      <div className={styles.profileHeader}>
        {session.user.image ? (
          <img src={session.user.image} alt="Avatar" className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>{session.user.name?.[0] || '?'}</div>
        )}
        <div>
          <h2 className={styles.userName}>{session.user.name}</h2>
          <p className={styles.userRole}>Discord ID: {session.user.discordId}</p>
          {reprimands.length > 0 && (
            <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: 4 }}>
              ⚠️ Активных выговоров: {reprimands.length}/3
            </p>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {/* --- Мои Должности --- */}
        <section className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ margin: 0, padding: 0, border: 'none' }}>Мои должности</h3>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {isDevUser(session.user.discordId) && (
                <>
                  <Link href="/admin" className="btn" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                    👑 Админ-панель
                  </Link>
                  <form action={async () => { 'use server'; await makeMeRootAdmin(); }}>
                    <button type="submit" className="btn" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} title="DEV: Admin во всех фракциях">
                      🛠️ DEV
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {rosterEntries.length === 0 ? (
            <p className={styles.empty}>Вы ещё не состоите ни в одной гос. структуре.</p>
          ) : (
            <div className={styles.list}>
              {rosterEntries.map((entry: any) => {
                const faction = getFaction(entry.factionId as any);
                const settings = settingsMap[entry.factionId];
                const isHighCommand = settings ? entry.rankWeight >= settings.highCommandRank : entry.rankWeight >= 10;
                const isLeader = settings ? entry.rankWeight >= settings.leaderRank : entry.rankWeight >= 15;

                return (
                  <div key={entry.id}>
                    <div className={styles.listItem}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{faction?.icon}</span>
                        <div>
                          <strong>{faction?.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {entry.rank} (вес: {entry.rankWeight})
                            {entry.department && ` • ${entry.department}`}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {isLeader && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(255,215,0,0.15)', color: '#FFD700', padding: '2px 8px', borderRadius: '8px' }}>Лидер</span>
                        )}
                        {isHighCommand && !isLeader && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(139,92,246,0.15)', color: '#A78BFA', padding: '2px 8px', borderRadius: '8px' }}>High Command</span>
                        )}
                        {(isHighCommand || isLeader) && (
                          <Link href={`/${entry.factionId}/hq`} className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', background: 'rgba(255,215,0,0.1)', color: '#FFD700' }}>
                            Панель HQ →
                          </Link>
                        )}
                      </div>
                    </div>
                    {/* Кнопки сотрудника — Отчёт и Запрос */}
                    <EmployeeActions factionId={entry.factionId} factionName={faction?.name || entry.factionId} />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* --- Мои Заявки --- */}
        <section className={styles.card}>
          <h3>Мои заявки</h3>
          {applications.length === 0 ? (
            <p className={styles.empty}>Вы не подавали заявлений.</p>
          ) : (
            <div className={styles.list}>
              {applications.map((app: any) => {
                const faction = getFaction(app.factionId as any);
                return (
                  <div key={app.id} className={styles.listItem}>
                    <div>
                      <strong>Заявление в {faction?.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={styles.statusBadge} style={{ color: getStatusColor(app.status), backgroundColor: `${getStatusColor(app.status)}15` }}>
                      {getStatusText(app.status)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/#factions" className="btn btn-secondary" style={{ marginTop: 'var(--space-md)', width: '100%' }}>
            Подать новую заявку
          </Link>
        </section>

        {/* --- Мои Запросы и Отчёты --- */}
        {(myItemRequests.length > 0 || myReports.length > 0) && (
          <section className={styles.card} style={{ gridColumn: '1 / -1' }}>
            <h3>Статус моих запросов</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {myItemRequests.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#F59E0B', marginBottom: '0.5rem' }}>Спец. средства</h4>
                  {myItemRequests.map((req: any) => (
                    <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ fontSize: '0.85rem' }}>{req.itemName} ×{req.amount}</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', color: getStatusColor(req.status), background: `${getStatusColor(req.status)}15` }}>
                        {getStatusText(req.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {myReports.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#60A5FA', marginBottom: '0.5rem' }}>Отчёты на повышение</h4>
                  {myReports.map((r: any) => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', color: getStatusColor(r.status), background: `${getStatusColor(r.status)}15` }}>
                        {getStatusText(r.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
