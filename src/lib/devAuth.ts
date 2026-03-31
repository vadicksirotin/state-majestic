// Список Discord ID пользователей с правами DEV (глобальный админ)
// Добавьте сюда свой Discord ID (тот, что отображается в /dashboard)
export const DEV_DISCORD_IDS = [
  // Вставьте СВОЙ Discord ID ниже (замените строку-пример):
  process.env.DEV_DISCORD_ID || '',
];

export function isDevUser(discordId?: string | null): boolean {
  if (!discordId) return false;
  return DEV_DISCORD_IDS.includes(discordId);
}
