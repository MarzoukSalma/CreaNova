import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, X, Save, Loader } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import api from "../api/api.jsx";

const JournalCreativite = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");
  const [journalText, setJournalText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [userId] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.id;
    }
    return localStorage.getItem("userId") || null;
  });

  const moodOptions = [
    { value: "Joyeux", emoji: "😄", color: "from-yellow-400 to-orange-500" },
    { value: "Calme", emoji: "😌", color: "from-blue-400 to-blue-600" },
    { value: "Inspiré", emoji: "🌟", color: "from-purple-400 to-pink-500" },
    { value: "Réfléchi", emoji: "🤔", color: "from-gray-400 to-gray-600" },
    {
      value: "Nostalgique",
      emoji: "🌙",
      color: "from-indigo-400 to-purple-600",
    },
    { value: "Énergique", emoji: "⚡", color: "from-red-400 to-yellow-500" },
    { value: "Mélancolique", emoji: "🌧️", color: "from-gray-500 to-blue-500" },
    { value: "Créatif", emoji: "🎨", color: "from-pink-400 to-purple-500" },
  ];

  const loadJournals = async () => {
    if (!userId) {
      console.error("Aucun ID utilisateur trouvé");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/journals/${userId}`);
      const journalsData =
        response.data?.journals || response.data || response || [];
      setJournals(Array.isArray(journalsData) ? journalsData : []);
    } catch (error) {
      console.error("Erreur lors du chargement des journaux:", error);
      alert("Impossible de charger vos journaux. Vérifiez votre connexion.");
      setJournals([]);
    } finally {
      setLoading(false);
    }
  };

  const createJournal = async (journalData) => {
    try {
      const response = await api.post("/journals", {
        ...journalData,
        userId: userId,
      });
      return response.data || response;
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      throw error;
    }
  };

  const updateJournal = async (id, journalData) => {
    try {
      const response = await api.put(`/journals/${id}`, journalData);
      return response.data || response;
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      throw error;
    }
  };

  const deleteJournalApi = async (id) => {
    try {
      await api.delete(`/journals/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (userId) {
      loadJournals();
    }
  }, [userId]);

  const getMoodEmoji = (mood) => {
    const moodOption = moodOptions.find((m) => m.value === mood);
    return moodOption ? moodOption.emoji : "😊";
  };

  const getMoodColor = (mood) => {
    const moodOption = moodOptions.find((m) => m.value === mood);
    return moodOption ? moodOption.color : "from-gray-400 to-gray-600";
  };

  const openModal = (editId = null) => {
    setCurrentEditId(editId);
    if (editId) {
      const journal = journals.find((j) => j.id === editId || j._id === editId);
      if (journal) {
        setSelectedMood(journal.mood);
        setJournalText(journal.texte || journal.text || "");
      }
    } else {
      setSelectedMood("");
      setJournalText("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEditId(null);
    setSelectedMood("");
    setJournalText("");
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!selectedMood || !journalText.trim()) {
      alert("Veuillez sélectionner une humeur et écrire quelque chose !");
      return;
    }

    if (!userId) {
      alert("Erreur: Utilisateur non identifié");
      return;
    }

    setSubmitting(true);

    const journalData = {
      mood: selectedMood,
      texte: journalText.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    try {
      if (currentEditId) {
        const updatedJournal = await updateJournal(currentEditId, journalData);
        setJournals((prev) =>
          prev.map((j) =>
            j.id === currentEditId || j._id === currentEditId
              ? { ...j, ...journalData, id: j.id || j._id }
              : j,
          ),
        );
        alert("Journal mis à jour avec succès !");
      } else {
        const newJournal = await createJournal(journalData);
        setJournals((prev) => [
          { ...newJournal, id: newJournal.id || newJournal._id },
          ...prev,
        ]);
        alert("Journal créé avec succès !");
      }
      closeModal();
    } catch (error) {
      alert(`Erreur: ${error.message || "Une erreur est survenue"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteJournal = async (id) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette entrée de journal ?",
      )
    ) {
      try {
        await deleteJournalApi(id);
        setJournals((prev) => prev.filter((j) => j.id !== id && j._id !== id));
        alert("Journal supprimé avec succès !");
      } catch (error) {
        alert(
          `Erreur lors de la suppression: ${error.message || "Une erreur est survenue"}`,
        );
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#080c1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 opacity-60">🔒</div>
          <h3 className="text-2xl font-semibold mb-2 text-white">
            Accès requis
          </h3>
          <p className="text-lg text-slate-400">
            Veuillez vous connecter pour accéder à votre journal
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c1a] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-slate-400">
            Chargement de vos journaux...
          </p>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[10px] uppercase tracking-[0.3em] mb-4">
            <span>📔</span>
            <span>Journal Créatif</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extralight text-white tracking-tight mb-2">
            Journal de{" "}
            <span className="font-serif italic text-violet-400">
              Créativité
            </span>
          </h1>
          <p className="text-slate-400 text-sm">
            Exprimez vos pensées, vos rêves et votre inspiration quotidienne
          </p>
        </motion.div>

        {/* Journals Grid */}
        {journals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 opacity-60">✨</div>
            <h3 className="text-2xl font-light mb-2 text-white">
              Votre journal vous attend
            </h3>
            <p className="text-slate-400">
              Commencez à écrire vos premières pensées créatives
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.map((journal, index) => (
              <motion.div
                key={journal.id || journal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="group relative bg-[#0a0e1a] border border-[#1e2540] rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-400"
              >
                {/* Top gradient line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getMoodColor(journal.mood)} rounded-t-2xl`}
                />

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${getMoodColor(journal.mood)} shadow-lg text-sm`}
                  >
                    <span className="text-lg">
                      {getMoodEmoji(journal.mood)}
                    </span>
                    <span>{journal.mood}</span>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openModal(journal.id || journal._id)}
                      className="p-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteJournal(journal.id || journal._id)}
                      className="p-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Journal Text */}
                <p className="text-slate-300 leading-relaxed mb-4 text-sm">
                  {journal.texte || journal.text}
                </p>

                {/* Date */}
                <div className="text-right text-slate-500 text-xs font-medium pt-4 border-t border-[#1e2540]">
                  {formatDate(journal.date || journal.createdAt)}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center z-50"
        >
          <Plus className="w-6 h-6" />
        </motion.button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0f1323] border border-[#1e2540] rounded-3xl p-8 w-full max-w-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extralight text-white">
                  {currentEditId ? "✏️ Modifier" : "✨ Nouvelle entrée"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-[#1a1f35] rounded-full transition-colors duration-200"
                  disabled={submitting}
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div>
                {/* Mood Selector */}
                <div className="mb-8">
                  <label className="block text-sm font-light text-slate-300 mb-4 uppercase tracking-wider">
                    Comment vous sentez-vous aujourd'hui ?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setSelectedMood(mood.value)}
                        disabled={submitting}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                          selectedMood === mood.value
                            ? `border-blue-500 bg-gradient-to-r ${mood.color} text-white transform scale-105 shadow-lg`
                            : "border-[#1e2540] bg-[#0a0e1a] hover:border-blue-500/50 text-slate-300"
                        } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="text-2xl mb-2">{mood.emoji}</div>
                        <div className="text-xs font-semibold uppercase tracking-wide">
                          {mood.value}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Area */}
                <div className="mb-8">
                  <label
                    htmlFor="journalText"
                    className="block text-sm font-light text-slate-300 mb-4 uppercase tracking-wider"
                  >
                    Écrivez vos pensées...
                  </label>
                  <textarea
                    id="journalText"
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Aujourd'hui j'ai ressenti... Mes idées créatives... Ce qui m'inspire..."
                    disabled={submitting}
                    className={`w-full h-48 p-6 bg-[#0a0e1a] border border-[#1e2540] rounded-2xl resize-none text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                      submitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{ lineHeight: "1.6" }}
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className={`px-8 py-3 bg-[#1a1f35] border border-[#1e2540] text-slate-300 font-medium rounded-xl hover:border-slate-600 transition-all duration-200 ${
                      submitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 ${
                      submitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        {currentEditId ? "Mise à jour..." : "Création..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Sauvegarder
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalCreativite;
