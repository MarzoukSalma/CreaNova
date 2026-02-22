import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("authToken");
  const isAuthenticated = !!token;

  const userInfo = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const userName = userInfo?.name || userInfo?.username || "Utilisateur";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-[#0a0e1a] border-b border-[#1e2540] shadow-xl backdrop-blur-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO - Taille agrandie h-24 pour plus de visibilité */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Creanova"
                className="h-24 w-auto object-contain mix-blend-screen brightness-110 contrast-110"
              />
            </NavLink>
          </div>

          {/* Navigation au centre (Visible seulement si connecté) */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-2">
              {[
                { to: "/reves", label: "Mes Rêves" },
                { to: "/workspace", label: "Workspace" },
                { to: "/galerie", label: "Galerie" },
                { to: "/journal", label: "Journal" },
                { to: "/muse", label: "Muse Créative" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        : "text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Côté Droit */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-all duration-200 shadow-lg shadow-purple-500/20"
                >
                  <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white font-semibold border border-white/20">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {userName.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0f1323] border border-[#1e2540] rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                    <div className="px-4 py-3 border-b border-[#1e2540]">
                      <p className="text-sm font-medium text-white">
                        {userName}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {userInfo?.email}
                      </p>
                    </div>

                    {/* LIEN CORRIGÉ VERS /sittings */}
                    <NavLink
                      to="/sittings"
                      className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-200 mx-2 rounded-lg"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" /> Mon Profil
                    </NavLink>

                    {/* LIEN CORRIGÉ VERS /sittings */}

                    <hr className="my-2 border-[#1e2540]" />

                    <button
                      onClick={handleLogout}
                      className="w-[calc(100%-1rem)] flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 mx-2 rounded-lg"
                    >
                      <LogOut className="w-4 h-4 mr-3" /> Se Déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                S'inscrire / Connexion
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
