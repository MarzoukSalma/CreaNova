import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // ✅ ajoute cet import
import JournalCreativite from './pages/journal.jsx';
import StudioRevesCreatifs from './pages/dream.jsx';
import Galerie from './pages/inspiration.jsx'; // Assurez-vous que ce composant existe
import Chatboot from './pages/chatboot.jsx'; // Assurez-vous que ce composant existe
import Sittings from './pages/sittings.jsx'; // Assurez-vous que ce composant existe
import Login from './pages/login.jsx';
const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar visible sur toutes les pages */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/muse" element={<Chatboot />} />
        <Route path="/sittings" element={<Sittings />} />
        <Route path="/reves" element={<StudioRevesCreatifs />} />
        <Route path="/journal" element={<JournalCreativite />} />
      </Routes>
    </Router>
  );
};

export default App;
