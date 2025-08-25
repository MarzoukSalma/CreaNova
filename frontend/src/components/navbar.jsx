import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Check for authentication token
  const token = localStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('authToken');
  const isAuthenticated = !!token;
  
  // Get user info from localStorage
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const userName = userInfo?.name || userInfo?.username || 'Utilisateur';
  const userInitial = userName.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    
    // Close dropdown
    setIsDropdownOpen(false);

    
    // Redirect to login page
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always visible */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLink to="/" className="text-2xl font-bold text-purple-600">
                🌟 CREANOVA 🌟
              </NavLink>
            </div>
          </div>

          {/* Conditional Content */}
          {isAuthenticated ? (
            // Full navigation when authenticated
            <>
              <div className="flex items-center space-x-8">
                <NavLink
                  to="/reves"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`
                  }
                >
                  💭 Mes Rêves
                </NavLink>
                <NavLink
                  to="/workspace"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`
                  }
                >
                  Workspace
                </NavLink>
                <NavLink
                  to="/galerie"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`
                  }
                >
                  🎨 Galerie
                </NavLink>
                <NavLink
                  to="/journal"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`
                  }
                >
                  📔 Journal
                </NavLink>
                <NavLink
                  to="/muse"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`
                  }
                >
                  🌟 Muse Créative
                </NavLink>
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-2 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-200 shadow-lg"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium">{userName.split(' ')[0]}</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">{userInfo?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <NavLink
                      to="/sittings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Mon Profil
                    </NavLink>

                    <NavLink
                      to="/sittings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Paramètres
                    </NavLink>

                    <hr className="my-1 border-gray-100" />

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors duration-200"
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