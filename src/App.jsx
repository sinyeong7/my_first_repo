import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import BoardEditor from './pages/BoardEditor';
import BoardViewer from './pages/BoardViewer';
import CardViewer from './pages/CardViewer';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            {/* Admin Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/board/edit/:boardId" element={<BoardEditor />} />
            
            {/* Student (Viewer) Routes */}
            <Route path="/share/board/:boardId" element={<BoardViewer />} />
            <Route path="/share/card/:cardId" element={<CardViewer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
