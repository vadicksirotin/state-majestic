import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isDevUser } from '@/lib/devAuth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminPanel } from '@/components/admin/AdminPanel';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !isDevUser(session.user.discordId)) {
    redirect('/');
  }

  const totalUsers = await prisma.user.count();
  const totalRoster = await prisma.rosterEntry.count();
  const totalApps = await prisma.application.count({ where: { status: 'pending' } });

  return (
    <div style={{ padding: 'var(--space-2xl) 0', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>👑 DEV Админ-панель</h1>
          <p className="section-subtitle">Полный контроль над порталом State Majestic</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: 'var(--space-3xl)' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.2)', padding: '1.25rem', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#A78BFA' }}>{totalUsers}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Пользователей в БД</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.2)', padding: '1.25rem', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#60A5FA' }}>{totalRoster}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Сотрудников в составе</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.2)', padding: '1.25rem', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#F59E0B' }}>{totalApps}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ожидающих заявок</div>
        </div>
      </div>

      <AdminPanel />
    </div>
  );
}
