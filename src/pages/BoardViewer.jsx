import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Maximize2, BookOpen } from 'lucide-react';
import { useBoards, useCards } from '../hooks/useFirestore';

export default function BoardViewer() {
  const { boardId } = useParams();
  const { boards } = useBoards();
  const { cards } = useCards(boardId);
  const board = boards.find(b => b.board_id === boardId);
  
  const [showImageModal, setShowImageModal] = useState(null);

  if (!board) return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h2>존재하지 않거나 삭제된 보드입니다.</h2>
      <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>홈으로 가기</Link>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{board.title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>선생님이 공유해주신 자료입니다. 클릭해서 확인해보세요.</p>
      </div>

      <div className={board.layout_type === 'GRID' ? 'grid-layout' : 'grid-layout'} style={board.layout_type === 'MINDMAP' ? { display: 'flex', flexWrap: 'wrap', justifyContent: 'center' } : {}}>
        {cards.map(card => (
          <div key={card.card_id} className="glass-card" style={board.layout_type === 'MINDMAP' ? { width: '300px', margin: '1rem' } : {}}>
            <div 
              style={{ 
                height: '200px', 
                backgroundImage: `url(${card.file_url})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => setShowImageModal(card.file_url)}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', transition: 'background 0.2s' }} 
                   onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
                   onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
              />
              <Maximize2 size={24} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', opacity: 0.8 }} />
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{card.title}</h3>
              <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{card.description}</p>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '3rem', color: 'rgba(255,255,255,0.7)' }}>
            아직 업로드된 자료가 없습니다.
          </p>
        )}
      </div>

      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(null)}>
          <div className="modal-content" style={{ maxWidth: '90vw', padding: '1rem', background: 'transparent', boxShadow: 'none' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowImageModal(null)} style={{ color: 'white', background: 'rgba(0,0,0,0.5)' }}>✕</button>
            <img src={showImageModal} alt="Enlarged" style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px' }} />
          </div>
        </div>
      )}
    </div>
  );
}
