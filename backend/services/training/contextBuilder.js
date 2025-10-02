// services/llm/training/contextBuilder.js
const ragService = require('./ragService');

class ContextBuilder {
  buildSystemPromptWithContext(basePrompt, userMessage) {
    // Ajoute du contexte spécifique au prompt
    const dreamContext = ragService.getRelevantContext(userMessage, 'dreams');
    const journalContext = ragService.getRelevantContext(userMessage, 'journal');

    let enhancedPrompt = basePrompt;

    if (dreamContext.length > 0) {
      enhancedPrompt += '\n\nEXEMPLES DE RÊVES RÉUSSIS:\n';
      dreamContext.forEach((dream, index) => {
        enhancedPrompt += `${index + 1}. ${dream.description}\n`;
      });
    }

    if (journalContext.length > 0) {
      enhancedPrompt += '\n\nEXEMPLES DE JOURNAL:\n';
      journalContext.forEach((entry, index) => {
        enhancedPrompt += `${index + 1}. ${entry.content}\n`;
      });
    }

    return enhancedPrompt;
  }
}

module.exports = new ContextBuilder();