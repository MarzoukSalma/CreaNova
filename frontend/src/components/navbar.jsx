import React from 'react';

const Navbar = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="bg-white shadow-lg border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-purple-600">
🌟 CREANOVA 🌟             </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setActiveSection('reves')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeSection === 'reves' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              💭 Mes Rêves
            </button>
            <button 
              onClick={() => setActiveSection('galerie')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeSection === 'galerie' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              🎨 Galerie
            </button>
            <button 
              onClick={() => setActiveSection('journal')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeSection === 'journal' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              📔 Journal
            </button>
            <button 
              onClick={() => setActiveSection('muse')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeSection === 'muse' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              🌟 Muse Créative
            </button>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;