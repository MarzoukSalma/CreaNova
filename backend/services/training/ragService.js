// services/llm/training/ragService.js
const fs = require('fs').promises;
const path = require('path');

class RAGService {
  constructor() {
    this.knowledgeBase = {};
    this.loadKnowledgeBase();
  }

  async loadKnowledgeBase() {
    try {
      // Charge tes données spécifiques
      const dreamsData = await fs.readFile(
        path.join(__dirname, '../data/dreams_examples.json'), 
        'utf-8'
      );
      const journalData = await fs.readFile(
        path.join(__dirname, '../data/journal_examples.json'), 
        'utf-8'
      );

      this.knowledgeBase = {
        dreams: JSON.parse(dreamsData),
        journal: JSON.parse(journalData)
      };

      console.log('✅ Base de connaissances chargée !');
    } catch (error) {
      console.log('ℹ️  Base de connaissances non trouvée, continuation sans...');
    }
  }

  getRelevantContext(userMessage, category) {
    const context = this.knowledgeBase[category] || [];
    
    // Ici tu pourrais ajouter une logique de recherche sémantique
    return context
      .filter(item => item.keywords.some(kw => 
        userMessage.toLowerCase().includes(kw.toLowerCase())
      ))
      .slice(0, 3); // Retourne les 3 meilleurs résultats
  }
}

module.exports = new RAGService();