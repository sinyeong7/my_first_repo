import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="glass" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
        <BookOpen size={28} />
        EduShare
      </Link>
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>대시보드</Link>
      </nav>
    </header>
  );
}
