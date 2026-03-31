import { getFaction } from '@/config/factions';
import { FactionLanding } from '@/components/faction/FactionLanding';

export default function LSPDPage() {
  const faction = getFaction('lspd');
  if (!faction) return null;

  const stats = [
    { label: 'Патрулей в день', value: '200+' },
    { label: 'Раскрытий', value: '85%' },
    { label: 'Сотрудников', value: '300+' },
    { label: 'Вызовов', value: '10k+' },
  ];

  const features = [
    { icon: '🚓', title: 'Патрульная служба', desc: 'Поддержание порядка на улицах Лос-Сантоса' },
    { icon: '🕵️', title: 'Детективы', desc: 'Расследование серьезных преступлений' },
    { icon: '🛡️', title: 'SWAT', desc: 'Спецназ для реагирования на критические угрозы' },
    { icon: '🎓', title: 'Полицейская академия', desc: 'Обучение и подготовка новых кадров' },
  ];

  return <FactionLanding faction={faction} stats={stats} features={features} />;
}
