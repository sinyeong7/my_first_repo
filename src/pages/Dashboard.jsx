import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { useBoards } from '../hooks/useFirestore';

export default function Dashboard() {
  const { boards, addBoard, deleteBoard, isHost } = useBoards();
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !isHost) return;
    const board = await addBoard(newTitle);
    setNewTitle('');
    navigate(`/board/edit/${board.board_id}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>대시보드</h1>
      </div>

      {isHost && (
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>새 보드 만들기</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                placeholder="보드 제목 (예: 3학년 1학기 국어)" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">
              <Plus size={20} /> 생성
            </button>
          </form>
        </div>
      )}

      <div className="grid-layout">
        {boards.map(board => (
          <div key={board.board_id} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{board.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              생성일: {new Date(board.created_at).toLocaleDateString()}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isHost && (
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => navigate(`/board/edit/${board.board_id}`)}>
                  편집
                </button>
              )}
              <button className={isHost ? "btn-secondary" : "btn-primary"} style={isHost ? {} : { flex: 1 }} onClick={() => navigate(`/share/board/${board.board_id}`)}>
                보기
              </button>
              {isHost && (
                <button className="btn-danger" onClick={() => deleteBoard(board.board_id)}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
        {boards.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.7)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            {isHost ? '생성된 보드가 없습니다. 첫 보드를 만들어 보세요!' : '아직 공유된 보드가 없습니다.'}
          </p>
        )}
      </div>
    </div>
  );
}
