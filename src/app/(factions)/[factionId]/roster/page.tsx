import { notFound } from 'next/navigation';
import { getFaction, type FactionId } from '@/config/factions';
import { prisma } from '@/lib/prisma';
import { DataTable } from '@/components/ui/DataTable';

interface PageProps {
  params: Promise<{ factionId: string }>;
}

export default async function RosterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const factionId = resolvedParams.factionId as FactionId;
  const faction = getFaction(factionId);

  if (!faction) return notFound();

  // Получаем список состава из базы данных
  const roster = await prisma.rosterEntry.findMany({
    where: { factionId },
    include: { user: true },
    orderBy: { joinedAt: 'asc' },
  });

  const columns = [
    { key: 'name', header: 'Имя / Badge', render: (row: any) => <strong>{row.user.name}</strong> },
    { key: 'rank', header: 'Звание', render: (row: any) => row.rank },
    { key: 'department', header: 'Отдел', render: (row: any) => row.department || '—' },
    { 
      key: 'status', 
      header: 'Статус', 
      render: (row: any) => {
        const isActive = row.status === 'active';
        return (
          <span style={{ 
            color: isActive ? '#10B981' : '#EF4444',
            background: isActive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            {isActive ? 'Активен' : 'Отстранен'}
          </span>
        );
      }
    }
  ];

  return (
    <div>
      <h1 className="section-title">Состав: {faction.name}</h1>
      <p className="section-subtitle">Официальный реестр действующих сотрудников</p>
      
      <div style={{ marginTop: 'var(--space-2xl)' }}>
        <DataTable data={roster} columns={columns} emptyText={`Реестр пуст или данные ${faction.name} засекречены.`} />
      </div>
    </div>
  );
}
