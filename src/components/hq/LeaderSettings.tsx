'use client';
import { useState } from 'react';
import { updateFactionSettings, createDepartment, deleteDepartment } from '@/app/actions/factionOps';

import { RankManager } from './RankManager';
import { LinkManager } from './LinkManager';

interface LeaderSettingsProps {
  factionId: string;
  settings: { highCommandRank: number; leaderRank: number; charterText: string | null } | null;
  departments: { id: string; name: string; description: string | null }[];
  activityLogs: { id: string; action: string; details: string; createdAt: Date }[];
  ranks: any[];
  links: any[];
}

export function LeaderSettings({ factionId, settings, departments, activityLogs, ranks, links }: LeaderSettingsProps) {
  const [activeSection, setActiveSection] = useState<'charter' | 'departments' | 'ranks' | 'logs'>('ranks');
  const [loading, setLoading] = useState(false);
  const [charterText, setCharterText] = useState(settings?.charterText || '');

  const handleSaveCharter = async () => {
    setLoading(true);
    await updateFactionSettings(factionId, { charterText });
    setLoading(false);
    alert('Устав сохранён!');
  };

  const handleSaveRanks = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await updateFactionSettings(factionId, {
      highCommandRank: Number(fd.get('highCommandRank')),
      leaderRank: Number(fd.get('leaderRank')),
    });
    setLoading(false);
    alert('Настройки рангов сохранены!');
  };

  const handleCreateDept = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await createDepartment(factionId, fd.get('name') as string, fd.get('description') as string);
    e.currentTarget.reset();
    setLoading(false);
  };

  const sectionBtnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(255,215,0,0.1)' : 'transparent',
    color: active ? '#FFD700' : 'var(--text-muted)',
    border: 'none', padding: '0.5rem 1rem', cursor: 'pointer',
    borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
  });

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.7rem', background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px',
    marginBottom: '0.75rem', fontFamily: 'inherit',
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button style={sectionBtnStyle(activeSection === 'ranks')} onClick={() => setActiveSection('ranks')}>📊 Ранги и Ссылки</button>
        <button style={sectionBtnStyle(activeSection === 'charter')} onClick={() => setActiveSection('charter')}>📜 Устав</button>
        <button style={sectionBtnStyle(activeSection === 'departments')} onClick={() => setActiveSection('departments')}>🏢 Отделы</button>
        <button style={sectionBtnStyle(activeSection === 'logs')} onClick={() => setActiveSection('logs')}>📋 Логи</button>
      </div>

      {activeSection === 'ranks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
          <RankManager factionId={factionId} initialRanks={ranks} currentHighCommandWeight={settings?.highCommandRank ?? 10} />
          <LinkManager factionId={factionId} links={links} ranks={ranks} />
        </div>
      )}

      {activeSection === 'charter' && (
        <div style={{ maxWidth: '700px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Внутренний устав фракции. Этот текст видят все сотрудники на странице фракции.
          </p>
          <textarea
            value={charterText}
            onChange={e => setCharterText(e.target.value)}
            rows={12}
            placeholder="# Устав фракции&#10;&#10;## Глава 1: Общие положения&#10;..."
            style={{ ...inputStyle, resize: 'vertical', minHeight: '200px' }}
          />
          <button onClick={handleSaveCharter} className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Сохранение...' : 'Сохранить Устав'}
          </button>
        </div>
      )}

      {activeSection === 'departments' && (
        <div style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {departments.map(dept => (
              <div key={dept.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                <div>
                  <strong>{dept.name}</strong>
                  {dept.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dept.description}</div>}
                </div>
                <button onClick={() => { if(confirm('Удалить отдел?')) deleteDepartment(dept.id); }} className="btn" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                  Удалить
                </button>
              </div>
            ))}
            {departments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Отделы не созданы.</p>}
          </div>

          <form onSubmit={handleCreateDept} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
            <input name="name" placeholder="Название отдела (SWAT, IA, Delta...)" required style={inputStyle} />
            <input name="description" placeholder="Краткое описание (опционально)" style={inputStyle} />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? '...' : 'Создать Отдел'}
            </button>
          </form>
        </div>
      )}

      {activeSection === 'logs' && (
        <div style={{ maxWidth: '700px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Последние действия руководства фракции.
          </p>
          {activityLogs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Логов пока нет.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {activityLogs.map(log => (
                <div key={log.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                  <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.7rem', minWidth: '120px' }}>{log.action}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
