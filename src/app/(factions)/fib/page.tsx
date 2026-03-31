import { getFaction } from '@/config/factions';
import { FactionLanding } from '@/components/faction/FactionLanding';

export default function FIBPage() {
  const faction = getFaction('fib');
  if (!faction) return null;

  const stats = [
    { label: 'Дел закрыто', value: '450+' },
    { label: 'Перехватов', value: '85%' },
    { label: 'Сотрудников', value: 'CLASSIFIED' },
    { label: 'Уровень', value: 'Федеральный' },
  ];

  const features = [
    { icon: '🔒', title: 'Секретные материалы', desc: 'Управление доступом к делам особой важности' },
    { icon: '🎯', title: 'Оперативные дела', desc: 'Координация масштабных операций и антитеррор' },
    { icon: '🦅', title: 'Нац. безопасность', desc: 'Защита государственных интересов от угроз' },
    { icon: '🛡️', title: 'SWAT Отряды', desc: 'Штурмовые группы федерального уровня подготовки' },
  ];

  return <FactionLanding faction={faction} stats={stats} features={features} />;
}
