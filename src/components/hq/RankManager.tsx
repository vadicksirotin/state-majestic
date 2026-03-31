'use client';
import { useState, useCallback } from 'react';
import { Reorder, motion } from 'framer-motion';
import { createRank, deleteRank, reorderRanks, setHighCommandRank } from '@/app/actions/factionSystemOps';

// Тип ранга, который приходит из БД
export interface FactionRank {
  id: string;
  name: string;
  weight: number;
}

export function RankManager({ factionId, initialRanks, currentHighCommandWeight }: { factionId: string, initialRanks: FactionRank[], currentHighCommandWeight: number }) {
  // Сортируем локально: самые младшие (вес 1) вверху или внизу?
  // По логике: 1 ранг внизу списка, 15 ранг наверху. Значит сортируем по убыванию веса (weight DESC).
  const [items, setItems] = useState<FactionRank[]>([...initialRanks].sort((a,b) => b.weight - a.weight));
  const [newRankName, setNewRankName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Добавление ранга: он летит в самый низ списка (вес 1)
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRankName.trim()) return;
    setLoading(true);
    await createRank(factionId, newRankName);
    // Для UX сразу обновлять не будем - оставим серверу через revalidatePath
    // Но очистим инпут
    setNewRankName('');
    setLoading(false);
  };

  const handleReorder = async (newOrder: FactionRank[]) => {
    setItems(newOrder);
    // newOrder идет сверху вниз (самый высокий -> самый низкий). 
    // Значит переворачиваем массив, чтобы 0 индекс был самым младшим, и даём базу.
    const orderIds = [...newOrder].reverse().map(r => r.id);
    await reorderRanks(factionId, orderIds);
  };

  const handleSetHighStaff = async (weight: number) => {
    setLoading(true);
    await setHighCommandRank(factionId, weight);
    setLoading(false);
  };

  return (
    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <h3 style={{ marginBottom: '1rem', color: '#F59E0B' }}>🎖️ Иерархия Рангов</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Зажмите ранг и перетаскивайте его вверх/вниз для изменения старшинства. Чем выше в списке — тем старше ранг.
      </p>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          value={newRankName} 
          onChange={e => setNewRankName(e.target.value)} 
          placeholder="Название нового ранга (напр: Кадет)"
          disabled={loading}
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem', borderRadius: '8px' }}
        />
        <button type="submit" disabled={loading} className="btn" style={{ padding: '0.6rem 1rem' }}>+ Добавить</button>
      </form>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Считать "High Staff / Руководством" начиная с ранга:</label>
        <select 
          value={currentHighCommandWeight} 
          onChange={e => handleSetHighStaff(Number(e.target.value))}
          disabled={loading}
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}
        >
          {items.map(r => (
            <option key={r.id} value={r.weight}>{r.weight} ранг - {r.name}</option>
          ))}
        </select>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={handleReorder} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((rank) => (
          <Reorder.Item 
            key={rank.id} 
            value={rank} 
            dragListener={!loading}
            style={{ 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.8rem 1rem', borderRadius: '8px', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'grab', userSelect: 'none'
            }}
            whileDrag={{ scale: 1.02, background: 'rgba(255,255,255,0.08)', zIndex: 10, cursor: 'grabbing' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>☰</span>
              <strong>{rank.weight}. {rank.name}</strong>
            </div>
            <button 
              onClick={() => deleteRank(factionId, rank.id)} 
              disabled={loading}
              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', opacity: 0.7 }}
            >
              ✕
            </button>
          </Reorder.Item>
        ))}
        {items.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>Ранги не настроены. Добавьте первый ранг!</div>}
      </Reorder.Group>
    </div>
  );
}
