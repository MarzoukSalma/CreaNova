import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Heart,
  Smile,
  Coffee,
  Star,
  Moon,
  Sun,
  Bot,
  User,
  Lightbulb,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/api";

const MuseCreativeChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Predefined responses for the creative muse (fallback si l'API échoue)
  const museResponses = {
    greetings: [
      "Bonjour créateur ! ✨ Je suis votre Muse Créative. Comment puis-je nourrir votre inspiration aujourd'hui ?",
      "Salut artiste ! 🎨 Prêt à explorer de nouveaux horizons créatifs ?",
      "Hello ! 🌟 Votre muse personnelle est là pour vous accompagner dans votre voyage créatif !",
    ],
    creativity: [
      "💡 Voici une idée : Et si vous mélangez deux de vos passions complètement différentes ? Les meilleures créations naissent souvent de ces mariages inattendus !",
      "🎨 Essayez la technique du 'Et si...' : Et si votre personnage principal était... Et si l'histoire se passait dans... Laissez votre imagination vagabonder !",
      "✨ Inspiration du jour : Regardez autour de vous et trouvez 3 objets. Maintenant, créez une histoire qui les relie tous les trois de façon magique !",
    ],
    motivation: [
      "🌟 Rappelez-vous : chaque grand artiste a commencé par un premier trait, une première note, un premier mot. Votre création d'aujourd'hui compte !",
      "💪 Vous avez en vous une étincelle unique que personne d'autre ne possède. C'est le moment de la laisser briller !",
      "🚀 L'art n'a pas besoin d'être parfait pour être beau. Votre authenticité est votre plus grande force !",
    ],
    techniques: [
      "🖼️ Technique du jour : Essayez la règle des tiers en photographie ou en peinture. Divisez votre espace en 9 parties égales et placez vos éléments importants sur les lignes de force !",
      "🎭 Pour l'écriture : Écrivez pendant 10 minutes sans vous arrêter, sans corriger. Laissez les mots couler librement, vous serez surpris du résultat !",
      "🎵 En musique : Explorez une gamme que vous ne connaissez pas. Chaque note a une émotion à révéler !",
    ],
  };

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Bonjour créateur ! ✨ Je suis Muse, votre compagnon créatif personnel. Je suis là pour vous inspirer, vous motiver et vous accompagner dans vos projets artistiques. Que puis-je faire pour stimuler votre créativité aujourd'hui ?",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get appropriate response from API or fallback
  const getMuseResponse = async (userMessage) => {
    try {
      const response = await api.post("/rag/ask", {
        question: userMessage,
        use_memory: true,
      });

      if (response.data?.success) {
        return response.data.answer;
      }

      return getFallbackResponse(userMessage);
    } catch (error) {
      console.error("Erreur RAG:", error);
      return getFallbackResponse(userMessage);
    }
  };

  // Fallback responses si l'API échoue
  const getFallbackResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("bonjour") ||
      lowerMessage.includes("salut") ||
      lowerMessage.includes("hello")
    ) {
      return museResponses.greetings[
        Math.floor(Math.random() * museResponses.greetings.length)
      ];
    } else if (
      lowerMessage.includes("idée") ||
      lowerMessage.includes("créativité") ||
      lowerMessage.includes("inspiration")
    ) {
      return museResponses.creativity[
        Math.floor(Math.random() * museResponses.creativity.length)
      ];
    } else if (
      lowerMessage.includes("motivation") ||
      lowerMessage.includes("découragé") ||
      lowerMessage.includes("difficile")
    ) {
      return museResponses.motivation[
        Math.floor(Math.random() * museResponses.motivation.length)
      ];
    } else if (
      lowerMessage.includes("technique") ||
      lowerMessage.includes("comment") ||
      lowerMessage.includes("conseil")
    ) {
      return museResponses.techniques[
        Math.floor(Math.random() * museResponses.techniques.length)
      ];
    } else {
      // Default creative responses
      const defaultResponses = [
        "🎨 Intéressant ! Avez-vous pensé à explorer cette idée sous un angle différent ? Parfois, changer de perspective révèle des merveilles cachées.",
        "✨ Votre question m'inspire ! Et si on transformait cette réflexion en projet créatif ? Quel medium vous attire le plus en ce moment ?",
        "💫 J'adore votre curiosité ! C'est exactement cette soif de découverte qui nourrit les plus belles créations. Continuez à questionner le monde !",
        "🌟 Votre message éveille ma créativité ! Voulez-vous que nous explorions ensemble de nouvelles pistes artistiques ?",
        "🎭 Fascinant ! Chaque idée est une graine qui peut germer en œuvre magnifique. Comment souhaitez-vous cultiver celle-ci ?",
      ];
      return defaultResponses[
        Math.floor(Math.random() * defaultResponses.length)
      ];
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get response from API
      const responseText = await getMuseResponse(inputValue);

      const botResponse = {
        id: Date.now() + 1,
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      // En cas d'erreur, ajouter un message d'erreur
      const errorResponse = {
        id: Date.now() + 1,
        text: "Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[10px] uppercase tracking-[0.3em] mb-4">
            <Sparkles size={14} className="animate-pulse" />
            <span>Assistant Créatif</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extralight text-white tracking-tight mb-2">
            Muse{" "}
            <span className="font-serif italic text-violet-400">Créative</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Votre compagnon créatif pour l'inspiration quotidienne
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white relative">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-light">Muse Créative</h2>
                <p className="text-blue-100 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  En ligne • Prête à inspirer
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#0a0e1a] to-[#080c1a]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-[#0f1323] border border-[#1e2540] text-slate-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-slate-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#0f1323] border border-[#1e2540] px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-t border-[#1e2540] bg-[#0a0e1a]">
            <div className="flex flex-wrap gap-2 mb-0">
              <button
                onClick={() =>
                  setInputValue(
                    "J'ai besoin d'inspiration pour un nouveau projet",
                  )
                }
                className="px-3 py-2 text-xs bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-full hover:bg-violet-500/20 transition-colors flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3" />
                Inspiration
              </button>
              <button
                onClick={() =>
                  setInputValue("Je me sens découragé dans ma créativité")
                }
                className="px-3 py-2 text-xs bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-full hover:bg-pink-500/20 transition-colors flex items-center gap-1"
              >
                <Heart className="w-3 h-3" />
                Motivation
              </button>
              <button
                onClick={() =>
                  setInputValue("Quelles techniques créatives recommandes-tu ?")
                }
                className="px-3 py-2 text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full hover:bg-blue-500/20 transition-colors flex items-center gap-1"
              >
                <Star className="w-3 h-3" />
                Techniques
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-[#1e2540] bg-[#0a0e1a]">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Partagez vos idées créatives avec moi..."
                  className="w-full px-4 py-3 bg-[#0f1323] border border-[#1e2540] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-sm transition-all"
                  rows="2"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-slate-600 text-xs tracking-widest uppercase">
            🎨 Muse Créative • Votre Compagnon Artistique
          </p>
        </div>
      </div>
    </div>
  );
};

export default MuseCreativeChatbot;
