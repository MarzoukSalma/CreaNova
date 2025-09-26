// services/llm/llmHelper.js
const llmService = require('./llmService');
const { systemPrompt, dreamPrompts, journalPrompts } = require('./prompts');
const memoryManager = require('./memoryManager');

class LLMHelper {
  async processMessage(userId, userMessage) {
    try {
      const history = memoryManager.getUserHistory(userId);
      
      const enhancedSystemPrompt = contextBuilder.buildSystemPromptWithContext(
        systemPrompt, 
        userMessage
      );

      const messages = [
        { role: 'system', content: enhancedSystemPrompt },
        ...history,
        { role: 'user', content: userMessage }
      ];

      console.log('🤖 Appel à Groq API...');
      const response = await llmService.generateResponse(messages);
      
      memoryManager.saveInteraction(userId, userMessage, response);
      
      const intent = this.analyzeIntent(userMessage);
      const suggestions = this.generateSuggestions(intent);
      
      return {
        response: response,
        intent: intent,
        suggestions: suggestions,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Erreur LLM:', error);
      
      // MESSAGE BEAUCOUP MIEUX POUR TON APP !
      const inspirationalMessages = [
        "✨ L'inspiration frappe à ta porte ! Veux-tu créer un rêve magique ou explorer ta galerie ?",
        "🌌 Le monde des rêves t'attend ! Dis-moi ce qui t'inspire aujourd'hui...",
        "🎭 La créativité ne connaît pas de limites ! Souhaites-tu commencer un journal ou un nouveau rêve ?",
        "💫 Je suis là pour nourrir ton imagination ! Raconte-moi tes envies créatives...",
        "🌈 Chaque instant est une source d'inspiration. Veux-tu documenter ton humeur ou créer quelque chose de nouveau ?"
      ];
      
      const randomMessage = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
      
      return {
        response: randomMessage,
        intent: 'general',
        suggestions: ['Créer un rêve', 'Écrire un journal', 'Voir la galerie', 'Explorer les tâches'],
        error: true
      };
    }
  }

  // ... (le reste du code reste pareil)
}

module.exports = new LLMHelper();