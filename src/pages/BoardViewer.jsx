import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Maximize2, BookOpen, FileText } from 'lucide-react';
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

      <div className="grid-layout">
        {cards.map(card => (
          <div key={card.card_id} className="glass-card">
            <div 
              style={{ 
                height: '200px', 
                backgroundColor: (!card.cover_url && card.file_type !== 'image') ? '#f1f5f9' : 'transparent',
                backgroundImage: card.cover_url ? `url(${card.cover_url})` : (card.file_type === 'image' ? `url(${card.file_url})` : 'none'), 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                position: 'relative',
                cursor: 'pointer',
                display: (!card.cover_url && card.file_type !== 'image') ? 'flex' : 'block',
                alignItems: (!card.cover_url && card.file_type !== 'image') ? 'center' : 'initial',
                justifyContent: (!card.cover_url && card.file_type !== 'image') ? 'center' : 'initial',
                flexDirection: (!card.cover_url && card.file_type !== 'image') ? 'column' : 'initial'
              }}
              onClick={() => {
                if (card.file_type === 'image') {
                  setShowImageModal(card.file_url);
                } else {
                  window.open(card.file_url, '_blank');
                }
              }}
            >
              {(!card.cover_url && card.file_type !== 'image') ? (
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <FileText size={48} style={{ marginBottom: '0.5rem', margin: '0 auto' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, padding: '0 1rem', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {card.file_name}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', transition: 'background 0.2s' }} 
                       onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
                       onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                  />
                  <Maximize2 size={24} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', opacity: 0.8 }} />
                </>
              )}
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
