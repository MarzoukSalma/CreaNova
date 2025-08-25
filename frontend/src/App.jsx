import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import {BrowserRouter as Router,Routes,Route,Navigate,} from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/homepage.jsx"; // Ajoutez cette page
import JournalCreativite from "./pages/journal.jsx";
import StudioRevesCreatifs from "./pages/dream.jsx";
import Galerie from "./pages/inspiration.jsx";
import Chatboot from "./pages/chatboot.jsx";
import Sittings from "./pages/sittings.jsx";
import Login from "./pages/login.jsx";
import WorkspacePage from "./pages/workspace.jsx";

// Composant wrapper pour gérer la navigation vers login
const HomePageWrapper = () => {
  const navigate = useNavigate();
  return <HomePage onNavigateToLogin={() => navigate('/login')} />;
};



const App = () => {
  return (
    <Router>
     
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePageWrapper />} />
        <Route path="/login" element={<Login />} />
        
        {/* Toutes les pages protégées */}
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
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;