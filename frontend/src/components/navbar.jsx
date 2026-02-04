import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check for authentication token
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("authToken");
  const isAuthenticated = !!token;

  // Get user info from localStorage
  const userInfo = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const userName = userInfo?.name || userInfo?.username || "Utilisateur";
  const userInitial = userName.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");

    // Close dropdown
    setIsDropdownOpen(false);

    // Redirect to login page
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-[#0a0e1a] border-b border-[#1e2540] shadow-xl backdrop-blur-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always visible */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLink
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-300 hover:to-violet-300 transition-all duration-300"
              >
                🌟 CREANOVA 🌟
              </NavLink>
            </div>
          </div>

          {/* Conditional Content */}
          {isAuthenticated ? (
            // Full navigation when authenticated
            <>
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/reves"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        : "text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20"
                    }`
                  }
                >
                  Mes Rêves
                </NavLink>
                <NavLink
                  to="/workspace"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        : "text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20"
                    }`
                  }
                >
                  Workspace
                </NavLink>
                <NavLink
                  to="/galerie"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        : "text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20"
                    }`
                  }
                >
                  Galerie
                </NavLink>
                <NavLink
                  to="/journal"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        : "text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20"
                    }`
                  }
                >
                  Journal
                </NavLink>
                <NavLink
                  to="/muse"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        : "text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20"
                    }`
                  }
                >
                  Muse Créative
                </NavLink>
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
                >
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold border border-white/30">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium">
                    {userName.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0f1323] border border-[#1e2540] rounded-2xl shadow-2xl shadow-black/50 py-2 z-50 backdrop-blur-xl">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-[#1e2540]">
                      <p className="text-sm font-medium text-white">
                        {userName}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {userInfo?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <NavLink
                      to="/sittings"
                      className="flex items-center px-4 py-2.5 mt-1 text-sm text-slate-300 hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-200 mx-2 rounded-lg"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Mon Profil
                    </NavLink>

                    <NavLink
                      to="/sittings"
                      className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-200 mx-2 rounded-lg"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Paramètres
                    </NavLink>

                    <hr className="my-2 border-[#1e2540]" />

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 mx-2 rounded-lg"
                      style={{ width: "calc(100% - 1rem)" }}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Se Déconnecter
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Login/Register buttons when not authenticated
            <div className="flex items-center space-x-4">
              <NavLink
                to="/login"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
              >
                S'inscrire / Connexion
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
