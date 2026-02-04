# backend/services/rag_engine.py

from typing import Dict, Optional
from .retrieval import RetrievalService
from .llm.llmService import LLMService
from .llm.llmHelper import LLMHelper
from .memory import ConversationMemory

class RAGEngine:
    """
    Orchestrateur principal du système RAG.
    Coordonne la recherche, la mémoire et la génération de réponse.
    
    C'est le "cerveau" qui utilise tous les autres services.
    """
    
    def __init__(self, db_connection_string: str, groq_api_key: str):
        """
        Initialise le moteur RAG complet.
        
        Args:
            db_connection_string: Connexion PostgreSQL
            groq_api_key: Clé API Groq pour le LLM
        """
        print("🔧 Initialisation du moteur RAG...\n")
        
        # 1. Service de recherche vectorielle
        self.retrieval = RetrievalService(db_connection_string)
        
        # 2. Service LLM (Groq)
        self.llm = LLMService(api_key=groq_api_key)
        
        # 3. Helper pour construire les prompts
        self.llm_helper = LLMHelper()
        
        # 4. Mémoire conversationnelle
        self.memory = ConversationMemory(max_history=5)
        
        print("\n✅ Moteur RAG prêt !\n")

    
    
    def ask(self, question: str, use_memory: bool = True, top_k: int = 3) -> Dict:
        """
        Traite une question complète avec le système RAG.
        
        FLUX:
        1. Recherche des chunks pertinents dans la base
        2. Récupère l'historique de conversation (si activé)
        3. Construit un prompt optimisé
        4. Envoie au LLM pour génération
        5. Sauvegarde l'échange dans la mémoire
        
        Args:
            question: Question de l'utilisateur
            use_memory: Utiliser l'historique de conversation (par défaut True)
            top_k: Nombre de chunks à récupérer (par défaut 3)
            
        Returns:
            Dictionnaire contenant:
                - answer: La réponse générée
                - sources: Liste des sources utilisées avec similarité
                - chunks_used: Nombre de chunks utilisés
                - chunks: Aperçu des chunks (pour debug)
        """
        print(f"🔍 Recherche de chunks pertinents...")
        
        # ÉTAPE 1 : Recherche vectorielle
        chunks = self.retrieval.search(query=question, top_k=top_k)
        
        # Vérifier si des résultats ont été trouvés
        if not chunks:
            return {
                'answer': "Désolé, je n'ai pas trouvé d'information pertinente dans ma base de connaissances pour répondre à cette question. Pouvez-vous reformuler ou poser une autre question ?",
                'sources': [],
                'chunks_used': 0,
                'chunks': []
            }
        
        print(f"   ✓ {len(chunks)} chunks trouvés")
        
        # ÉTAPE 2 : Extraire le contenu des chunks
        chunk_contents = [c['content'] for c in chunks]
        
        # ÉTAPE 3 : Récupérer la mémoire (optionnel)
        context_memory = None
        if use_memory and not self.memory.is_empty():
            context_memory = self.memory.get_context()
            print(f"   ✓ Contexte de {self.memory.size()} échange(s) précédent(s) ajouté")
        
        # ÉTAPE 4 : Construire le prompt
        print(f"📝 Construction du prompt...")
        prompt = self.llm_helper.build_prompt(
            question=question,
            chunks=chunk_contents,
            memory=context_memory
        )
        
        # ÉTAPE 5 : Générer la réponse avec le LLM
        print(f"🤖 Génération de la réponse...")
        answer = self.llm.ask(prompt)
        
        # ÉTAPE 6 : Sauvegarder dans la mémoire
        if use_memory:
            self.memory.add_exchange(question, answer)
        
        # ÉTAPE 7 : Retourner les résultats complets
        return {
            'answer': answer,
            'sources': [
                {
                    'file': c['file'], 
                    'similarity': round(c['similarity'] * 100, 1)  # En pourcentage
                } 
                for c in chunks
            ],
            'chunks_used': len(chunks),
            'chunks': [
                {
                    'preview': c['content'][:150] + '...' if len(c['content']) > 150 else c['content'],
                    'similarity': round(c['similarity'] * 100, 1)
                }
                for c in chunks
            ]
        }
    
    def ask_without_rag(self, question: str) -> str:
        """
        Pose une question directement au LLM SANS utiliser la base RAG.
        Utile pour des questions générales.
        
        Args:
            question: Question de l'utilisateur
            
        Returns:
            Réponse du LLM
        """
        return self.llm.ask(question)
    
    def get_memory_summary(self) -> Dict:
        """
        Retourne un résumé de la mémoire conversationnelle.
        
        Returns:
            Dictionnaire avec les statistiques de la mémoire
        """
        return {
            'size': self.memory.size(),
            'max_history': self.memory.max_history,
            'is_empty': self.memory.is_empty(),
            'last_exchanges': self.memory.get_last_n(3)
        }
    
    def clear_memory(self):
        """Efface l'historique de conversation."""
        self.memory.clear()
        print("🧹 Mémoire conversationnelle effacée")
    
    def get_database_stats(self) -> Dict:
        """
        Retourne les statistiques de la base de données.
        
        Returns:
            Dictionnaire avec le nombre de documents et chunks
        """
        return self.retrieval.get_statistics()
    
    def close(self):
        """Ferme toutes les connexions."""
        self.retrieval.close()
        print("👋 Connexions fermées")


# Test du module
if __name__ == "__main__":
    print("=== TEST DU MOTEUR RAG COMPLET ===\n")
    
    # Initialisation
    engine = RAGEngine(
        db_connection_string="dbname=rag_chatbot_db user=postgres password=RAG_DB_PASSWORD",
        groq_api_key="votre_cle_api"  # Remplacez par votre vraie clé
    )
    
    # Stats
    stats = engine.get_database_stats()
    print(f"📊 Base: {stats['num_documents']} docs, {stats['num_chunks']} chunks\n")
    
    # Test 1
    print("=" * 60)
    result = engine.ask("Comment rester motivé ?")
    print(f"\n🤖 Réponse: {result['answer'][:200]}...")
    print(f"\n📚 Sources: {result['sources']}")
    
    # Test 2 (avec mémoire)
    print("\n" + "=" * 60)
    result = engine.ask("Donne-moi plus de détails")
    print(f"\n🤖 Réponse: {result['answer'][:200]}...")
    
    # Nettoyer
    engine.close()