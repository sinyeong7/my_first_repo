import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, Trash2, Maximize2, Share2, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { useBoards, useCards } from '../hooks/useFirestore';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function BoardEditor() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { boards, isHost } = useBoards();
  const board = boards.find(b => b.board_id === boardId);
  const { cards, addCard, deleteCard, updateCard } = useCards(boardId);
  
  const [showImageModal, setShowImageModal] = useState(null);
  
  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [attachFile, setAttachFile] = useState(null);

  if (!board) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>보드를 찾을 수 없습니다.</div>;

  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!attachFile || !isHost) return alert('첨부파일을 반드시 선택해주세요!');
    
    setIsUploading(true);
    try {
      // 1. Upload Attachment
      const attachRef = ref(storage, `boards/${boardId}/${Date.now()}_attach_${attachFile.name}`);
      const attachSnapshot = await uploadBytes(attachRef, attachFile);
      const fileUrl = await getDownloadURL(attachSnapshot.ref);
      
      // 2. Upload Cover Image (if selected)
      let coverUrl = '';
      if (coverFile) {
        const coverRef = ref(storage, `boards/${boardId}/${Date.now()}_cover_${coverFile.name}`);
        const coverSnapshot = await uploadBytes(coverRef, coverFile);
        coverUrl = await getDownloadURL(coverSnapshot.ref);
      }
      
      // Determine file type
      let fileType = 'file';
      if (attachFile.type.startsWith('image/')) fileType = 'image';
      else if (attachFile.type.includes('pdf') || attachFile.name.endsWith('.pdf')) fileType = 'pdf';
      
      await addCard(boardId, fileUrl, coverUrl, uploadTitle || '새 자료', uploadDesc || '설명을 입력하세요', fileType, attachFile.name);
      
      // Reset Modal State
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadDesc('');
      setCoverFile(null);
      setAttachFile(null);
    } catch (error) {
      console.error("Upload failed", error);
      alert("업로드에 실패했습니다. 파일이 너무 크거나 문제가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
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
            <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
              <Upload size={20} /> 자료 업로드
            </button>
          )}
        </div>
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
                display: (!card.cover_url && card.file_type !== 'image') ? 'flex' : 'block',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              {(!card.cover_url && card.file_type !== 'image') && (
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <FileText size={48} style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, padding: '0 1rem', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {card.file_name}
                  </div>
                </div>
              )}
              <button 
                className="btn-icon" 
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255,255,255,0.8)' }}
                onClick={() => {
                  if (card.file_type === 'image') {
                    setShowImageModal(card.file_url);
                  } else {
                    window.open(card.file_url, '_blank');
                  }
                }}
                title={card.file_type === 'image' ? '크게 보기' : '원본 파일 열기'}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => !isUploading && setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>새 자료 업로드</h2>
            <form onSubmit={handleSubmitUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>자료 제목</label>
                <input 
                  type="text" 
                  placeholder="예) 1단원 핵심 요약본" 
                  value={uploadTitle} 
                  onChange={e => setUploadTitle(e.target.value)} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>설명 (선택)</label>
                <textarea 
                  placeholder="자료에 대한 설명을 입력하세요" 
                  value={uploadDesc} 
                  onChange={e => setUploadDesc(e.target.value)} 
                  rows={2}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <FileText size={18} /> 원본 첨부파일 (필수)
                </label>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>PDF, PPT, 엑셀 등 열람/다운로드될 원본 파일</p>
                <input 
                  type="file" 
                  required
                  onChange={e => setAttachFile(e.target.files[0])} 
                  style={{ border: 'none', padding: 0 }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                  <ImageIcon size={18} /> 썸네일 표지 이미지 (선택)
                </label>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>게시판 화면에 예쁘게 보여질 표지 (없으면 기본 아이콘 표시)</p>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setCoverFile(e.target.files[0])} 
                  style={{ border: 'none', padding: 0 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowUploadModal(false)} disabled={isUploading}>
                  취소
                </button>
                <button type="submit" className="btn-primary" disabled={isUploading}>
                  {isUploading ? <><Loader2 size={18} className="spin" /> 업로드 중...</> : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
