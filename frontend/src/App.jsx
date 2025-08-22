import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import JournalCreativite from './pages/journal.jsx';
import StudioRevesCreatifs from './pages/dream.jsx';
import Galerie from './pages/inspiration.jsx';
import Chatboot from './pages/chatboot.jsx';
import Sittings from './pages/sittings.jsx';
import Login from './pages/login.jsx';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ import correctement en haut

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar visible sur toutes les pages */}
      
      <Routes>
        <Route path="/" element={<Login />} />

        {/* toutes les pages protégées */}
        <Route
          path="/galerie"
          element={
            <ProtectedRoute>
              <Galerie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/muse"
          element={
            <ProtectedRoute>
              <Chatboot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sittings"
          element={
            <ProtectedRoute>
              <Sittings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reves"
          element={
            <ProtectedRoute>
              <StudioRevesCreatifs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <JournalCreativite />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
