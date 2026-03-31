'use client';
import { useState, useTransition } from 'react';
import { adminSearchUsers, adminSetUserRole, adminRemoveUserRole, adminSetRosterEntry, adminRemoveRosterEntry } from '@/app/actions/admin';

const FACTIONS = ['government', 'lspd', 'ems', 'sheriff', 'fib', 'usss', 'sang'];
const ROLE_LEVELS = ['guest', 'candidate', 'member', 'senior_staff', 'high_staff', 'leadership', 'curator', 'admin'];

export function AdminPanel() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  // Модалка: Должность (бывшая роль)
  const [roleModal, setRoleModal] = useState(false);
  const [roleFaction, setRoleFaction] = useState(FACTIONS[0]);
  const [roleLevel, setRoleLevel] = useState(ROLE_LEVELS[0]);

  const handleSearch = (preserveSelection = false) => {
    startTransition(async () => {
      const results = await adminSearchUsers(query);
      setUsers(results);
      if (!preserveSelection) {
        setSelectedUser(null);
      } else if (selectedUser) {
        const updated = results.find((u: any) => u.id === selectedUser.id);
        if (updated) setSelectedUser(updated);
      }
    });
  };

  const handleSetRole = () => {
    if (!selectedUser) return;
    startTransition(async () => {
      await adminSetUserRole(selectedUser.id, roleFaction, roleLevel);
      setRoleModal(false);
      handleSearch(true); // refresh and preserve selection
    });
  };

  const handleRemoveRole = (factionId: string) => {
    if (!selectedUser) return;
    // Оптимистичное обновление
    const updatedUser = {
      ...selectedUser,
      roles: selectedUser.roles.filter((r: any) => r.factionId !== factionId),
      rosterEntries: selectedUser.rosterEntries.filter((r: any) => r.factionId !== factionId)
    };
    setSelectedUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    startTransition(async () => {
      await adminRemoveUserRole(selectedUser.id, factionId);
      handleSearch(true);
    });
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.6rem 0.8rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.9rem', width: '100%',
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };
  const modalOverlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const modalBox: React.CSSProperties = {
    background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
    padding: '2rem', width: '90%', maxWidth: '450px',
  };
  const badgeStyle = (color: string): React.CSSProperties => ({
    fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px',
    background: `${color}20`, color, fontWeight: 600,
  });

  return (
    <div>
      {/* Поиск */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch(false)}
          placeholder="Имя пользователя или Discord ID..."
          style={{ ...inputStyle, flex: 1, fontSize: '1rem', padding: '0.8rem 1rem' }}
        />
        <button onClick={() => handleSearch(false)} className="btn btn-primary" disabled={isPending} style={{ padding: '0 2rem' }}>
          {isPending ? '...' : 'Найти'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 1.5fr' : '1fr', gap: '1.5rem' }}>
        {/* Список пользователей */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {users.length === 0 && query && !isPending && (
            <p style={{ color: 'var(--text-muted)' }}>Пользователи не найдены.</p>
          )}
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '12px', padding: '0.75rem 1rem', background: selectedUser?.id === user.id ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedUser?.id === user.id ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', cursor: 'pointer', textAlign: 'left', color: 'inherit', width: '100%',
              }}
            >
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{user.name}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>{user.discordId}</div>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {user.roles?.map((r: any) => (
                  <span key={r.id} style={badgeStyle('#A78BFA')}>{r.factionId}: {r.roleLevel}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Детали пользователя */}
        {selectedUser && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>{selectedUser.name}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                  ID: {selectedUser.id}<br />Discord: {selectedUser.discordId}
                </p>
              </div>
              <div>
                <button onClick={() => setRoleModal(true)} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}>+ Назначить должность</button>
              </div>
            </div>

            {/* Роли и Ростер (Объединенные под названием "Должность") */}
            <h4 style={{ fontSize: '0.85rem', color: '#A78BFA', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Активные должности</h4>
            {selectedUser.roles?.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Нет активных должностей во фракциях.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedUser.roles?.map((role: any) => {
                  const entry = selectedUser.rosterEntries?.find((e: any) => e.factionId === role.factionId);
                  return (
                    <div key={role.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{role.factionId.toUpperCase()}</span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Права: {role.roleLevel} {entry && ` | Звание: ${entry.rank}`}
                        </div>
                      </div>
                      <button onClick={() => handleRemoveRole(role.factionId)} disabled={isPending} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px 10px', borderRadius: '6px', fontSize: '0.9rem' }}>
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Назначить должность */}
      {roleModal && selectedUser && (
        <div style={modalOverlay} onClick={() => setRoleModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Назначить полномочия: {selectedUser.name}</h3>

            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Уровень полномочий</label>
            <select
              value={roleLevel}
              onChange={e => setRoleLevel(e.target.value)}
              style={{ ...selectStyle, marginBottom: '1rem' }}
            >
              {ROLE_LEVELS.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
            </select>

            {/* Показываем выбор фракции только если роль не глобальная (не Админ и не Куратор) */}
            {roleLevel !== 'admin' && roleLevel !== 'curator' && (
              <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Выберите подконтрольную фракцию</label>
                <select value={roleFaction} onChange={e => setRoleFaction(e.target.value)} style={{ ...selectStyle, marginBottom: '1.5rem' }}>
                  {FACTIONS.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                </select>
              </div>
            )}

            {(roleLevel === 'admin' || roleLevel === 'curator') && (
              <p style={{ fontSize: '0.75rem', color: '#60A5FA', background: 'rgba(59,130,246,0.1)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>
                ℹ️ Выбранная роль является <strong>Глобальной</strong> и дает доступ к управлению всеми разделами сайта без привязки к конкретной фракции.
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  // Если роль глобальная, передаем спец-ид для фракции
                  const finalFactionId = (roleLevel === 'admin' || roleLevel === 'curator') ? 'global' : roleFaction;
                  startTransition(async () => {
                    await adminSetUserRole(selectedUser.id, finalFactionId, roleLevel);
                    setRoleModal(false);
                    handleSearch(true);
                  });
                }}
                className="btn btn-primary"
                disabled={isPending}
                style={{ flex: 1 }}
              >
                {isPending ? '...' : 'Подтвердить полномочия'}
              </button>
              <button onClick={() => setRoleModal(false)} className="btn" style={{ opacity: 0.6 }}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
