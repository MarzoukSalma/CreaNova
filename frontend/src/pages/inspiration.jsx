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
import { motion } from "framer-motion";
import img1 from "../assets/image1.jpeg";
import img2 from "../assets/image2.jpeg";
import img3 from "../assets/image3.jpeg";
import img4 from "../assets/image4.jpeg";
import img5 from "../assets/image5.jpeg";
import img6 from "../assets/image6.jpeg";
import img7 from "../assets/image7.jpeg";

import api from "../api/api.jsx"; // Import de l'API

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
      const userResponse = await api.get("/inspirations/user");
      console.log("Inspirations utilisateur:", userResponse.data);

      // Charger les inspirations par défaut (générées par l'IA)

      // Adapter les inspirations utilisateur
const userInspirations = userResponse.data.map((inspiration) => ({
  id: inspiration.id,
  type: "quote",
  text: inspiration.contenu,
  title: inspiration.titre || `Inspiration ${inspiration.mood}`,
  mood: inspiration.mood,

  // ✅ source réelle (DB)
  source: inspiration.createur, // "user" ou "ai"

  // ✅ pour l'affichage seulement
  displayCreator: inspiration.createur === "ai" ? "IA Assistant" : "Vous",

  createdAt: inspiration.createdAt,
  image: getMoodDefaultImage(inspiration.mood),

  // ✅ flags corrects
  isUserCreated: inspiration.createur === "user",
  isGenerated: inspiration.createur === "ai",
}));
      // Adapter les inspirations par défaut

      // Combiner toutes les inspirations
      const allInspirations = [...userInspirations];
      console.log("Toutes les inspirations:", allInspirations);

      setInspirations(allInspirations);
    } catch (error) {
      console.error("Erreur lors du chargement des inspirations:", error);
      alert("Erreur lors du chargement des inspirations");
    } finally {
      setIsLoading(false);
    }
  };

  // Générer des inspirations quotidiennes pour les 6 moods principaux
  const generateDailyInspirations = async () => {
    setIsGeneratingDaily(true);
    try {
      const principalMoods = [
        "heureux",
        "triste",
        "stressé",
        "motivé",
        "fatigué",
        "amoureux",
      ];

      for (const mood of principalMoods) {
        try {
          console.log(`Génération pour mood: ${mood}`);
          await api.post("/inspirations/generate", { mood });
        } catch (error) {
          console.error(`Erreur pour mood ${mood}:`, error);
        }
      }

      // Recharger toutes les inspirations
      await loadAllInspirations();
      alert("Inspirations quotidiennes générées avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de la génération des inspirations quotidiennes:",
        error,
      );
      alert("Erreur lors de la génération des inspirations quotidiennes");
    } finally {
      setIsGeneratingDaily(false);
    }
  };

  // Générer une inspiration personnalisée
  const generateCustomInspiration = async () => {
    if (!customMood.trim()) return;

    setIsGeneratingCustom(true);
    try {
      const response = await api.post("/inspirations/generate", {
        mood: customMood.trim(),
      });

      console.log("Inspiration personnalisée générée:", response.data);

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

      setInspirations((prev) => [newInspiration, ...prev]);
      setCustomMood("");

      alert(`Inspiration générée pour l'humeur "${customMood}" !`);
    } catch (error) {
      console.error(
        "Erreur lors de la génération de l'inspiration personnalisée:",
        error,
      );
      alert("Erreur lors de la génération. Veuillez réessayer.");
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
      const response = await api.post("/inspirations/", {
        contenu: uploadData.text,
        mood: uploadData.mood,
        date: new Date().toISOString(),
        createur: "user",
      });

      console.log("Inspiration manuelle créée:", response.data);

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

      setInspirations((prev) => [newInspiration, ...prev]);
      setIsUploadModalOpen(false);
      setUploadData({
        image: null,
        imagePreview: "",
        text: "",
        mood: "",
        title: "",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  // Supprimer une inspiration
  const deleteInspiration = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette inspiration ?")) {
      return;
    }

    try {
      await api.delete(`/inspirations/${id}`);
      setInspirations((prev) => prev.filter((insp) => insp.id !== id));
      alert("Inspiration supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression. Veuillez réessayer.");
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
     if (showUserCreations) 
  filtered = filtered.filter((inspiration) => inspiration.source === "user"

      );
    }
    // Filtrer par mood
    if (selectedMood !== "tous") {
      filtered = filtered.filter(
        (inspiration) => inspiration.mood === selectedMood,
      );
    }

    setFilteredInspirations(filtered);
  }, [selectedMood, inspirations, showUserCreations]);

  // Obtenir les inspirations du jour
  const getTodayInspirations = () => {
    const today = new Date().toDateString();
    return inspirations.filter(
      (insp) => new Date(insp.createdAt).toDateString() === today,
    );
  };

  return (
    <div className="min-h-screen bg-[#080c1a] text-slate-300 font-sans relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-18%] left-[-12%] w-[50%] h-[50%] bg-blue-900/12 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-18%] right-[-12%] w-[45%] h-[45%] bg-violet-900/10 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-pink-900/8 blur-[120px] rounded-full" />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.1, 0.35, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extralight text-white tracking-tight mb-2">
            Galerie d'{" "}
            <span className="font-serif italic text-violet-400">
              Inspirations
            </span>
          </h1>
          <p className="text-slate-400 text-sm">
            Trouvez l'inspiration selon votre humeur du moment
          </p>
          <div className="text-xs text-slate-500 mt-2">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </motion.div>

        {/* Mood Selector */}
        <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              Comment vous sentez-vous aujourd'hui ?
            </h2>

            <div className="flex gap-2">
              <button
                onClick={loadAllInspirations}
                disabled={isLoading}
                className="p-2 rounded-lg transition-all text-slate-400 hover:text-slate-200 hover:bg-[#1a1f35] disabled:opacity-50"
                title="Actualiser"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#1a1f35]"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-purple-500/20 text-purple-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#1a1f35]"
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
                className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 border ${
                  selectedMood === key
                    ? `bg-gradient-to-r ${mood.color} text-white shadow-lg border-transparent`
                    : `bg-[#0f1323] border-[#1e2540] text-slate-300 hover:border-blue-500/50`
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
          <div className="border-t border-[#1e2540] pt-6">
            <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">
              Humeur personnalisée
              <span className="text-sm text-slate-500 font-normal">
                ( Laissez l’IA vous proposer une inspiration adaptée à votre
                humeur du moment.)
              </span>
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                placeholder="Ex: confus, excité, nostalgique, déçu, fier..."
                className="flex-1 px-4 py-3 bg-[#0f1323] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                onKeyPress={(e) =>
                  e.key === "Enter" && generateCustomInspiration()
                }
              />
              <button
                onClick={generateCustomInspiration}
                disabled={!customMood.trim() || isGeneratingCustom}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 bg-gradient-to-r ${
                moods[selectedMood]?.color || "from-gray-400 to-gray-600"
              } text-white rounded-full font-semibold flex items-center gap-2 shadow-lg`}
            >
              {moods[selectedMood] && moods[selectedMood].icon}
              Mode{" "}
              {moods[selectedMood] ? moods[selectedMood].name : selectedMood}
            </div>
            <span className="text-slate-400">
              {filteredInspirations.length} inspiration
              {filteredInspirations.length !== 1 ? "s" : ""}
            </span>
            {(isLoading || isGeneratingDaily) && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <span className="text-sm">
                  {isGeneratingDaily ? "Génération..." : "Chargement..."}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowUserCreations(!showUserCreations)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                showUserCreations
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30"
              }`}
            >
              <Star className="w-4 h-4" />
              {showUserCreations ? "Toutes" : "Mes créations"}
            </button>

            <button
              onClick={generateDailyInspirations}
              disabled={isGeneratingDaily || isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-2 transform hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${isGeneratingDaily ? "animate-spin" : ""}`}
              />
              {isGeneratingDaily ? "Génération..." : "Générer du jour"}
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
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
          {filteredInspirations.map((inspiration, index) => (
            <motion.div
              key={inspiration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              className={`group bg-[#0a0e1a] border border-[#1e2540] rounded-3xl overflow-hidden hover:border-blue-500/30 hover:shadow-2xl transition-all duration-500 ${
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
                    moods[inspiration.mood]?.color ||
                    "from-gray-400 to-gray-600"
                  } text-white rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg`}
                >
                  {moods[inspiration.mood]?.icon || <Meh className="w-4 h-4" />}
                  {moods[inspiration.mood]?.name || inspiration.mood}
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  {inspiration.isCustomMood && (
                    <div className="bg-amber-500 text-white rounded-full px-2 py-1 text-xs font-semibold shadow-lg">
                      Custom
                    </div>
                  )}
                  {inspiration.isGenerated && (
                    <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                      <Star className="w-4 h-4" />
                    </div>
                  )}
                  {inspiration.isUserCreated && !inspiration.isGenerated && (
                    <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
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
                <h3 className="font-bold text-xl mb-3 text-white">
                  {inspiration.title}
                </h3>

                <div className="flex items-start gap-3 mb-4">
                  <Quote className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-300 leading-relaxed italic text-lg">
                    "{inspiration.text}"
                  </p>
                </div>

                {inspiration.createur && (
                  <p className="text-right text-slate-500 font-medium">
                    — {inspiration.displayCreator}
                  </p>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1e2540]">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">J'aime</span>
                    </button>

                    {inspiration.isCustomMood &&
                      inspiration.originalMoodInput && (
                        <span className="text-xs text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-1 rounded-full">
                          {inspiration.originalMoodInput}
                        </span>
                      )}
                  </div>

                  <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-slate-200 transition-colors">
                      <Upload className="w-5 h-5" />
                    </button>
                    {inspiration.isUserCreated && (
                      <button
                        onClick={() => deleteInspiration(inspiration.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {inspiration.createdAt && (
                  <div className="text-xs text-slate-500 mt-2">
                    {new Date(inspiration.createdAt).toLocaleDateString(
                      "fr-FR",
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInspirations.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-60">🌟</div>
            <h3 className="text-2xl font-light mb-2 text-white">
              {showUserCreations
                ? "Aucune de vos créations"
                : "Aucune inspiration"}
              {selectedMood !== "tous"
                ? ` pour l'humeur "${moods[selectedMood]?.name || selectedMood}"`
                : ""}
            </h3>
            <p className="text-slate-400 mb-6">
              {showUserCreations
                ? "Vous n'avez pas encore créé d'inspiration. Commencez dès maintenant !"
                : "Soyez le premier à ajouter une inspiration pour cette humeur !"}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowUserCreations(!showUserCreations)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                {showUserCreations
                  ? "Voir toutes les inspirations"
                  : "Voir mes inspirations"}
              </button>
              <button
                onClick={generateDailyInspirations}
                disabled={isGeneratingDaily}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50"
              >
                {isGeneratingDaily
                  ? "Génération..."
                  : "Générer automatiquement"}
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                Créer manuellement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0f1323] border border-[#1e2540] rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-white">
                Nouvelle Inspiration
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 hover:bg-[#1a1f35] rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* mood */}
              <div>
                <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
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
                  className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="Donnez un mood à votre inspiration..."
                />
              </div>

              {/* Text */}
              <div>
                <label className="block text-sm font-light text-slate-300 mb-2 uppercase tracking-wider">
                  Texte d'inspiration *
                </label>
                <textarea
                  value={uploadData.text}
                  onChange={(e) =>
                    setUploadData((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1e2540] text-white placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 h-32 resize-none transition-all"
                  placeholder="Écrivez votre message inspirant..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-[#1a1f35] border border-[#1e2540] text-slate-300 rounded-xl hover:border-slate-600 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={saveInspiration}
                  disabled={!uploadData.text || !uploadData.mood}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publier
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
