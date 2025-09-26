// services/llm/memoryManager.js
// Gère la mémoire de conversation pour chaque utilisateur

const userMemories = new Map();
const MAX_HISTORY = 10; // Garde les 10 derniers messages

class MemoryManager {
  getUserHistory(userId) {
    if (!userMemories.has(userId)) {
      userMemories.set(userId, []);
    }
    return userMemories.get(userId);
  }

  saveInteraction(userId, userMessage, aiResponse) {
    const history = this.getUserHistory(userId);
    
    history.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    );
    
    // Garder seulement les derniers messages
    if (history.length > MAX_HISTORY * 2) {
      userMemories.set(userId, history.slice(-MAX_HISTORY * 2));
    }
  }

  clearUserHistory(userId) {
    userMemories.delete(userId);
  }
}

module.exports = new MemoryManager();