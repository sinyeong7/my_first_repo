import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      const result = await loginWithGoogle();
      
      // 구글 로그인 성공 후, 호스트 이메일인지 확인
      if (result.user.email !== 'happysinyeong21@gmail.com') {
        setError('접근 권한이 없는 계정입니다. 호스트 계정으로 로그인해주세요.');
        // 권한이 없으므로 로그아웃 처리할 수도 있지만, 일단 에러만 표시
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(`구글 로그인에 실패했습니다: ${err.message || err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <BookOpen size={48} style={{ color: 'white', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>호스트 로그인</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>자료 관리를 위해 구글 계정으로 로그인하세요.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin} 
          className="btn-primary" 
          disabled={loading}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', gap: '0.5rem', background: 'white', color: '#333' }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px', height: '20px' }} />
          {loading ? '로그인 중...' : 'Google 계정으로 로그인'}
        </button>
      </div>
    </div>
  );
}
