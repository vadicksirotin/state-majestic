import { notFound } from 'next/navigation';
import { getFaction, type FactionId } from '@/config/factions';
import { ApplicationForm } from '@/components/ui/ApplicationForm';

interface PageProps {
  params: Promise<{ factionId: string }>;
}

export default async function ApplyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const factionId = resolvedParams.factionId as FactionId;
  const faction = getFaction(factionId);

  if (!faction) return notFound();

  // Проверка открыты ли заявки
  if (faction.status === 'closed') {
    return (
      <div style={{ padding: 'var(--space-2xl) 0' }}>
        <h1 className="section-title">Прием заявлений закрыт</h1>
        <p className="section-subtitle">В данный момент набор в {faction.fullName} не производится.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-xl) 0' }}>
      <h1 className="section-title">Заявление: {faction.name}</h1>
      <p className="section-subtitle">Заполните анкету для вступления в академию. Убедитесь, что вы подходите по всем критериям (Medical, License, RP-возраст).</p>
      
      <div style={{ marginTop: 'var(--space-2xl)' }}>
        <ApplicationForm faction={faction} />
      </div>
    </div>
  );
}
