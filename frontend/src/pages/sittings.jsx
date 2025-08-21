import React, { useState, useRef } from 'react';
import { 
  User, Edit3, Camera, Save, Bell, Palette, Globe, Shield, 
  Moon, Sun, Volume2, VolumeX, Heart, Star, Settings, 
  Mail, Phone, MapPin, Calendar, Award, Trash2, Eye, EyeOff
} from 'lucide-react';

const PersonalSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'Marie Dubois',
    email: 'marie.dubois@example.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    birthdate: '1990-05-15',
    bio: 'Artiste passionnée par la créativité et l\'inspiration. J\'aime partager mes œuvres et découvrir celles des autres.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b15c?w=150&h=150&fit=crop&crop=face'
  });
  
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    sound: true,
    language: 'fr',
    privacy: 'public',
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false
  });

  const fileInputRef = useRef(null);

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = () => {
    // Simulate save
    alert('Profil sauvegardé avec succès ! ✨');
  };

  // Tab configuration
  const tabs = [
    { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
    { id: 'preferences', label: 'Préférences', icon: <Settings className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'privacy', label: 'Confidentialité', icon: <Shield className="w-5 h-5" /> }
  ];

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Camera className="w-6 h-6 text-purple-500" />
          Photo de Profil
        </h3>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={profileData.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-gradient-to-r from-purple-400 to-pink-400"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:shadow-lg transition-all transform hover:scale-110"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-gray-600 mb-2">Choisissez une photo qui vous représente</p>
            <p className="text-sm text-gray-500">JPG, PNG ou GIF. Taille max: 5MB</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-500" />
          Informations Personnelles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de naissance
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={profileData.birthdate}
                onChange={(e) => setProfileData(prev => ({ ...prev, birthdate: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-purple-500" />
          Biographie
        </h3>
        
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
          placeholder="Parlez-nous de vous et de votre passion créative..."
        />
        <p className="text-sm text-gray-500 mt-2">
          {profileData.bio.length}/500 caractères
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
        >
          <Save className="w-5 h-5" />
          Sauvegarder le profil
        </button>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-8">
      {/* Theme */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Palette className="w-6 h-6 text-purple-500" />
          Apparence
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {settings.theme === 'light' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
              <div>
                <p className="font-medium text-gray-800">Thème</p>
                <p className="text-sm text-gray-600">Choisissez votre mode d'affichage préféré</p>
              </div>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="auto">Automatique</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-800">Langue</p>
                <p className="text-sm text-gray-600">Langue d'affichage de l'interface</p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sound */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          {settings.sound ? <Volume2 className="w-6 h-6 text-purple-500" /> : <VolumeX className="w-6 h-6 text-purple-500" />}
          Audio
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-medium text-gray-800">Sons de l'application</p>
            <p className="text-sm text-gray-600">Activer les effets sonores et notifications audio</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, sound: !prev.sound }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.sound ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.sound ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-purple-500" />
          Préférences de Notifications
        </h3>
        
        <div className="space-y-4">
          {[
            {
              key: 'emailNotifications',
              title: 'Notifications par email',
              description: 'Recevez les mises à jour importantes par email'
            },
            {
              key: 'pushNotifications',
              title: 'Notifications push',
              description: 'Notifications instantanées dans votre navigateur'
            },
            {
              key: 'weeklyDigest',
              title: 'Résumé hebdomadaire',
              description: 'Recevez un résumé de vos activités chaque semaine'
            }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-800">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, [notification.key]: !prev[notification.key] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[notification.key] ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[notification.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-500" />
          Paramètres de Confidentialité
        </h3>
        
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-gray-800">Visibilité du profil</p>
                <p className="text-sm text-gray-600">Qui peut voir votre profil et vos créations</p>
              </div>
              <select
                value={settings.privacy}
                onChange={(e) => setSettings(prev => ({ ...prev, privacy: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="public">Public</option>
                <option value="friends">Amis uniquement</option>
                <option value="private">Privé</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Zone Dangereuse
            </h4>
            <p className="text-sm text-red-600 mb-4">
              Ces actions sont irréversibles. Soyez certain de votre choix.
            </p>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                Supprimer toutes mes données
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Supprimer mon compte définitivement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ⚙️ Mon Profil & Paramètres
          </h1>
          <p className="text-lg text-gray-600">Gérez votre profil et personnalisez votre expérience</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6">
              <div className="text-center mb-6">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gradient-to-r from-purple-400 to-pink-400"
                />
                <h3 className="font-bold text-lg text-gray-800">{profileData.name}</h3>
                <p className="text-sm text-gray-600">Artiste créatif</p>
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                <h4 className="font-semibold text-gray-800 mb-3">Mes Statistiques</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Inspirations créées</span>
                    <span className="font-semibold text-purple-600">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">J'aime reçus</span>
                    <span className="font-semibold text-pink-600">156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conversations Muse</span>
                    <span className="font-semibold text-indigo-600">89</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'privacy' && renderPrivacyTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettingsPage;