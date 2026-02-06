import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Heart,
  Lightbulb,
  Plus,
  History,
  Trash2,
  MessageSquare,
  Bot,
  User,
  Star,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";

const MuseCreativeChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [useMemory, setUseMemory] = useState(true);
  const [responseMode, setResponseMode] = useState("creative"); // creative | precise
  const [responseLength, setResponseLength] = useState("medium"); // short | medium | long
  const [showMemoryStats, setShowMemoryStats] = useState(false);
  const [memoryStats, setMemoryStats] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
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
    loadConversations();
    startNewConversation();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Charger toutes les conversations depuis le localStorage
  const loadConversations = () => {
    const saved = localStorage.getItem("museConversations");
    if (saved) {
      setConversations(JSON.parse(saved));
    }
  };

  // Sauvegarder les conversations dans le localStorage
  const saveConversations = (convs) => {
    localStorage.setItem("museConversations", JSON.stringify(convs));
    setConversations(convs);
  };

  // Démarrer une nouvelle conversation
  const startNewConversation = async () => {
    // Clear memory on backend
    try {
      await api.post("/rag/clear-memory");
    } catch (error) {
      console.error("Erreur lors du nettoyage de la mémoire:", error);
    }

    const welcomeMessage = {
      id: Date.now(),
      text: "Bonjour créateur ! ✨ Je suis Muse, votre compagnon créatif personnel. Je suis là pour vous inspirer, vous motiver et vous accompagner dans vos projets artistiques. Que puis-je faire pour stimuler votre créativité aujourd'hui ?",
      sender: "bot",
      timestamp: new Date(),
    };

    const newConversationId = Date.now();
    setCurrentConversationId(newConversationId);
    setMessages([welcomeMessage]);

    // Sauvegarder la nouvelle conversation
    const newConversation = {
      id: newConversationId,
      title: "Nouvelle conversation",
      messages: [welcomeMessage],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
  };

  // Charger une conversation existante
  const loadConversation = (conversation) => {
    setCurrentConversationId(conversation.id);
    setMessages(conversation.messages);
  };

  // Supprimer une conversation
  const deleteConversation = (conversationId, e) => {
    // Empêcher la propagation de l'événement
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const updatedConversations = conversations.filter(
      (conv) => conv.id !== conversationId,
    );
    saveConversations(updatedConversations);

    // Si on supprime la conversation active, créer une nouvelle
    if (conversationId === currentConversationId) {
      startNewConversation();
    }
  };

  // Mettre à jour la conversation actuelle
  const updateCurrentConversation = (newMessages) => {
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === currentConversationId) {
        // Générer un titre basé sur le premier message utilisateur
        const firstUserMessage = newMessages.find(
          (msg) => msg.sender === "user",
        );
        const title = firstUserMessage
          ? firstUserMessage.text.substring(0, 30) + "..."
          : "Nouvelle conversation";

        return {
          ...conv,
          messages: newMessages,
          title: title,
          updatedAt: new Date().toISOString(),
        };
      }
      return conv;
    });
    saveConversations(updatedConversations);
  };

  // Effacer la mémoire
  const clearMemory = async () => {
    try {
      await api.post("/rag/clear-memory");
      alert("✨ Mémoire effacée avec succès !");
    } catch (error) {
      console.error("Erreur lors du nettoyage de la mémoire:", error);
      alert("❌ Erreur lors du nettoyage de la mémoire");
    }
  };

  // Charger les stats de mémoire
  const loadMemoryStats = async () => {
    try {
      const response = await api.get("/rag/stats");
      setMemoryStats(response.data.memory);
      setShowMemoryStats(true);
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
      alert("❌ Erreur lors du chargement des statistiques");
    }
  };

  // Copier dans le presse-papier
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("📋 Copié dans le presse-papier !");
  };

  // Get appropriate response from API or fallback
  const getMuseResponse = async (userMessage) => {
    try {
      const response = await api.post("/rag/ask", {
        question: userMessage,
        use_memory: useMemory,
        mode: responseMode,
        length: responseLength,
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

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
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

      const finalMessages = [...newMessages, botResponse];
      setMessages(finalMessages);
      updateCurrentConversation(finalMessages);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      // En cas d'erreur, ajouter un message d'erreur
      const errorResponse = {
        id: Date.now() + 1,
        text: "Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?",
        sender: "bot",
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, errorResponse];
      setMessages(finalMessages);
      updateCurrentConversation(finalMessages);
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

      <div className="relative z-10 min-h-screen">
        {/* Sidebar gauche avec animation slide - Verticalement centrée */}
        <AnimatePresence>
          {showSidebar && (
            <>
              {/* Overlay de fond */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setShowSidebar(false)}
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed left-0 top-0 z-50 w-80 h-screen flex items-center"
              >
                <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-r-3xl shadow-2xl shadow-black/50 overflow-hidden w-full">
                  <div className="p-4 flex flex-col gap-3 max-h-[85vh] overflow-hidden">
                    {/* Header sidebar */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#1e2540]">
                      <h3 className="text-white font-medium text-base flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Muse Créative
                      </h3>
                      <button
                        onClick={() => setShowSidebar(false)}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-[#1e2540] rounded-lg"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Nouvelle conversation */}
                    <button
                      onClick={() => {
                        startNewConversation();
                        setShowSidebar(false);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      Nouvelle conversation
                    </button>

                    {/* Historique des conversations */}
                    <div className="flex-1 overflow-y-auto">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Historique
                      </h4>

                      {conversations.length === 0 ? (
                        <p className="text-slate-500 text-xs text-center py-8 px-4">
                          Aucune conversation pour le moment
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {conversations.map((conv) => (
                            <div
                              key={conv.id}
                              className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                                conv.id === currentConversationId
                                  ? "bg-purple-500/20 border border-purple-500/40"
                                  : "bg-[#0f1323] border border-[#1e2540] hover:border-purple-500/30 hover:bg-[#13172b]"
                              }`}
                              onClick={() => {
                                loadConversation(conv);
                                setShowSidebar(false);
                              }}
                            >
                              <div className="flex-1 min-w-0 flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-white font-medium truncate mb-1">
                                    {conv.title}
                                  </p>
                                  <p className="text-[10px] text-slate-500">
                                    {new Date(
                                      conv.updatedAt,
                                    ).toLocaleDateString("fr-FR", {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  deleteConversation(conv.id, e);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all ml-2 p-1.5 hover:bg-red-500/10 rounded-lg flex-shrink-0"
                                type="button"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bouton toggle sidebar - Verticalement centré */}
        <motion.button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 bg-[#0f1323] border border-[#1e2540] text-slate-300 p-3 rounded-full hover:border-purple-500/30 hover:bg-[#13172b] transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight
            className={`w-5 h-5 transition-transform duration-300 ${
              showSidebar ? "rotate-180" : ""
            }`}
          />
        </motion.button>

        {/* Contenu principal */}
        <div className="flex-1 p-4 py-8 max-w-3xl mx-auto w-full relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-extralight text-white tracking-tight mb-2">
              Muse{" "}
              <span className="font-serif italic text-violet-400">
                Créative
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Votre compagnon créatif pour l'inspiration quotidienne
            </p>
          </motion.div>

          {/* Memory Stats Modal */}
          <AnimatePresence>
            {showMemoryStats && memoryStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      État de la mémoire
                    </h3>
                    <button
                      onClick={() => setShowMemoryStats(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p>
                      📊 Messages en mémoire:{" "}
                      <span className="text-white font-semibold">
                        {memoryStats.message_count || 0}
                      </span>
                    </p>
                    <p>
                      🧠 Tokens utilisés:{" "}
                      <span className="text-white font-semibold">
                        {memoryStats.total_tokens || 0}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#0a0e1a] border border-[#1e2540] rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-4 text-white relative">
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-light">Muse Créative</h2>
                  <p className="text-blue-100 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    En ligne • Prête à inspirer
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#0a0e1a] to-[#080c1a]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 max-w-xs">
                    <div
                      className={`px-3 py-2 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-[#0f1323] border border-[#1e2540] text-slate-200"
                      }`}
                    >
                      <p className="text-xs leading-relaxed">{message.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${
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

                    {/* Action buttons sur les messages bot */}
                    {message.sender === "bot" && (
                      <div className="flex gap-1 ml-1">
                        <button
                          onClick={() => copyToClipboard(message.text)}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copier"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          className="text-slate-500 hover:text-green-400 transition-colors"
                          title="J'aime"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          className="text-slate-500 hover:text-red-400 transition-colors"
                          title="Je n'aime pas"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {message.sender === "user" && (
                    <div className="w-7 h-7 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-[#0f1323] border border-[#1e2540] px-3 py-2 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-t border-[#1e2540] bg-[#0a0e1a]">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setInputValue(
                      "J'ai besoin d'inspiration pour un nouveau projet",
                    )
                  }
                  className="px-2.5 py-1.5 text-[10px] bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-full hover:bg-violet-500/20 transition-colors flex items-center gap-1"
                >
                  <Lightbulb className="w-3 h-3" />
                  Inspiration
                </button>
                <button
                  onClick={() =>
                    setInputValue("Je me sens découragé dans ma créativité")
                  }
                  className="px-2.5 py-1.5 text-[10px] bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-full hover:bg-pink-500/20 transition-colors flex items-center gap-1"
                >
                  <Heart className="w-3 h-3" />
                  Motivation
                </button>
                <button
                  onClick={() =>
                    setInputValue(
                      "Quelles techniques créatives recommandes-tu ?",
                    )
                  }
                  className="px-2.5 py-1.5 text-[10px] bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                >
                  <Star className="w-3 h-3" />
                  Techniques
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#1e2540] bg-[#0a0e1a]">
              <div className="flex gap-2">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Partagez vos idées créatives avec moi..."
                    className="w-full px-3 py-2 bg-[#0f1323] border border-[#1e2540] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-xs transition-all"
                    rows="2"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-violet-600 text-white p-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer Info */}
          <div className="text-center mt-6">
            <p className="text-slate-600 text-[10px] tracking-widest uppercase">
              🎨 Muse Créative • Votre Compagnon Artistique
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseCreativeChatbot;
