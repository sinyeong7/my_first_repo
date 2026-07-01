import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBoards } from '../hooks/useFirestore';

export default function Dashboard() {
  const { boards, addBoard, deleteBoard, moveBoard, isHost } = useBoards();
  const [newTitle, setNewTitle] = useState('');
  const [dashboardTitle, setDashboardTitle] = useState(() => localStorage.getItem('dashboardTitle') || '대시보드');
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
        <input 
          type="text" 
          value={dashboardTitle} 
          onChange={(e) => {
            setDashboardTitle(e.target.value);
            localStorage.setItem('dashboardTitle', e.target.value);
          }}
          style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            background: 'transparent', 
            border: 'none', 
            color: 'inherit', 
            outline: 'none',
            borderBottom: isHost ? '2px dashed rgba(255,255,255,0.3)' : 'none',
            width: 'auto'
          }} 
          placeholder="대시보드 이름을 입력하세요"
          title={isHost ? "클릭해서 이름을 변경할 수 있습니다" : ""}
          readOnly={!isHost}
        />
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
        {boards.map((board, index) => (
          <div key={board.board_id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{board.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>
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
            {isHost && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button className="btn-secondary" disabled={index === 0} style={{ flex: 1, padding: '0.25rem' }} onClick={() => moveBoard(index, 'left')} title="앞으로 이동">
                  <ChevronLeft size={18} style={{ margin: '0 auto' }} />
                </button>
                <button className="btn-secondary" disabled={index === boards.length - 1} style={{ flex: 1, padding: '0.25rem' }} onClick={() => moveBoard(index, 'right')} title="뒤로 이동">
                  <ChevronRight size={18} style={{ margin: '0 auto' }} />
                </button>
              </div>
            )}
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
