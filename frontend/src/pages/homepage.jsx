import React from 'react';
import { 
  Palette, BookOpen, Lightbulb, MessageCircle, 
  Settings, Timer, ArrowRight, Sparkles, Target,
  Camera, Music, PenTool, Brain, Heart, Star
} from 'lucide-react';
import { Navigate } from "react-router-dom";


const HomePage = ({ onNavigateToLogin }) => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Journal Créatif",
      description: "Capturez vos idées, réflexions et inspirations quotidiennes dans un espace personnel et sécurisé.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Studio Rêves Créatifs",
      description: "Transformez vos rêves en projets concrets avec des outils de planification et de suivi.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Galerie d'Inspiration",
      description: "Découvrez, sauvegardez et organisez des contenus inspirants pour alimenter votre créativité.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Muse IA",
      description: "Votre assistant créatif intelligent pour débloquer votre potentiel et trouver l'inspiration.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: "Espace de Travail",
      description: "Optimisez votre productivité avec des techniques Pomodoro et la gestion de tâches créatives.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Paramètres",
      description: "Personnalisez votre expérience et gérez vos préférences pour un environnement sur mesure.",
      color: "from-gray-500 to-slate-600",
    }
  ];

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-6">
              <Sparkles className="w-12 h-12 text-purple-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Créativité Studio
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Libérez votre potentiel créatif avec une plateforme complète qui combine journal personnel, 
              gestion de projets, inspiration et outils de productivité. Votre atelier créatif digital vous attend.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onNavigateToLogin}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                Commencer l'aventure
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={scrollToFeatures}
                className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-2xl hover:bg-purple-600 hover:text-white transition-all duration-300"
              >
                Découvrir les fonctionnalités
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="text-3xl font-bold text-gray-800">100%</span>
                </div>
                <p className="text-gray-600">Passion créative</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <Target className="w-6 h-6 text-green-500" />
                  <span className="text-3xl font-bold text-gray-800">6</span>
                </div>
                <p className="text-gray-600">Outils intégrés</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <span className="text-3xl font-bold text-gray-800">∞</span>
                </div>
                <p className="text-gray-600">Possibilités créatives</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Votre écosystème créatif complet
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Six espaces interconnectés pour nourrir, organiser et concrétiser vos idées créatives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <button
                  onClick={onNavigateToLogin}
                  className={`inline-flex items-center gap-2 text-transparent bg-gradient-to-r ${feature.color} bg-clip-text font-semibold hover:underline`}
                >
                  Explorer
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Pourquoi choisir Créativité Studio ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Intelligence créative</h3>
                  <p className="text-gray-600">Des outils pensés pour stimuler votre imagination et structurer vos idées.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Interface intuitive</h3>
                  <p className="text-gray-600">Une expérience utilisateur fluide qui ne fait pas obstacle à votre créativité.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Écosystème harmonieux</h3>
                  <p className="text-gray-600">Tous vos outils créatifs dans un seul endroit, parfaitement intégrés.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Palette className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Prêt à créer ?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Rejoignez une communauté de créateurs passionnés et donnez vie à vos idées.
                  </p>
                  <button
                    onClick={onNavigateToLogin}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Commencer maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h3 className="text-2xl font-bold">Créativité Studio</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Votre compagnon créatif pour transformer les idées en réalité
          </p>
          <button
            onClick={onNavigateToLogin}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300"
          >
            Démarrer votre parcours créatif
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;