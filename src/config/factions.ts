export type FactionId = 'government' | 'lspd' | 'ems' | 'sheriff' | 'fib' | 'usss' | 'sang';
export type AccessLevel = 'guest' | 'candidate' | 'member' | 'senior_staff' | 'high_staff' | 'leadership' | 'admin';

export const ACCESS_HIERARCHY: AccessLevel[] = [
  'guest', 'candidate', 'member', 'senior_staff', 'high_staff', 'leadership', 'admin'
];

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  access: AccessLevel;
}

export interface FactionConfig {
  id: FactionId;
  name: string;
  fullName: string;
  motto: string;
  description: string;
  accentColor: string;
  accentColorDim: string;
  status: 'open' | 'recruitment' | 'closed' | 'internal_only';
  icon: string;
  navItems: NavItem[];
}

export const FACTIONS: Record<FactionId, FactionConfig> = {
  government: {
    id: 'government',
    name: 'Government',
    fullName: 'Правительство Штата San Andreas',
    motto: 'Власть. Закон. Порядок.',
    description: 'Высший орган исполнительной власти штата. Губернатор, министерства, судебная система и законодательные органы.',
    accentColor: '#C9A84C',
    accentColorDim: '#8B7635',
    status: 'recruitment',
    icon: '🏛️',
    navItems: [
      { label: 'Обзор', href: '/government', icon: '🏠', access: 'guest' },
      { label: 'Кабинет', href: '/government/cabinet', icon: '👔', access: 'guest' },
      { label: 'Указы', href: '/government/decrees', icon: '📜', access: 'member' },
      { label: 'Министерства', href: '/government/ministries', icon: '🏢', access: 'guest' },
      { label: 'Суд', href: '/government/court', icon: '⚖️', access: 'guest' },
      { label: 'Обращения', href: '/government/appeals', icon: '📨', access: 'candidate' },
      { label: 'Документы', href: '/government/docs', icon: '📄', access: 'member' },
      { label: 'Архив решений', href: '/government/history', icon: '📚', access: 'member' },
      { label: 'Приёмы', href: '/government/reception', icon: '🤝', access: 'guest' },
      { label: 'Медиа', href: '/government/media', icon: '📸', access: 'guest' },
      { label: 'Руководство', href: '/government/high-staff', icon: '⭐', access: 'high_staff' },
    ]
  },
  lspd: {
    id: 'lspd',
    name: 'LSPD',
    fullName: 'Los Santos Police Department',
    motto: 'Защищать и служить.',
    description: 'Полицейский департамент Лос-Сантоса. Патрулирование, расследования, академия и специальные подразделения.',
    accentColor: '#3B82F6',
    accentColorDim: '#2563EB',
    status: 'open',
    icon: '🚔',
    navItems: [
      { label: 'Обзор', href: '/lspd', icon: '🏠', access: 'guest' },
      { label: 'Патруль', href: '/lspd/patrol', icon: '🚓', access: 'member' },
      { label: 'Академия', href: '/lspd/academy', icon: '🎓', access: 'guest' },
      { label: 'Регламент', href: '/lspd/regulations', icon: '📋', access: 'member' },
      { label: 'Заявка', href: '/lspd/apply', icon: '✍️', access: 'guest' },
      { label: 'Жалобы', href: '/lspd/complaints', icon: '📢', access: 'guest' },
      { label: 'Состав', href: '/lspd/roster', icon: '👥', access: 'member' },
      { label: 'Специализации', href: '/lspd/specializations', icon: '🎯', access: 'guest' },
      { label: 'Зоны', href: '/lspd/zones', icon: '🗺️', access: 'member' },
      { label: 'Дела', href: '/lspd/cases', icon: '🔍', access: 'senior_staff' },
      { label: 'Руководство', href: '/lspd/high-staff', icon: '⭐', access: 'high_staff' },
    ]
  },
  ems: {
    id: 'ems',
    name: 'EMS',
    fullName: 'Emergency Medical Services',
    motto: 'Спасаем жизни каждый день.',
    description: 'Служба экстренной медицинской помощи. Скорая помощь, госпитали, обучение и реабилитация.',
    accentColor: '#EF4444',
    accentColorDim: '#DC2626',
    status: 'open',
    icon: '🚑',
    navItems: [
      { label: 'Обзор', href: '/ems', icon: '🏠', access: 'guest' },
      { label: 'Отделы', href: '/ems/departments', icon: '🏥', access: 'guest' },
      { label: 'Обучение', href: '/ems/training', icon: '📖', access: 'guest' },
      { label: 'Состав', href: '/ems/roster', icon: '👥', access: 'member' },
      { label: 'Прайс', href: '/ems/pricing', icon: '💰', access: 'guest' },
      { label: 'Журнал', href: '/ems/call-log', icon: '📞', access: 'member' },
      { label: 'Заявка', href: '/ems/apply', icon: '✍️', access: 'guest' },
      { label: 'Восстановление', href: '/ems/recovery', icon: '🔄', access: 'candidate' },
      { label: 'SOS', href: '/ems/emergency', icon: '🆘', access: 'guest' },
      { label: 'Документы', href: '/ems/docs', icon: '📄', access: 'member' },
      { label: 'Руководство', href: '/ems/high-staff', icon: '⭐', access: 'high_staff' },
    ]
  },
  sheriff: {
    id: 'sheriff',
    name: 'Sheriff',
    fullName: 'Los Santos County Sheriff',
    motto: 'Закон за пределами города.',
    description: 'Офис шерифа округа. Патрули, конвойная служба, посты и контроль территорий за пределами города.',
    accentColor: '#D97706',
    accentColorDim: '#B45309',
    status: 'recruitment',
    icon: '⭐',
    navItems: [
      { label: 'Обзор', href: '/sheriff', icon: '🏠', access: 'guest' },
      { label: 'Округа', href: '/sheriff/districts', icon: '🗺️', access: 'guest' },
      { label: 'Патрули', href: '/sheriff/patrol', icon: '🚔', access: 'member' },
      { label: 'Конвой', href: '/sheriff/convoy', icon: '🚐', access: 'member' },
      { label: 'Дисциплина', href: '/sheriff/discipline', icon: '⚖️', access: 'member' },
      { label: 'Заявка', href: '/sheriff/apply', icon: '✍️', access: 'guest' },
      { label: 'Состав', href: '/sheriff/roster', icon: '👥', access: 'member' },
      { label: 'Посты', href: '/sheriff/posts', icon: '📍', access: 'member' },
      { label: 'Устав', href: '/sheriff/regulations', icon: '📋', access: 'member' },
      { label: 'Документы', href: '/sheriff/docs', icon: '📄', access: 'member' },
      { label: 'Руководство', href: '/sheriff/high-staff', icon: '⭐', access: 'high_staff' },
    ]
  },
  fib: {
    id: 'fib',
    name: 'FIB',
    fullName: 'Federal Investigation Bureau',
    motto: 'Fidelity. Bravery. Integrity.',
    description: 'Федеральное бюро расследований. Оперативная работа, национальная безопасность, SWAT и секретные операции.',
    accentColor: '#F59E0B',
    accentColorDim: '#D97706',
    status: 'closed',
    icon: '🕵️',
    navItems: [
      { label: 'Обзор', href: '/fib', icon: '🏠', access: 'guest' },
      { label: 'Classified', href: '/fib/classified', icon: '🔒', access: 'high_staff' },
      { label: 'Операции', href: '/fib/operations', icon: '🎯', access: 'senior_staff' },
      { label: 'Академия', href: '/fib/academy', icon: '🎓', access: 'guest' },
      { label: 'SWAT', href: '/fib/swat', icon: '🛡️', access: 'member' },
      { label: 'CID', href: '/fib/cid', icon: '🔍', access: 'member' },
      { label: 'Нац. безопасность', href: '/fib/national-security', icon: '🦅', access: 'senior_staff' },
      { label: 'Уровни доступа', href: '/fib/access-levels', icon: '🔐', access: 'member' },
      { label: 'Архивы', href: '/fib/archives', icon: '📁', access: 'senior_staff' },
      { label: 'Состав', href: '/fib/roster', icon: '👥', access: 'member' },
      { label: 'Руководство', href: '/fib/high-staff', icon: '⭐', access: 'high_staff' },
    ]
  },
  usss: {
    id: 'usss',
    name: 'USSS',
    fullName: 'United States Secret Service',
    motto: 'Worthy of Trust and Confidence.',
    description: 'Секретная служба. Охрана первых лиц, протоколы безопасности и защита государственных объектов.',
    accentColor: '#D4AF37',
    accentColorDim: '#A38829',
    status: 'internal_only',
    icon: '🛡️',
    navItems: [
      { label: 'Обзор', href: '/usss', icon: '🏠', access: 'guest' },
      { label: 'Охрана VIP', href: '/usss/protection', icon: '🛡️', access: 'member' },
      { label: 'Протоколы', href: '/usss/protocols', icon: '📋', access: 'member' },
      { label: 'Состав', href: '/usss/roster', icon: '👥', access: 'member' },
      { label: 'Сопровождение', href: '/usss/escort-rules', icon: '🚗', access: 'member' },
      { label: 'Объекты', href: '/usss/protected-objects', icon: '🏛️', access: 'senior_staff' },
      { label: 'Документы', href: '/usss/docs', icon: '📄', access: 'member' },
      { label: 'Заявка', href: '/usss/apply', icon: '✍️', access: 'guest' },
      { label: 'Взаимодействие', href: '/usss/cooperation', icon: '🤝', access: 'member' },
      { label: 'Руководство', href: '/usss/high-staff', icon: '⭐', access: 'high_staff' },
    ]
  },
  sang: {
    id: 'sang',
    name: 'SANG',
    fullName: 'San Andreas National Guard',
    motto: 'Всегда готовы. Всегда на страже.',
    description: 'Национальная гвардия штата. Военная дисциплина, части, звания, приказы и боеготовность.',
    accentColor: '#84CC16',
    accentColorDim: '#65A30D',
    status: 'open',
    icon: '🪖',
    navItems: [
      { label: 'Обзор', href: '/sang', icon: '🏠', access: 'guest' },
      { label: 'Звания', href: '/sang/ranks', icon: '🎖️', access: 'guest' },
      { label: 'Приказы', href: '/sang/orders', icon: '📜', access: 'leadership' },
      { label: 'Устав', href: '/sang/drill', icon: '📋', access: 'member' },
      { label: 'Переводы', href: '/sang/transfers', icon: '🔄', access: 'member' },
      { label: 'Восстановление', href: '/sang/recovery', icon: '♻️', access: 'candidate' },
      { label: 'Пропуска', href: '/sang/passes', icon: '📄', access: 'member' },
      { label: 'Состав', href: '/sang/roster', icon: '👥', access: 'member' },
      { label: 'Документы', href: '/sang/docs', icon: '📄', access: 'member' },
      { label: 'Руководство', href: '/sang/high-staff', icon: '⭐', access: 'high_staff' },
    ]
  }
};

export const FACTION_LIST = Object.values(FACTIONS);

export function getFaction(id: string): FactionConfig | undefined {
  return FACTIONS[id as FactionId];
}

export function getStatusLabel(status: FactionConfig['status']): string {
  const labels: Record<FactionConfig['status'], string> = {
    open: 'Открыт набор',
    recruitment: 'Идёт отбор',
    closed: 'Набор закрыт',
    internal_only: 'Только внутренний',
  };
  return labels[status];
}

export function getStatusColor(status: FactionConfig['status']): string {
  const colors: Record<FactionConfig['status'], string> = {
    open: '#22C55E',
    recruitment: '#F59E0B',
    closed: '#EF4444',
    internal_only: '#8B5CF6',
  };
  return colors[status];
}
