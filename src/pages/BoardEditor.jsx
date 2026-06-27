import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, Trash2, Maximize2, Share2 } from 'lucide-react';
import { useBoards, useCards } from '../hooks/useFirestore';

export default function BoardEditor() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { boards, isHost } = useBoards();
  const board = boards.find(b => b.board_id === boardId);
  const { cards, addCard, deleteCard, updateCard } = useCards(boardId);
  
  const fileInputRef = useRef(null);
  const [showImageModal, setShowImageModal] = useState(null);

  if (!board) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>보드를 찾을 수 없습니다.</div>;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !isHost) return;

    // FileReader를 사용해 로컬 테스트용 Base64 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      addCard(boardId, reader.result, '새 자료', '설명을 입력하세요');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert('공유 링크가 복사되었습니다!');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
            ← 목록으로
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{board.title} {isHost ? '(편집 모드)' : ''}</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => copyLink(`${window.location.origin}/share/board/${board.board_id}`)}>
            <Share2 size={20} /> 보드 전체 링크
          </button>
          {isHost && (
            <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
              <Upload size={20} /> 자료 업로드
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
      </div>

      <div className="grid-layout">
        {cards.map(card => (
          <div key={card.card_id} className="glass-card">
            <div 
              style={{ 
                height: '200px', 
                backgroundImage: `url(${card.file_url})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              <button 
                className="btn-icon" 
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255,255,255,0.8)' }}
                onClick={() => setShowImageModal(card.file_url)}
              >
                <Maximize2 size={18} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {isHost ? (
                <input 
                  type="text" 
                  value={card.title} 
                  onChange={(e) => updateCard(card.card_id, { title: e.target.value })}
                  style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                />
              ) : (
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>{card.title}</h3>
              )}
              
              {isHost ? (
                <textarea 
                  value={card.description} 
                  onChange={(e) => updateCard(card.card_id, { description: e.target.value })}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              ) : (
                <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{card.description}</p>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                <button className="btn-secondary" onClick={() => copyLink(card.share_link)}>
                  <LinkIcon size={18} /> 개별 링크
                </button>
                {isHost && (
                  <button className="btn-danger" onClick={() => deleteCard(card.card_id)}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem' }}>
            <Upload size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>{isHost ? "우측 상단의 '자료 업로드' 버튼을 눌러 첫 자료를 추가해보세요." : "아직 업로드된 자료가 없습니다."}</p>
          </div>
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
