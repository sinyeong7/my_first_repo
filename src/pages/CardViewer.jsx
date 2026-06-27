import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Maximize2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function CardViewer() {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(null);

  useEffect(() => {
    async function fetchCard() {
      try {
        const docRef = doc(db, 'cards', cardId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCard({ card_id: docSnap.id, ...docSnap.data() });
        } else {
          setCard(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCard();
  }, [cardId]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>로딩 중...</div>;

  if (!card) return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h2>존재하지 않거나 삭제된 자료입니다.</h2>
      <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>홈으로 가기</Link>
    </div>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
        <div 
          style={{ 
            height: '300px', 
            backgroundImage: `url(${card.file_url})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            position: 'relative',
            cursor: 'pointer'
          }}
          onClick={() => setShowImageModal(card.file_url)}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)', transition: 'background 0.2s' }} 
               onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
               onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
          />
          <Maximize2 size={32} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', opacity: 0.8 }} />
        </div>
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{card.title}</h1>
          <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{card.description}</p>
        </div>
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
