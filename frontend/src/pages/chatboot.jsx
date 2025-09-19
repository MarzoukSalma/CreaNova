import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Heart, Smile, Coffee, Star, Moon, Sun, Bot, User, Lightbulb } from 'lucide-react';
import api from "../api/api";

const MuseCreativeChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Predefined responses for the creative muse (fallback si l'API échoue)
  const museResponses = {
    greetings: [
      "Bonjour créateur ! ✨ Je suis votre Muse Créative. Comment puis-je nourrir votre inspiration aujourd'hui ?",
      "Salut artiste ! 🎨 Prêt à explorer de nouveaux horizons créatifs ?",
      "Hello ! 🌟 Votre muse personnelle est là pour vous accompagner dans votre voyage créatif !"
    ],
    creativity: [
      "💡 Voici une idée : Et si vous mélangez deux de vos passions complètement différentes ? Les meilleures créations naissent souvent de ces mariages inattendus !",
      "🎨 Essayez la technique du 'Et si...' : Et si votre personnage principal était... Et si l'histoire se passait dans... Laissez votre imagination vagabonder !",
      "✨ Inspiration du jour : Regardez autour de vous et trouvez 3 objets. Maintenant, créez une histoire qui les relie tous les trois de façon magique !"
    ],
    motivation: [
      "🌟 Rappelez-vous : chaque grand artiste a commencé par un premier trait, une première note, un premier mot. Votre création d'aujourd'hui compte !",
      "💪 Vous avez en vous une étincelle unique que personne d'autre ne possède. C'est le moment de la laisser briller !",
      "🚀 L'art n'a pas besoin d'être parfait pour être beau. Votre authenticité est votre plus grande force !"
    ],
    techniques: [
      "🖼️ Technique du jour : Essayez la règle des tiers en photographie ou en peinture. Divisez votre espace en 9 parties égales et placez vos éléments importants sur les lignes de force !",
      "🎭 Pour l'écriture : Écrivez pendant 10 minutes sans vous arrêter, sans corriger. Laissez les mots couler librement, vous serez surpris du résultat !",
      "🎵 En musique : Explorez une gamme que vous ne connaissez pas. Chaque note a une émotion à révéler !"
    ]
  };

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Bonjour créateur ! ✨ Je suis Muse, votre compagnon créatif personnel. Je suis là pour vous inspirer, vous motiver et vous accompagner dans vos projets artistiques. Que puis-je faire pour stimuler votre créativité aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get appropriate response from API or fallback
  const getMuseResponse = async (userMessage) => {
    try {
      // Appel à l'API LLM
      const response = await api.post('llm/chat', {
        message: userMessage,
        userId: localStorage.getItem('userId') || '1', // Assurez-vous d'avoir un userId
      });
      
      // Retourner la réponse de l'API
      return response.data.message || getFallbackResponse(userMessage);
    } catch (error) {
      console.error("Erreur API:", error);
      // En cas d'erreur, utiliser les réponses prédéfinies
      return getFallbackResponse(userMessage);
    }
  };

  // Fallback responses si l'API échoue
  const getFallbackResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return museResponses.greetings[Math.floor(Math.random() * museResponses.greetings.length)];
    } else if (lowerMessage.includes('idée') || lowerMessage.includes('créativité') || lowerMessage.includes('inspiration')) {
      return museResponses.creativity[Math.floor(Math.random() * museResponses.creativity.length)];
    } else if (lowerMessage.includes('motivation') || lowerMessage.includes('découragé') || lowerMessage.includes('difficile')) {
      return museResponses.motivation[Math.floor(Math.random() * museResponses.motivation.length)];
    } else if (lowerMessage.includes('technique') || lowerMessage.includes('comment') || lowerMessage.includes('conseil')) {
      return museResponses.techniques[Math.floor(Math.random() * museResponses.techniques.length)];
    } else {
      // Default creative responses
      const defaultResponses = [
        "🎨 Intéressant ! Avez-vous pensé à explorer cette idée sous un angle différent ? Parfois, changer de perspective révèle des merveilles cachées.",
        "✨ Votre question m'inspire ! Et si on transformait cette réflexion en projet créatif ? Quel medium vous attire le plus en ce moment ?",
        "💫 J'adore votre curiosité ! C'est exactement cette soif de découverte qui nourrit les plus belles créations. Continuez à questionner le monde !",
        "🌟 Votre message éveille ma créativité ! Voulez-vous que nous explorions ensemble de nouvelles pistes artistiques ?",
        "🎭 Fascinant ! Chaque idée est une graine qui peut germer en œuvre magnifique. Comment souhaitez-vous cultiver celle-ci ?"
      ];
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get response from API
      const responseText = await getMuseResponse(inputValue);
      
      const botResponse = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      // En cas d'erreur, ajouter un message d'erreur
      const errorResponse = {
        id: Date.now() + 1,
        text: "Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ✨ Muse Créative
          </h1>
          <p className="text-lg text-gray-600">Votre compagnon créatif pour l'inspiration quotidienne</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Muse Créative</h2>
                <p className="text-purple-100">En ligne • Prête à inspirer</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setInputValue("J'ai besoin d'inspiration pour un nouveau projet")}
                className="px-3 py-2 text-xs bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3" />
                Inspiration
              </button>
              <button
                onClick={() => setInputValue("Je me sens découragé dans ma créativité")}
                className="px-3 py-2 text-xs bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors flex items-center gap-1"
              >
                <Heart className="w-3 h-3" />
                Motivation
              </button>
              <button
                onClick={() => setInputValue("Quelles techniques créatives recommandes-tu ?")}
                className="px-3 py-2 text-xs bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors flex items-center gap-1"
              >
                <Star className="w-3 h-3" />
                Techniques
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex gap-4">
              <div className="flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Partagez vos idées créatives avec moi..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="2"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            🎨 Muse Créative est là pour vous accompagner dans votre parcours artistique
          </p>
        </div>
      </div>
    </div>
  );
};

export default MuseCreativeChatbot;