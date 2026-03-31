import { getFaction } from '@/config/factions';
import { FactionLanding } from '@/components/faction/FactionLanding';

export default function SheriffPage() {
  const faction = getFaction('sheriff');
  if (!faction) return null;

  const stats = [
    { label: 'Патрулей', value: '150+' },
    { label: 'Конвоев', value: '30+' },
    { label: 'Сотрудников', value: '250+' },
    { label: 'Постов', value: '12' },
  ];

  const features = [
    { icon: '🚓', title: 'Окружной патруль', desc: 'Патрулирование территорий округа Блэйн' },
    { icon: '🚐', title: 'Конвойная служба', desc: 'Безопасная транспортировка заключенных' },
    { icon: '🚧', title: 'Контроль трафика', desc: 'Организация дорожных постов на трассах' },
    { icon: '🕵️', title: 'Следственный отдел', desc: 'Расследование преступлений в юрисдикции округа' },
  ];

  return <FactionLanding faction={faction} stats={stats} features={features} />;
}
