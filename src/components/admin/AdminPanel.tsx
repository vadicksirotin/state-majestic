'use client';
import { useState, useTransition } from 'react';
import { adminSearchUsers, adminSetUserRole, adminRemoveUserRole, adminSetRosterEntry, adminRemoveRosterEntry } from '@/app/actions/admin';

const FACTIONS = ['government', 'lspd', 'ems', 'sheriff', 'fib', 'usss', 'sang'];
const ROLE_LEVELS = ['guest', 'candidate', 'member', 'senior_staff', 'high_staff', 'leadership', 'admin'];

export function AdminPanel() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  // Модалка: роль
  const [roleModal, setRoleModal] = useState(false);
  const [roleFaction, setRoleFaction] = useState(FACTIONS[0]);
  const [roleLevel, setRoleLevel] = useState(ROLE_LEVELS[0]);

  // Модалка: ростер
  const [rosterModal, setRosterModal] = useState(false);
  const [rosterFaction, setRosterFaction] = useState(FACTIONS[0]);
  const [rosterRank, setRosterRank] = useState('Trainee');
  const [rosterWeight, setRosterWeight] = useState(1);
  const [rosterDept, setRosterDept] = useState('');

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
    // Оптимистичное обновление локального состояния
    const updatedUser = {
      ...selectedUser,
      roles: selectedUser.roles.filter((r: any) => r.factionId !== factionId)
    };
    setSelectedUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    startTransition(async () => {
      await adminRemoveUserRole(selectedUser.id, factionId);
      // Мы уже обновили локально, но позовем поиск для синхронизации с БД (без сброса выделения)
      handleSearch(true);
    });
  };

  const handleSetRoster = () => {
    if (!selectedUser) return;
    startTransition(async () => {
      await adminSetRosterEntry(selectedUser.id, rosterFaction, rosterRank, rosterWeight, rosterDept);
      setRosterModal(false);
      handleSearch(true);
    });
  };

  const handleRemoveRoster = (factionId: string) => {
    if (!selectedUser) return;
    // Оптимистичное обновление
    const updatedUser = {
      ...selectedUser,
      rosterEntries: selectedUser.rosterEntries.filter((r: any) => r.factionId !== factionId)
    };
    setSelectedUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    startTransition(async () => {
      await adminRemoveRosterEntry(selectedUser.id, factionId);
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
                  ID: {selectedUser.id}<br/>Discord: {selectedUser.discordId}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => setRoleModal(true)} className="btn" style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>+ Роль</button>
                <button onClick={() => setRosterModal(true)} className="btn" style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>+ Должность</button>
              </div>
            </div>

            {/* Роли */}
            <h4 style={{ fontSize: '0.85rem', color: '#A78BFA', marginBottom: '0.5rem' }}>Роли доступа</h4>
            {selectedUser.roles?.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Нет ролей.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.5rem' }}>
                {selectedUser.roles?.map((r: any) => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.85rem' }}><strong>{r.factionId}</strong> → {r.roleLevel}</span>
                    <button onClick={() => handleRemoveRole(r.factionId)} disabled={isPending} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Ростер */}
            <h4 style={{ fontSize: '0.85rem', color: '#60A5FA', marginBottom: '0.5rem' }}>Состав (Roster)</h4>
            {selectedUser.rosterEntries?.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Не состоит в фракциях.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {selectedUser.rosterEntries?.map((r: any) => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.85rem' }}><strong>{r.factionId}</strong> → {r.rank} (вес: {r.rankWeight}) {r.department && `• ${r.department}`}</span>
                    <button onClick={() => handleRemoveRoster(r.factionId)} disabled={isPending} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Добавить роль */}
      {roleModal && selectedUser && (
        <div style={modalOverlay} onClick={() => setRoleModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Добавить роль: {selectedUser.name}</h3>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Фракция</label>
            <select value={roleFaction} onChange={e => setRoleFaction(e.target.value)} style={{ ...selectStyle, marginBottom: '0.75rem' }}>
              {FACTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Уровень роли</label>
            <select value={roleLevel} onChange={e => setRoleLevel(e.target.value)} style={{ ...selectStyle, marginBottom: '1rem' }}>
              {ROLE_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleSetRole} className="btn btn-primary" disabled={isPending} style={{ flex: 1 }}>
                {isPending ? '...' : 'Назначить роль'}
              </button>
              <button onClick={() => setRoleModal(false)} className="btn" style={{ opacity: 0.6 }}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Добавить в состав */}
      {rosterModal && selectedUser && (
        <div style={modalOverlay} onClick={() => setRosterModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Назначить должность: {selectedUser.name}</h3>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Фракция</label>
            <select value={rosterFaction} onChange={e => setRosterFaction(e.target.value)} style={{ ...selectStyle, marginBottom: '0.75rem' }}>
              {FACTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Звание</label>
            <input value={rosterRank} onChange={e => setRosterRank(e.target.value)} placeholder="Officer I, Trainee..." style={{ ...inputStyle, marginBottom: '0.75rem' }} />
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Вес ранга (1-15)</label>
            <input type="number" min={1} max={15} value={rosterWeight} onChange={e => setRosterWeight(Number(e.target.value))} style={{ ...inputStyle, marginBottom: '0.75rem' }} />
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Отдел (опционально)</label>
            <input value={rosterDept} onChange={e => setRosterDept(e.target.value)} placeholder="SWAT, IA, PA..." style={{ ...inputStyle, marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleSetRoster} className="btn btn-primary" disabled={isPending} style={{ flex: 1 }}>
                {isPending ? '...' : 'Назначить должность'}
              </button>
              <button onClick={() => setRosterModal(false)} className="btn" style={{ opacity: 0.6 }}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
