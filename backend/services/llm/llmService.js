// services/llm/llmService.js
require('dotenv').config();
const Groq = require('groq-sdk');

class LLMService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY2,
    });
    this.model = process.env.MODEL_NAME || "llama3-70b-8192";
  }

  async generateResponse(messages, temperature = 0.7) {
    try {
      const completion = await this.groq.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: temperature,
        max_tokens: 1024,
        stream: false,
      });

      return completion.choices[0]?.message?.content ||  "✨ L'inspiration est en pause, réessaye dans un moment !";
    } catch (error) {
      console.error('Erreur Groq API:', error);
      throw new Error('Problème de connexion à l\'inspiration...');
    }
  }
}

module.exports = new LLMService();