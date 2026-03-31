import { getFaction } from '@/config/factions';
import { FactionLanding } from '@/components/faction/FactionLanding';

export default function SANGPage() {
  const faction = getFaction('sang');
  if (!faction) return null;

  const stats = [
    { label: 'Подразделений', value: '6' },
    { label: 'Боеготовность', value: '100%' },
    { label: 'Военнослужащих', value: '450+' },
    { label: 'Техника', value: '85 ед.' },
  ];

  const features = [
    { icon: '✈️', title: 'ВВС', desc: 'Воздушные патрули и транспортировка' },
    { icon: '🪖', title: 'Пехота', desc: 'Охрана форта Занкудо и стратегических объектов' },
    { icon: '🛡️', title: 'Военная полиция', desc: 'Поддержание дисциплины среди военнослужащих' },
    { icon: '📦', title: 'Поставки', desc: 'Защита и доставка материалов для других гос. структур' },
  ];

  return <FactionLanding faction={faction} stats={stats} features={features} />;
}
