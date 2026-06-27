import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import BoardEditor from './pages/BoardEditor';
import BoardViewer from './pages/BoardViewer';
import CardViewer from './pages/CardViewer';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Admin & Student Routes (Unprotected, access handled inside components) */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/board/edit/:boardId" element={<BoardEditor />} />
              <Route path="/share/board/:boardId" element={<BoardViewer />} />
              <Route path="/share/card/:cardId" element={<CardViewer />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
