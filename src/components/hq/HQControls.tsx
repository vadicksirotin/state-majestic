'use client';
import { useState } from 'react';
import { reviewItemRequest, reviewPromotionReport, issueReprimand, removeReprimand, updateMemberPermissions, updateMemberRankWeight } from '@/app/actions/factionOps';

const AVAILABLE_PERMISSIONS = [
  { key: 'edit_charter', label: 'Редактировать Устав' },
  { key: 'manage_departments', label: 'Управлять Отделами' },
  { key: 'view_logs', label: 'Просматривать Логи' },
  { key: 'publish_news', label: 'Публиковать Новости' },
  { key: 'manage_roster', label: 'Управлять Составом' },
  { key: 'review_reports', label: 'Проверять Отчёты' },
];

// --- 3 Dots Menu for roster members ---
export function MemberContextMenu({ member, factionId, isLeader }: { member: any, factionId: string, isLeader: boolean }) {
  const [open, setOpen] = useState(false);
  const [permissionsModal, setPermissionsModal] = useState(false);
  const [reprimandModal, setReprimandModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentPerms: string[] = JSON.parse(member.permissions || '[]');

  const togglePermission = async (key: string) => {
    const updated = currentPerms.includes(key) ? currentPerms.filter(p => p !== key) : [...currentPerms, key];
    setLoading(true);
    await updateMemberPermissions(member.id, updated);
    setLoading(false);
  };

  const handleRankWeight = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val !== member.rankWeight) {
      await updateMemberRankWeight(member.id, val);
    }
  };

  const handleReprimand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await issueReprimand(member.userId, factionId, fd.get('reason') as string, fd.get('type') as 'verbal' | 'written');
    setLoading(false);
    setReprimandModal(false);
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute', right: 0, top: '100%', background: '#151b28',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.5rem',
    display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 100, minWidth: '200px',
  };
  const menuItemStyle: React.CSSProperties = {
    background: 'transparent', border: 'none', color: 'var(--text-primary)',
    padding: '0.5rem 0.8rem', textAlign: 'left', cursor: 'pointer', borderRadius: '6px',
    fontSize: '0.85rem',
  };
  const modalOverlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const modalBox: React.CSSProperties = {
    background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
    padding: '2rem', width: '90%', maxWidth: '480px',
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setOpen(!open)} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px' }}
        >
          ⋯
        </button>

        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
            <div style={menuStyle}>
              <div style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                Вес ранга: 
                <input 
                  type="number" defaultValue={member.rankWeight} min={1} max={15} 
                  onBlur={handleRankWeight}
                  style={{ width: '50px', marginLeft: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '2px 4px', borderRadius: '4px' }}
                />
              </div>
              <hr style={{ border: '1px solid rgba(255,255,255,0.05)', margin: '4px 0' }} />
              <button style={menuItemStyle} onMouseEnter={e => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => (e.target as HTMLElement).style.background = 'transparent'} onClick={() => { setReprimandModal(true); setOpen(false); }}>
                ⚠️ Выдать выговор
              </button>
              {isLeader && (
                <button style={menuItemStyle} onMouseEnter={e => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => (e.target as HTMLElement).style.background = 'transparent'} onClick={() => { setPermissionsModal(true); setOpen(false); }}>
                  🔑 Изменить разрешения
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Permissions Modal (Leader only) */}
      {permissionsModal && (
        <div style={modalOverlay} onClick={() => setPermissionsModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>🔑 Разрешения: {member.user.name}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Нажмите на разрешение, чтобы включить/отключить его для этого сотрудника.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {AVAILABLE_PERMISSIONS.map(p => (
                <button 
                  key={p.key}
                  onClick={() => togglePermission(p.key)}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                    background: currentPerms.includes(p.key) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: currentPerms.includes(p.key) ? '#10B981' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{currentPerms.includes(p.key) ? '✅' : '⬜'}</span>
                  {p.label}
                </button>
              ))}
            </div>
            <button onClick={() => setPermissionsModal(false)} className="btn" style={{ marginTop: '1rem', width: '100%', opacity: 0.6 }}>Закрыть</button>
          </div>
        </div>
      )}

      {/* Reprimand Modal */}
      {reprimandModal && (
        <div style={modalOverlay} onClick={() => setReprimandModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>⚠️ Выговор: {member.user.name}</h3>
            <form onSubmit={handleReprimand}>
              <select name="type" style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', marginBottom: '0.75rem' }}>
                <option value="verbal">Устный выговор</option>
                <option value="written">Строгий (письменный) выговор</option>
              </select>
              <textarea name="reason" placeholder="Причина выговора..." rows={3} required style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', marginBottom: '0.75rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn" disabled={loading} style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
                  {loading ? '...' : 'Выдать выговор'}
                </button>
                <button type="button" onClick={() => setReprimandModal(false)} className="btn" style={{ opacity: 0.6 }}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// --- Review Requests/Reports Component ---
export function ReviewPanel({ itemRequests, promotionReports }: { itemRequests: any[], promotionReports: any[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: '#F59E0B' }}>🛡️ Запросы спец. средств ({itemRequests.filter((r: any) => r.status === 'pending').length} ожидают)</h3>
        {itemRequests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Нет запросов.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {itemRequests.map((req: any) => (
              <div key={req.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{req.itemName}</strong> × {req.amount}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Причина: {req.reason}</div>
                  </div>
                  {req.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <form action={async () => { 'use server'; await reviewItemRequest(req.id, 'approved'); }}>
                        <button type="submit" className="btn" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>✅</button>
                      </form>
                      <form action={async () => { 'use server'; await reviewItemRequest(req.id, 'rejected'); }}>
                        <button type="submit" className="btn" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>❌</button>
                      </form>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '8px', background: req.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: req.status === 'approved' ? '#10B981' : '#EF4444' }}>
                      {req.status === 'approved' ? 'Одобрено' : 'Отклонено'} ({req.reviewedBy})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: '#60A5FA' }}>📝 Отчёты на повышение ({promotionReports.filter((r: any) => r.status === 'pending').length} ожидают)</h3>
        {promotionReports.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Нет отчётов.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {promotionReports.map((report: any) => (
              <div key={report.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{report.content}</p>
                  </div>
                  {report.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '1rem' }}>
                      <form action={async () => { 'use server'; await reviewPromotionReport(report.id, 'approved'); }}>
                        <button type="submit" className="btn" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>✅</button>
                      </form>
                      <form action={async () => { 'use server'; await reviewPromotionReport(report.id, 'rejected'); }}>
                        <button type="submit" className="btn" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>❌</button>
                      </form>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '8px', background: report.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: report.status === 'approved' ? '#10B981' : '#EF4444', whiteSpace: 'nowrap' }}>
                      {report.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
