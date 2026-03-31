'use client';
import { useState } from 'react';
import { updateMemberRank, fireMember } from '@/app/actions/hqRoster';

export function RosterManagement({ members, factionId }: { members: any[], factionId: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdateRank = async (id: string, newRank: string) => {
    setLoading(id);
    await updateMemberRank(id, newRank);
    setLoading(null);
  };

  const handleFire = async (id: string) => {
    if (!confirm('Вы уверены, что хотите уволить сотрудника?')) return;
    setLoading(id);
    await fireMember(id, factionId);
    setLoading(null);
  };

  if (members.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>В составе пока нет сотрудников.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {members.map(member => (
        <div key={member.id} style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid var(--glass-border)',
          padding: 'var(--space-md) var(--space-lg)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: 0 }}>{member.user.name}</h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Discord: {member.user.discordId} • Статус: {member.status}</div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <input 
              type="text" 
              defaultValue={member.rank}
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.4rem', borderRadius: '4px' }}
              onBlur={(e) => {
                if (e.target.value !== member.rank) handleUpdateRank(member.id, e.target.value);
              }}
              disabled={loading === member.id}
            />
            <button 
              onClick={() => handleFire(member.id)}
              className="btn"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.4rem 1rem' }}
              disabled={loading === member.id}
            >
              Уволить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
