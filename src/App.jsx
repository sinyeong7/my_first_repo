import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import BoardEditor from './pages/BoardEditor';
import BoardViewer from './pages/BoardViewer';
import CardViewer from './pages/CardViewer';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />

              {/* Admin Routes (Protected) */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/board/edit/:boardId" element={
                <ProtectedRoute>
                  <BoardEditor />
                </ProtectedRoute>
              } />
              
              {/* Student (Viewer) Routes (Public) */}
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
