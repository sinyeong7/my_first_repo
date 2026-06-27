import { useState } from 'react';

export default function Footer() {
  const [showModal, setShowModal] = useState(null);

  const policies = {
    privacy: "1. 개인정보의 처리 목적\n본 서비스는 교사의 수업 자료 배포 및 공유 목적으로만 사용되며, 자료 열람자(학생)의 개인정보를 별도로 수집, 이용하지 않습니다.\n\n2. 처리하는 개인정보의 항목\n열람자(학생): 수집 항목 없음.\n\n3. 정보주체의 권리 및 행사방법\n학생에 대한 개인정보를 수집하지 않으므로 관련 행사 요청은 발생하지 않습니다.",
    terms: "제1조 (목적)\n본 약관은 제공하는 수업 자료 공유 서비스의 이용 조건 및 책임을 규정합니다.\n\n제2조 (회원 및 이용자 조건)\n이용자는 제공받은 링크를 인가되지 않은 외부인에게 무단으로 배포하여서는 안 됩니다.\n\n제3조 (콘텐츠 이용 조건)\n본 서비스에 업로드된 자료의 저작권은 등록한 교사에게 있습니다. 이용자는 열람 목적으로만 이용해야 합니다."
  };

  return (
    <>
      <footer style={{ marginTop: 'auto', padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
          <button onClick={() => setShowModal('privacy')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>개인정보 처리방침</button>
          <button onClick={() => setShowModal('terms')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>서비스 이용약관</button>
        </div>
        <p>문의: teacher@school.edu | 기관명: OOO 학교 | 시행일: 2024.01.01</p>
      </footer>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {showModal === 'privacy' ? '개인정보 처리방침' : '서비스 이용약관'}
            </h2>
            <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
              {policies[showModal]}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
