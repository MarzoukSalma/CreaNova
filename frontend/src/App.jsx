import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import HomePage from "./pages/homepage.jsx";
import JournalCreativite from "./pages/journal.jsx";
import StudioRevesCreatifs from "./pages/dream.jsx";
import Galerie from "./pages/inspiration.jsx";
import Chatboot from "./pages/chatboot.jsx";
import Sittings from "./pages/sittings.jsx";
import Login from "./pages/login.jsx";
import WorkspacePage from "./pages/workspace.jsx";
import Protectelogin from "./components/protectlogin.jsx";
// 1. Import de ta nouvelle page
import AboutUs from "./components/AboutUs.jsx";

const HomePageWrapper = () => {
  const navigate = useNavigate();
  return <HomePage onNavigateToLogin={() => navigate("/login")} />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Pages Publiques */}
        <Route path="/" element={<HomePageWrapper />} />
        <Route
          path="/login"
          element={
            <Protectelogin>
              <Login />
            </Protectelogin>
          }
        />

        {/* 2. Ajout de la route "Réalisé par" (Publique) */}
        <Route path="/about" element={<AboutUs />} />

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

        {/* Redirection automatique si la page n'existe pas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
