import { getFaction } from '@/config/factions';
import { FactionLanding } from '@/components/faction/FactionLanding';

export default function GovernmentPage() {
  const faction = getFaction('government');
  if (!faction) return null;

  const stats = [
    { label: 'Законов принято', value: '450+' },
    { label: 'Министерств', value: '5' },
    { label: 'Сотрудников', value: '120+' },
    { label: 'Онлайн', value: '24/7' },
  ];

  const features = [
    { icon: '⚖️', title: 'Судебная власть', desc: 'Разрешение споров и осуществление правосудия' },
    { icon: '📜', title: 'Законодательство', desc: 'Создание и утверждение законов штата San Andreas' },
    { icon: '💼', title: 'Министерства', desc: 'Управление финансами, безопасностью, культурой и здравоохранением' },
    { icon: '🤝', title: 'Обращения граждан', desc: 'Рассмотрение жалоб и предложений от жителей штата' },
  ];

  return <FactionLanding faction={faction} stats={stats} features={features} />;
}
