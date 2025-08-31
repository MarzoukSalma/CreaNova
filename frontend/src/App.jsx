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
} from "lucide-react";

const GalleryPage = () => {
  const [selectedMood, setSelectedMood] = useState("happy");
  const [viewMode, setViewMode] = useState("grid");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [inspirations, setInspirations] = useState([]);
  const [filteredInspirations, setFilteredInspirations] = useState([]);
  const [uploadData, setUploadData] = useState({
    image: null,
    imagePreview: "",
    text: "",
    mood: "happy",
    title: "",
  });

  // Mood configurations
  const moods = {
    happy: {
      name: "Joyeux",
      icon: <Smile className="w-6 h-6" />,
      color: "from-yellow-400 to-orange-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    sad: {
      name: "Triste",
      icon: <Frown className="w-6 h-6" />,
      color: "from-blue-400 to-indigo-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    calm: {
      name: "Calme",
      icon: <Moon className="w-6 h-6" />,
      color: "from-green-400 to-teal-500",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    energetic: {
      name: "Énergique",
      icon: <Sun className="w-6 h-6" />,
      color: "from-red-400 to-pink-500",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    creative: {
      name: "Créatif",
      icon: <Star className="w-6 h-6" />,
      color: "from-purple-400 to-pink-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    thoughtful: {
      name: "Pensif",
      icon: <Coffee className="w-6 h-6" />,
      color: "from-amber-400 to-yellow-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
  };

  // Sample inspirations data
  useEffect(() => {
    const sampleInspirations = [
      {
        id: 1,
        type: "quote",
        text: "La créativité c'est l'intelligence qui s'amuse.",
        author: "Albert Einstein",
        mood: "creative",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        title: "Créativité pure",
      },
      {
        id: 2,
        type: "image",
        text: "Chaque lever de soleil est une nouvelle chance de recommencer.",
        mood: "happy",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        title: "Nouveau jour",
      },
      {
        id: 3,
        type: "quote",
        text: "Après la pluie, le beau temps. Chaque tempête finit par passer.",
        author: "Proverbe",
        mood: "sad",
        image:
          "https://images.unsplash.com/photo-1502780402662-acc01917286e?w=400&h=300&fit=crop",
        title: "Espoir après la tristesse",
      },
      {
        id: 4,
        type: "image",
        text: "La méditation transforme l'esprit comme l'eau transforme la terre.",
        mood: "calm",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        title: "Sérénité",
      },
      {
        id: 5,
        type: "quote",
        text: "L'énergie et la persistance conquièrent toutes choses.",
        author: "Benjamin Franklin",
        mood: "energetic",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        title: "Force et détermination",
      },
      {
        id: 6,
        type: "image",
        text: "Dans le silence de la réflexion naissent les plus grandes idées.",
        mood: "thoughtful",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        title: "Moment de réflexion",
      },
      {
        id: 7,
        type: "quote",
        text: "Vous êtes plus brave que vous ne le croyez, plus fort que vous ne le paraissez.",
        author: "A.A. Milne",
        mood: "sad",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        title: "Force intérieure",
      },
      {
        id: 8,
        type: "image",
        text: "La joie partagée est une joie doublée.",
        mood: "happy",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        title: "Partage de bonheur",
      },
    ];

    setInspirations(sampleInspirations);
  }, []);

  // Filter inspirations by mood
  useEffect(() => {
    const filtered = inspirations.filter(
      (inspiration) => inspiration.mood === selectedMood
    );
    setFilteredInspirations(filtered);
  }, [selectedMood, inspirations]);

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadData((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save new inspiration
  const saveInspiration = () => {
    if (!uploadData.text || !uploadData.title) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newInspiration = {
      id: Date.now(),
      type: uploadData.image ? "image" : "quote",
      text: uploadData.text,
      title: uploadData.title,
      mood: uploadData.mood,
      image:
        uploadData.imagePreview ||
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      author: "Vous",
      isUserCreated: true,
    };

    setInspirations((prev) => [...prev, newInspiration]);
    setIsUploadModalOpen(false);
    setUploadData({
      image: null,
      imagePreview: "",
      text: "",
      mood: "happy",
      title: "",
    });
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 bg-gradient-to-r ${moods[selectedMood].color} text-white rounded-full font-semibold flex items-center gap-2`}
            >
              {moods[selectedMood].icon}
              Mode {moods[selectedMood].name}
            </div>
            <span className="text-gray-600">
              {filteredInspirations.length} inspiration
              {filteredInspirations.length !== 1 ? "s" : ""}
            </span>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Ajouter Inspiration
          </button>
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
                    moods[inspiration.mood].color
                  } text-white rounded-full text-sm font-semibold flex items-center gap-1`}
                >
                  {moods[inspiration.mood].icon}
                  {moods[inspiration.mood].name}
                </div>
                {inspiration.isUserCreated && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                    <Star className="w-4 h-4" />
                  </div>
                )}
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

                {inspiration.author && (
                  <p className="text-right text-gray-500 font-medium">
                    — {inspiration.author}
                  </p>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">J'aime</span>
                  </button>

                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInspirations.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Aucune inspiration pour ce mood
            </h3>
            <p className="text-gray-600 mb-6">
              Soyez le premier à ajouter une inspiration pour l'humeur "
              {moods[selectedMood].name}" !
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              Créer la première inspiration
            </button>
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
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Donnez un titre à votre inspiration..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (optionnel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                  {uploadData.imagePreview ? (
                    <div className="relative">
                      <img
                        src={uploadData.imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() =>
                          setUploadData((prev) => ({
                            ...prev,
                            image: null,
                            imagePreview: "",
                          }))
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Cliquez pour ajouter une image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-600 transition-colors"
                      >
                        Choisir une image
                      </label>
                    </div>
                  )}
                </div>
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

              {/* Mood Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood associé
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(moods).map(([key, mood]) => (
                    <button
                      key={key}
                      onClick={() =>
                        setUploadData((prev) => ({ ...prev, mood: key }))
                      }
                      className={`p-3 rounded-xl transition-all ${
                        uploadData.mood === key
                          ? `bg-gradient-to-r ${mood.color} text-white`
                          : `${mood.bg} ${mood.text} hover:shadow-md`
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {mood.icon}
                        <span className="text-xs font-medium">{mood.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
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
