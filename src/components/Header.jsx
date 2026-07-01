import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <header className="glass" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
        <BookOpen size={28} />
        EduShare
      </Link>
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>목록보기</Link>
        {currentUser ? (
          <button onClick={handleLogout} className="btn-icon" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }} title="로그아웃">
            <LogOut size={20} />
            <span style={{ fontSize: '0.9rem' }}>로그아웃</span>
          </button>
        ) : (
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', fontWeight: 500 }} title="로그인">
            <LogIn size={20} />
            <span style={{ fontSize: '0.9rem' }}>로그인</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
