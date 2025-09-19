import React, { useState, useEffect } from "react";
import {
  Heart,
  Upload,
  Plus,
  X,
  Camera,
  Quote,
  Smile,
  Frown,
  Meh,
  Sun,
  Moon,
  Coffee,
  Star,
  Filter,
  Grid,
  List,
  RefreshCw,
  Zap,
  Cloud,
} from "lucide-react";
import  img1 from "../assets/image1.jpeg";
import img2 from "../assets/image2.jpeg";
import img3 from "../assets/image3.jpeg";
import img4 from "../assets/image4.jpeg";
import img5 from "../assets/image5.jpeg";
import img6 from "../assets/image6.jpeg";
import img7 from "../assets/image7.jpeg";


import api from '../api/api.jsx'; // Import de l'API

const GalleryPage = () => {
  const [selectedMood, setSelectedMood] = useState("tous");
  const [viewMode, setViewMode] = useState("grid");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [inspirations, setInspirations] = useState([]);
  const [filteredInspirations, setFilteredInspirations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [isGeneratingDaily, setIsGeneratingDaily] = useState(false);
  const [customMood, setCustomMood] = useState("");
  const [showUserCreations, setShowUserCreations] = useState(false);
  const [uploadData, setUploadData] = useState({
    image: null,
    imagePreview: "",
    text: "",
    mood: "",
    title: "",
  });

  // Configuration des 6 humeurs principales + "tous"
  const moods = {
    tous: {
      name: "Toutes",
      icon: <Star className="w-6 h-6" />,
      color: "from-gray-400 to-gray-600",
      bg: "bg-gray-50",
      text: "text-gray-600",
    },
    heureux: {
      name: "Heureux",
      icon: <Smile className="w-6 h-6" />,
      color: "from-yellow-400 to-orange-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    triste: {
      name: "Triste",
      icon: <Cloud className="w-6 h-6" />,
      color: "from-blue-400 to-indigo-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    stressé: {
      name: "Stressé",
      icon: <Zap className="w-6 h-6" />,
      color: "from-red-400 to-red-600",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    motivé: {
      name: "Motivé",
      icon: <Star className="w-6 h-6" />,
      color: "from-purple-400 to-pink-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    fatigué: {
      name: "Fatigué",
      icon: <Coffee className="w-6 h-6" />,
      color: "from-amber-400 to-yellow-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    amoureux: {
      name: "Amoureux",
      icon: <Heart className="w-6 h-6" />,
      color: "from-pink-400 to-pink-600",
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
  };

  // Obtenir une image par défaut selon le mood
  const getMoodDefaultImage = (mood) => {
    const imageMap = {
      heureux: img2,
      triste: img1,
      stressé: img5,
      motivé: img7,
      fatigué: img6,
      amoureux: img4,
    };
    return imageMap[mood] || img3;
  };

  // Charger toutes les inspirations depuis l'API
  const loadAllInspirations = async () => {
    setIsLoading(true);
    try {
      // Charger les inspirations utilisateur
      const userResponse = await api.get('/inspirations/user');
      console.log('Inspirations utilisateur:', userResponse.data);
      
      // Charger les inspirations par défaut (générées par l'IA)
      let defaultInspirations = [];
      try {
        const defaultResponse = await api.get('/inspirations/default');
        console.log('Inspirations par défaut:', defaultResponse.data);
        defaultInspirations = defaultResponse.data || [];
      } catch (error) {
        console.log('Aucune inspiration par défaut trouvée:', error.message);
      }

      // Adapter les inspirations utilisateur
      const userInspirations = userResponse.data.map(inspiration => ({
        id: inspiration.id,
        type: "quote",
        text: inspiration.contenu,
        title: inspiration.titre || `Inspiration ${inspiration.mood}`,
        mood: inspiration.mood,
        createur: inspiration.isGenerated ? "IA Assistant" : "Vous",
        date: inspiration.date,
        createdAt: inspiration.createdAt,
        image: getMoodDefaultImage(inspiration.mood),
        isUserCreated: true,
        isGenerated: inspiration.isGenerated || false,
        originalMoodInput: inspiration.originalMood || null,
        isCustomMood: inspiration.originalMood && inspiration.originalMood !== inspiration.mood,
      }));

      // Adapter les inspirations par défaut
      const adaptedDefaultInspirations = defaultInspirations.map(inspiration => ({
        id: `default_${inspiration.id}`,
        type: "quote",
        text: inspiration.contenu,
        title: `Inspiration ${inspiration.mood}`,
        mood: inspiration.mood,
        createur: "IA Assistant",
        date: inspiration.date,
        createdAt: inspiration.createdAt,
        image: getMoodDefaultImage(inspiration.mood),
        isUserCreated: false,
        isGenerated: true,
      }));
      
      // Combiner toutes les inspirations
      const allInspirations = [...userInspirations, ...adaptedDefaultInspirations];
      console.log('Toutes les inspirations:', allInspirations);
      
      setInspirations(allInspirations);
    } catch (error) {
      console.error('Erreur lors du chargement des inspirations:', error);
      alert('Erreur lors du chargement des inspirations');
    } finally {
      setIsLoading(false);
    }
  };

  // Générer des inspirations quotidiennes pour les 6 moods principaux
  const generateDailyInspirations = async () => {
    setIsGeneratingDaily(true);
    try {
      const principalMoods = ["heureux", "triste", "stressé", "motivé", "fatigué", "amoureux"];
      
      for (const mood of principalMoods) {
        try {
          console.log(`Génération pour mood: ${mood}`);
          await api.post('/inspirations/generate', { mood });
        } catch (error) {
          console.error(`Erreur pour mood ${mood}:`, error);
        }
      }
      
      // Recharger toutes les inspirations
      await loadAllInspirations();
      alert('Inspirations quotidiennes générées avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération des inspirations quotidiennes:', error);
      alert('Erreur lors de la génération des inspirations quotidiennes');
    } finally {
      setIsGeneratingDaily(false);
    }
  };

  // Générer une inspiration personnalisée
  const generateCustomInspiration = async () => {
    if (!customMood.trim()) return;
    
    setIsGeneratingCustom(true);
    try {
      const response = await api.post('/inspirations/generate', { 
        mood: customMood.trim() 
      });
      
      console.log('Inspiration personnalisée générée:', response.data);
      
      // Ajouter la nouvelle inspiration à la liste
      const newInspiration = {
        id: response.data.id,
        type: "quote",
        text: response.data.contenu,
        title: response.data.titre || `Inspiration ${customMood}`,
        mood: response.data.mood,
        createur: "IA Assistant",
        date: response.data.date,
        createdAt: response.data.createdAt || new Date().toISOString(),
        image: getMoodDefaultImage(response.data.mood),
        isUserCreated: true,
        isGenerated: true,
        isCustomMood: true,
        originalMoodInput: customMood.trim(),
      };
      
      setInspirations(prev => [newInspiration, ...prev]);
      setCustomMood("");
      
      alert(`Inspiration générée pour l'humeur "${customMood}" !`);
      
    } catch (error) {
      console.error('Erreur lors de la génération de l\'inspiration personnalisée:', error);
      alert('Erreur lors de la génération. Veuillez réessayer.');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  // Créer une inspiration manuellement
  const saveInspiration = async () => {
    if (!uploadData.text || !uploadData.mood) {
    
      return;
    }

    try {
      const response = await api.post('/inspirations/', {
        contenu: uploadData.text,
        mood: uploadData.mood,
        date: new Date().toISOString(),
        createur: 'user',
      });

      console.log('Inspiration manuelle créée:', response.data);

      const newInspiration = {
        id: response.data.id,
        type: uploadData.image ? "image" : "quote",
        text: response.data.contenu,
        mood: response.data.mood,
        image: getMoodDefaultImage(response.data.mood),
        createur: "Vous",
        isUserCreated: true,
        isGenerated: false,
        createdAt: response.data.createdAt,
      };

      setInspirations(prev => [newInspiration, ...prev]);
      setIsUploadModalOpen(false);
      setUploadData({
        image: null,
        imagePreview: "",
        text: "",
        mood: "",
        title: "",
      });

      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Supprimer une inspiration
  const deleteInspiration = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette inspiration ?')) {
      return;
    }

    try {
      await api.delete(`/inspirations/${id}`);
      setInspirations(prev => prev.filter(insp => insp.id !== id));
      alert('Inspiration supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression. Veuillez réessayer.');
    }
  };

  // Charger les inspirations au démarrage
  useEffect(() => {
    loadAllInspirations();
  }, []);

  // Filtrer les inspirations par mood et par type (toutes vs mes créations)
  useEffect(() => {
    let filtered = inspirations;
    
    // Filtrer par type (toutes vs mes créations)
    if (showUserCreations) {
    filtered = filtered.filter(inspiration => inspiration.createur === "user");
  }
    // Filtrer par mood
    if (selectedMood !== "tous") {
      filtered = filtered.filter(inspiration => inspiration.mood === selectedMood);
    }
    
    setFilteredInspirations(filtered);
  }, [selectedMood, inspirations, showUserCreations]);

  

  // Obtenir les inspirations du jour
  const getTodayInspirations = () => {
    const today = new Date().toDateString();
    return inspirations.filter(insp => 
      new Date(insp.createdAt).toDateString() === today
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🎨 Galerie d'Inspirations
          </h1>
          <p className="text-lg text-gray-600">
            Trouvez l'inspiration selon votre humeur du moment
          </p>
          <div className="text-sm text-gray-500 mt-2">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Mood Selector */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              Comment vous sentez-vous aujourd'hui ?
            </h2>

            <div className="flex gap-2">
              <button
                onClick={loadAllInspirations}
                disabled={isLoading}
                className="p-2 rounded-lg transition-all text-gray-400 hover:text-gray-600 disabled:opacity-50"
                title="Actualiser"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Moods principaux */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            {Object.entries(moods).map(([key, mood]) => (
              <button
                key={key}
                onClick={() => setSelectedMood(key)}
                className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  selectedMood === key
                    ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                    : `${mood.bg} ${mood.text} hover:shadow-md`
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {mood.icon}
                  <span className="font-medium text-sm">{mood.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Section humeur personnalisée */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🎯 Humeur personnalisée
              <span className="text-sm text-gray-500 font-normal">
                (Générez une inspiration selon votre humeur exacte)
              </span>
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                placeholder="Ex: confus, excité, nostalgique, déçu, fier..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && generateCustomInspiration()}
              />
              <button
                onClick={generateCustomInspiration}
                disabled={!customMood.trim() || isGeneratingCustom}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGeneratingCustom ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Générer
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Appuyez sur Entrée ou cliquez sur Générer pour créer une inspiration personnalisée
            </p>
          </div>
        </div>

        {/* Section Inspirations d'Aujourd'hui */}
        {getTodayInspirations().length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Star className="w-6 h-6 text-purple-500" />
                Mes Inspirations 
              </h2>
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                {getTodayInspirations().length} inspiration{getTodayInspirations().length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getTodayInspirations().slice(0, 6).map(inspiration => (
                <div key={inspiration.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`px-2 py-1 bg-gradient-to-r ${
                        moods[inspiration.mood]?.color || "from-gray-400 to-gray-600"
                      } text-white rounded-full text-xs font-semibold flex items-center gap-1`}
                    >
                      {moods[inspiration.mood]?.icon || <Meh className="w-3 h-3" />}
                      {moods[inspiration.mood]?.name || inspiration.mood}
                    </div>
                    <div className="flex items-center gap-2">
                      {inspiration.isCustomMood && (
                        <span className="bg-amber-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
                          {inspiration.originalMoodInput || 'Custom'}
                        </span>
                      )}
                      {inspiration.isGenerated && (
                        <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
                          IA
                        </span>
                      )}
                      {inspiration.isUserCreated && (
                        <button
                          onClick={() => deleteInspiration(inspiration.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    {inspiration.title}
                  </h4>
                  
                  <p className="text-gray-700 text-sm italic leading-relaxed mb-3">
                    "{inspiration.text}"
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(inspiration.createdAt).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    <span className="text-xs text-gray-500">
                      par vous {inspiration.isGenerated ? '(IA générée)' : '(création manuelle)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 bg-gradient-to-r ${
                moods[selectedMood]?.color || "from-gray-400 to-gray-600"
              } text-white rounded-full font-semibold flex items-center gap-2`}
            >
              {moods[selectedMood] && moods[selectedMood].icon}
              Mode {moods[selectedMood] ? moods[selectedMood].name : selectedMood}
            </div>
            <span className="text-gray-600">
              {filteredInspirations.length} inspiration
              {filteredInspirations.length !== 1 ? "s" : ""}
            </span>
            {(isLoading || isGeneratingDaily) && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <span className="text-sm">
                  {isGeneratingDaily ? 'Génération...' : 'Chargement...'}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowUserCreations(!showUserCreations)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                showUserCreations 
                  ? 'bg-indigo-500 text-white shadow-lg' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              <Star className="w-4 h-4" />
              {showUserCreations ? 'Toutes' : 'Mes créations'}
            </button>

            <button
              onClick={generateDailyInspirations}
              disabled={isGeneratingDaily || isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isGeneratingDaily ? 'animate-spin' : ''}`} />
              {isGeneratingDaily ? 'Génération...' : 'Générer du jour'}
            </button>
            
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Ajouter Inspiration
            </button>
          </div>
        </div>

        {/* Inspirations Gallery */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6"
          }`}
        >
          {filteredInspirations.map((inspiration) => (
            <div
              key={inspiration.id}
              className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div
                className={`relative ${viewMode === "list" ? "w-1/3" : "h-64"}`}
              >
                <img
                  src={inspiration.image}
                  alt={inspiration.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-4 left-4 px-3 py-1 bg-gradient-to-r ${
                    moods[inspiration.mood]?.color || "from-gray-400 to-gray-600"
                  } text-white rounded-full text-sm font-semibold flex items-center gap-1`}
                >
                  {moods[inspiration.mood]?.icon || <Meh className="w-4 h-4" />}
                  {moods[inspiration.mood]?.name || inspiration.mood}
                </div>
                
                <div className="absolute top-4 right-4 flex gap-2">
                  {inspiration.isCustomMood && (
                    <div className="bg-amber-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
                      Custom
                    </div>
                  )}
                  {inspiration.isGenerated && (
                    <div className="bg-blue-500 text-white rounded-full p-2">
                      <Star className="w-4 h-4" />
                    </div>
                  )}
                  {inspiration.isUserCreated && !inspiration.isGenerated && (
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <Heart className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`p-6 ${
                  viewMode === "list"
                    ? "w-2/3 flex flex-col justify-center"
                    : ""
                }`}
              >
                <h3 className="font-bold text-xl mb-3 text-gray-800">
                  {inspiration.title}
                </h3>

                <div className="flex items-start gap-3 mb-4">
                  <Quote className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed italic text-lg">
                    "{inspiration.text}"
                  </p>
                </div>

                {inspiration.createur && (
                  <p className="text-right text-gray-500 font-medium">
                    — {inspiration.createur}
                  </p>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">J'aime</span>
                    </button>
                    
                    {inspiration.isCustomMood && inspiration.originalMoodInput && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        {inspiration.originalMoodInput}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Upload className="w-5 h-5" />
                    </button>
                    {inspiration.isUserCreated && (
                      <button
                        onClick={() => deleteInspiration(inspiration.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {inspiration.createdAt && (
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(inspiration.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInspirations.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {showUserCreations ? "Aucune de vos créations" : "Aucune inspiration"} 
              {selectedMood !== "tous" ? ` pour l'humeur "${moods[selectedMood]?.name || selectedMood}"` : ""}
            </h3>
            <p className="text-gray-600 mb-6">
              {showUserCreations 
                ? "Vous n'avez pas encore créé d'inspiration. Commencez dès maintenant !"
                : "Soyez le premier à ajouter une inspiration pour cette humeur !"
              }
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowUserCreations(!showUserCreations)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                {showUserCreations ? 'Voir toutes les inspirations' : 'Voir mes inspirations'}
              </button>
              <button
                onClick={generateDailyInspirations}
                disabled={isGeneratingDaily}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isGeneratingDaily ? 'Génération...' : 'Générer automatiquement'}
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                Créer manuellement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Nouvelle Inspiration
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* mood */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood associé *
                </label>
                <input
                  type="text"
                  value={uploadData.mood}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      mood: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Donnez un mood à votre inspiration..."
                />
              </div>

              

              {/* Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte d'inspiration *
                </label>
                <textarea
                  value={uploadData.text}
                  onChange={(e) =>
                    setUploadData((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
                  placeholder="Écrivez votre message inspirant..."
                />
              </div>

              

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={saveInspiration}
                  disabled={!uploadData.text || !uploadData.mood}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;