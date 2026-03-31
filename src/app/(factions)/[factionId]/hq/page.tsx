import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getFaction, type FactionId } from '@/config/factions';
import { processApplication } from '@/app/actions/hq';
import { HQTabs } from '@/components/hq/HQTabs';
import { MemberContextMenu, ReviewPanel } from '@/components/hq/HQControls';
import { NewsPublisher } from '@/components/hq/NewsPublisher';
import { LeaderSettings } from '@/components/hq/LeaderSettings';
import { fireMember } from '@/app/actions/hqRoster';

interface PageProps {
  params: Promise<{ factionId: string }>;
}

export default async function HQPage({ params }: PageProps) {
  const resolvedParams = await params;
  const factionId = resolvedParams.factionId as FactionId;
  const faction = getFaction(factionId);

  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  // Получаем настройки фракции
  const factionSettings = await prisma.factionSettings.findUnique({ where: { factionId } });
  const highCommandMin = factionSettings?.highCommandRank ?? 10;
  const leaderMin = factionSettings?.leaderRank ?? 15;

  // Проверяем ранг пользователя в этой фракции
  const myEntry = await prisma.rosterEntry.findUnique({
    where: { userId_factionId: { userId: session.user.id, factionId } }
  });

  // Доступ к HQ: только если ранг >= highCommandMin ИЛИ если есть старая роль admin/high-command
  const hasRoleAccess = session.user.roles?.some(
    r => r.factionId === factionId && ['high-command', 'admin'].includes(r.roleLevel)
  );
  const hasRankAccess = myEntry && myEntry.rankWeight >= highCommandMin;
  
  if (!hasRoleAccess && !hasRankAccess) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1 style={{ color: '#EF4444' }}>Доступ запрещен</h1>
        <p style={{ color: 'var(--text-muted)' }}>Эта страница доступна только для High Command (мин. вес ранга: {highCommandMin}).</p>
      </div>
    );
  }

  const isLeader = (myEntry && myEntry.rankWeight >= leaderMin) || session.user.roles?.some(r => r.factionId === factionId && r.roleLevel === 'admin');

  // --- DATA FETCHING ---
  const pendingApps = await prisma.application.findMany({
    where: { factionId, status: 'pending' },
    include: { user: true },
    orderBy: { createdAt: 'asc' }
  });

  const rosterMembers = await prisma.rosterEntry.findMany({
    where: { factionId },
    include: { user: true },
    orderBy: { rankWeight: 'desc' }
  });

  const itemRequests = await prisma.itemRequest.findMany({
    where: { factionId },
    orderBy: { createdAt: 'desc' },
    take: 30
  });

  const promotionReports = await prisma.promotionReport.findMany({
    where: { factionId },
    orderBy: { createdAt: 'desc' },
    take: 30
  });

  const departments = await prisma.department.findMany({
    where: { factionId },
    orderBy: { name: 'asc' }
  });

  const activityLogs = await prisma.activityLog.findMany({
    where: { factionId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const ranks = await prisma.factionRank.findMany({
    where: { factionId },
    orderBy: { weight: 'asc' }
  });

  const links = await prisma.factionLink.findMany({
    where: { factionId },
    orderBy: { order: 'asc' }
  });

  const docs = await prisma.factionDocument.findMany({
    where: { factionId }
  });

  // --- APPLICATIONS TAB ---
  const applicationsComponent = (
    <div>
      <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-md)' }}>Заявки в академию ({pendingApps.length})</h2>
      {pendingApps.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Нет ожидающих заявок.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {pendingApps.map(app => {
            let formData: any = {};
            try {
              formData = JSON.parse(app.formData);
            } catch (e) {
              formData = { fullName: app.user.name, age: '?', experience: '?', reason: app.formData };
            }
            return (
              <div key={app.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>Кандидат: {formData.fullName || app.user.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Discord: {app.user.discordId}</p>
                <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: 8 }}><strong>Возраст:</strong> {formData.age}</p>
                  <p style={{ fontSize: '0.9rem', marginBottom: 8 }}><strong>Опыт:</strong> {formData.experience}</p>
                  <p style={{ fontSize: '0.9rem' }}><strong>Мотивация:</strong> {formData.reason}</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                  <form action={async () => { 'use server'; await processApplication(app.id, factionId, 'approved'); }}>
                    <button type="submit" className="btn" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '0.4rem 1rem' }}>✅ Принять</button>
                  </form>
                  <form action={async () => { 'use server'; await processApplication(app.id, factionId, 'rejected'); }}>
                    <button type="submit" className="btn" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', padding: '0.4rem 1rem' }}>❌ Отклонить</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // --- ROSTER TAB (with 3-dots menu for high command) ---
  const rosterComponent = (
    <div>
      <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-md)' }}>Состав ({rosterMembers.length})</h2>
      {rosterMembers.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Штат пуст.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {rosterMembers.map((member: any) => (
            <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div>
                  <strong>{member.user.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {member.rank}
                    {member.department && ` • ${member.department}`}
                    {member.rankWeight >= highCommandMin && (
                      <span style={{ marginLeft: 8, fontSize: '0.7rem', color: '#A78BFA', background: 'rgba(139,92,246,0.15)', padding: '1px 6px', borderRadius: '6px' }}>HC</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <form action={async () => { 'use server'; await fireMember(member.id, factionId); }}>
                  <button type="submit" className="btn" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Уволить</button>
                </form>
                <MemberContextMenu member={member} factionId={factionId} isLeader={!!isLeader} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: 'var(--space-2xl) 0', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="section-title" style={{ fontSize: '2.5rem' }}>High Command: {faction?.name}</h1>
      <p className="section-subtitle">
        Панель управления фракцией • Мин. вес HC: {highCommandMin} • Мин. вес Лидер: {leaderMin}
      </p>

      <div style={{ marginTop: 'var(--space-3xl)' }}>
        <HQTabs
          factionId={factionId}
          applicationsComponent={applicationsComponent}
          rosterComponent={rosterComponent}
          reviewsComponent={<ReviewPanel itemRequests={itemRequests} promotionReports={promotionReports} />}
          newsComponent={<NewsPublisher factionId={factionId} />}
          leaderComponent={<LeaderSettings factionId={factionId} settings={factionSettings} departments={departments} activityLogs={activityLogs} ranks={ranks} links={links} docs={docs as any} />}
          isLeader={!!isLeader}
        />
      </div>
    </div>
  );
}
