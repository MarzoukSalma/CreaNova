<<<<<<< HEAD
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

=======
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ ajoute cet import
import JournalCreativite from "./pages/journal.jsx";
import StudioRevesCreatifs from "./pages/dream.jsx";
import Galerie from "./pages/inspiration.jsx"; // Assurez-vous que ce composant existe
import Chatboot from "./pages/chatboot.jsx"; // Assurez-vous que ce composant existe
import Sittings from "./pages/sittings.jsx"; // Assurez-vous que ce composant existe
import Login from "./pages/login.jsx";
import WorkspacePage from "./pages/workspace.jsx";
>>>>>>> 583e8f613e18ab6b6c0117f547406f5022b98cde
const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar visible sur toutes les pages */}
      
      <Routes>
        <Route path="/" element={<Login />} />
<<<<<<< HEAD

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
=======
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/muse" element={<Chatboot />} />
        <Route path="/sittings" element={<Sittings />} />
        <Route path="/reves" element={<StudioRevesCreatifs />} />
        <Route path="/journal" element={<JournalCreativite />} />
        <Route path="/workspace" element={<WorkspacePage />} />
>>>>>>> 583e8f613e18ab6b6c0117f547406f5022b98cde
      </Routes>
    </Router>
  );
};

export default App;
