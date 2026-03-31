import { getFaction } from '@/config/factions';
import { FactionLanding } from '@/components/faction/FactionLanding';

export default function EMSPage() {
  const faction = getFaction('ems');
  if (!faction) return null;

  const stats = [
    { label: 'Вызовов', value: '500+' },
    { label: 'Станций', value: '4' },
    { label: 'Сотрудников', value: '150+' },
    { label: 'Оценка', value: '4.8' },
  ];

  const features = [
    { icon: '🚑', title: 'Скорая помощь', desc: 'Оперативное реагирование на вызовы' },
    { icon: '🏥', title: 'Хирургия', desc: 'Сложные операции и лечение тяжелораненых' },
    { icon: '🧠', title: 'Психология', desc: 'Оценка психологического состояния и реабилитация' },
    { icon: '💊', title: 'Обучение ПМП', desc: 'Курсы первой медицинской помощи для гражданских' },
  ];

  return <FactionLanding faction={faction} stats={stats} features={features} />;
}
