import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-purple-600">
                🌟 CREANOVA 🌟
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <NavLink
              to="/reves"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`
              }
            >
              💭 Mes Rêves
            </NavLink>

            <NavLink
              to="/galerie"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`
              }
            >
              🎨 Galerie
            </NavLink>

            <NavLink
              to="/journal"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`
              }
            >
              📔 Journal
            </NavLink>

            <NavLink
              to="/muse"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`
              }
            >
              🌟 Muse Créative
            </NavLink>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
               <NavLink
              to="/sittings"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`
              }
            >
              u
            </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
