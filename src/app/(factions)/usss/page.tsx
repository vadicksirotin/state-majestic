import { getFaction } from '@/config/factions';
import { FactionLanding } from '@/components/faction/FactionLanding';

export default function USSSPage() {
  const faction = getFaction('usss');
  if (!faction) return null;

  const stats = [
    { label: 'VIP под охраной', value: '25' },
    { label: 'Инцидентов', value: '0' },
    { label: 'Агентов', value: '50+' },
    { label: 'Статус', value: 'Элитный' },
  ];

  const features = [
    { icon: '🛡️', title: 'Охрана первых лиц', desc: 'Физическая защита губернатора и министров' },
    { icon: '📋', title: 'Протоколы', desc: 'Строгие правила обеспечения безопасности объектов' },
    { icon: '🏛️', title: 'Объекты', desc: 'Контроль периметра государственных зданий' },
    { icon: '🤝', title: 'Взаимодействие', desc: 'Организация безопасности с другими силовыми структурами' },
  ];

  return <FactionLanding faction={faction} stats={stats} features={features} />;
}
