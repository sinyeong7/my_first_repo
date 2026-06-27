import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { privacyPolicy, termsOfService } from '../constants/policies';

export default function Footer() {
  const [showModal, setShowModal] = useState(null);

  const policies = {
    privacy: privacyPolicy,
    terms: termsOfService
  };

  return (
    <>
      <footer style={{ marginTop: 'auto', padding: '2rem', textAlign: 'center', color: 'black', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
          <button onClick={() => setShowModal('terms')} style={{ background: 'none', border: 'none', color: 'black', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>이용약관</button>
          <button onClick={() => setShowModal('privacy')} style={{ background: 'none', border: 'none', color: 'black', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>개인정보처리방침</button>
        </div>
        <p style={{ margin: '0.5rem 0' }}>© 2026 sy_padlet. All rights reserved.</p>
        <p style={{ margin: '0' }}>개인정보 보호책임자: 이신영 (서울신가초등학교) | 문의: 02-401-4677</p>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            <div style={{ lineHeight: 1.6, color: 'var(--text-secondary)', textAlign: 'left', padding: '1rem 0' }}>
              <ReactMarkdown>{policies[showModal]}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
