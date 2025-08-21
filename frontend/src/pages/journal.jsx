import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import Navbar  from '../components/navbar'; 
const JournalCreativite = () => {
  const [journals, setJournals] = useState([
    {
      id: 1,
      mood: "Inspiré",
      texte: "Aujourd'hui, j'ai eu une révélation en regardant le coucher de soleil. Les couleurs m'ont donné envie de peindre quelque chose de vibrant et plein de vie. Je pense à une série de toiles qui captureront l'essence de ces moments magiques où la nature nous offre ses plus beaux spectacles.",
      date: "2025-01-20"
    },
    {
      id: 2,
      mood: "Réfléchi",
      texte: "Il y a quelque chose de profondément apaisant dans l'acte d'écrire. Mes doigts dansent sur le clavier et mes pensées prennent forme. Je réfléchis à mon parcours créatif et à tous les projets qui m'attendent. Parfois, il faut savoir ralentir pour mieux avancer.",
      date: "2025-01-18"
    },
    {
      id: 3,
      mood: "Joyeux",
      texte: "Quelle journée fantastique ! J'ai terminé ma première sculpture en argile et le résultat dépasse mes attentes. L'art a cette capacité incroyable de transformer nos émotions en quelque chose de tangible et de beau. Je me sens accompli et prêt pour de nouveaux défis créatifs !",
      date: "2025-01-15"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [journalText, setJournalText] = useState('');

  const moodOptions = [
    { value: "Joyeux", emoji: "😄", color: "from-yellow-400 to-orange-500" },
    { value: "Calme", emoji: "😌", color: "from-blue-400 to-blue-600" },
    { value: "Inspiré", emoji: "🌟", color: "from-purple-400 to-pink-500" },
    { value: "Réfléchi", emoji: "🤔", color: "from-gray-400 to-gray-600" },
    { value: "Nostalgique", emoji: "🌙", color: "from-indigo-400 to-purple-600" },
    { value: "Énergique", emoji: "⚡", color: "from-red-400 to-yellow-500" },
    { value: "Mélancolique", emoji: "🌧️", color: "from-gray-500 to-blue-500" },
    { value: "Créatif", emoji: "🎨", color: "from-pink-400 to-purple-500" }
  ];

  const getMoodEmoji = (mood) => {
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption ? moodOption.emoji : "😊";
  };

  const getMoodColor = (mood) => {
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption ? moodOption.color : "from-gray-400 to-gray-600";
  };

  const openModal = (editId = null) => {
    setCurrentEditId(editId);
    if (editId) {
      const journal = journals.find(j => j.id === editId);
      setSelectedMood(journal.mood);
      setJournalText(journal.texte);
    } else {
      setSelectedMood('');
      setJournalText('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEditId(null);
    setSelectedMood('');
    setJournalText('');
  };

  const handleSubmit = () => {
    
    if (!selectedMood || !journalText.trim()) {
      alert('Veuillez sélectionner une humeur et écrire quelque chose !');
      return;
    }

    const journalData = {
      mood: selectedMood,
      texte: journalText.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    if (currentEditId) {
      setJournals(prev => prev.map(j => 
        j.id === currentEditId ? { ...j, ...journalData } : j
      ));
    } else {
      const newJournal = { ...journalData, id: Date.now() };
      setJournals(prev => [newJournal, ...prev]);
    }

    closeModal();
  };

  const deleteJournal = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée de journal ?')) {
      setJournals(prev => prev.filter(j => j.id !== id));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Animated particles component
  const Particles = () => {
    const particles = Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ));

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      
      {/* Animated Background Particles */}
      <Particles />
      
      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
      
     
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            📔 Journal de Créativité
          </h1>
          <p className="text-lg text-gray-600">
            Exprimez vos pensées, vos rêves et votre inspiration quotidienne
          </p>
        </div>
        

        {/* Journals Grid */}
        {journals.length === 0 ? (
          <div className="text-center text-white py-16">
            <div className="text-6xl mb-6 opacity-60">✨</div>
            <h3 className="text-2xl font-semibold mb-2">Votre journal vous attend</h3>
            <p className="text-lg opacity-80">Commencez à écrire vos premières pensées créatives</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.map((journal, index) => (
              <div
                key={journal.id}
                className="group relative bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white border-opacity-20 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
                style={{
                  animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                }}
              >
                {/* Top gradient line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getMoodColor(journal.mood)} rounded-t-2xl`} />
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${getMoodColor(journal.mood)} shadow-lg`}>
                    <span className="text-lg">{getMoodEmoji(journal.mood)}</span>
                    <span>{journal.mood}</span>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openModal(journal.id)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-110"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteJournal(journal.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Journal Text */}
                <p className="text-gray-800 leading-relaxed mb-4 text-sm">
                  {journal.texte}
                </p>

                {/* Date */}
                <div className="text-right text-gray-600 text-sm font-medium pt-4 border-t border-gray-200">
                  {formatDate(journal.date)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => openModal()}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full shadow-2xl hover:scale-110 hover:rotate-90 transition-all duration-300 flex items-center justify-center text-2xl z-50"
          style={{boxShadow: '0 8px 32px rgba(238, 90, 36, 0.4)'}}
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white border-opacity-20 transform transition-all duration-300 scale-100">
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  {currentEditId ? '✏️ Modifier votre journal' : '✨ Nouvelle entrée de journal'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div>
                {/* Mood Selector */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Comment vous sentez-vous aujourd'hui ?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setSelectedMood(mood.value)}
                        className={`p-4 rounded-xl border-3 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                          selectedMood === mood.value
                            ? `border-purple-500 bg-gradient-to-r ${mood.color} text-white transform scale-105 shadow-lg`
                            : 'border-gray-200 bg-white hover:border-purple-300'
                        }`}
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
                  <label htmlFor="journalText" className="block text-lg font-semibold text-gray-700 mb-4">
                    Écrivez vos pensées...
                  </label>
                  <textarea
                    id="journalText"
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Aujourd'hui j'ai ressenti... Mes idées créatives... Ce qui m'inspire..."
                    className="w-full h-48 p-6 border-2 border-gray-200 rounded-2xl resize-none focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-200 bg-white bg-opacity-80 backdrop-blur-sm"
                    style={{lineHeight: '1.6'}}
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 hover:scale-105 transition-all duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default JournalCreativite;