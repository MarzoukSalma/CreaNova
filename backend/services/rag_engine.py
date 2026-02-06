# backend/services/rag_engine.py

from typing import Dict
from .retrieval import RetrievalService
from .llm.llmService import LLMService
from .llm.llmHelper import LLMHelper
from .memory import ConversationMemory


class RAGEngine:
    """
    Orchestrateur principal du système RAG.
    Gère :
    - conversation naturelle
    - génération créative
    - questions basées sur la connaissance (RAG)
    """

    def __init__(self, db_connection_string: str, groq_api_key: str):
        print("🔧 Initialisation du moteur RAG...\n")

        self.retrieval = RetrievalService(db_connection_string)
        self.llm = LLMService(api_key=groq_api_key)
        self.llm_helper = LLMHelper()
        self.memory = ConversationMemory(max_history=5)

        print("\n✅ Moteur RAG prêt !\n")

    # ============================================================
    # 🧠 INTENT DETECTION (LLM-BASED, SANS HARDCODE)
    # ============================================================
    def detect_intent(self, message: str) -> str:
        """
        Détecte l'intention utilisateur :
        - CONVERSATION
        - GENERATIVE
        - KNOWLEDGE
        """

        prompt = f"""
Tu es un routeur intelligent pour un assistant IA.

Classe le message utilisateur dans UNE SEULE catégorie :

1. CONVERSATION
   - salutations
   - remerciements
   - small talk
   - phrases sociales

2. GENERATIVE
   - demander des idées
   - demander des conseils
   - demander des suggestions
   - créativité / brainstorming

3. KNOWLEDGE
   - question factuelle
   - question nécessitant des informations issues de documents

Message utilisateur :
"{message}"

Réponds STRICTEMENT par un seul mot :
CONVERSATION, GENERATIVE ou KNOWLEDGE
"""

        response = self.llm.ask(prompt).strip().upper()

        if response not in ["CONVERSATION", "GENERATIVE", "KNOWLEDGE"]:
            # fallback de sécurité
            return "GENERATIVE"

        return response

    # ============================================================
    # 🎯 MÉTHODE PRINCIPALE
    # ============================================================
    def ask(self, question: str, use_memory: bool = True, top_k: int = 3) -> Dict:
        """
        Traite une question avec :
        - détection d'intention
        - réponse directe OU génération créative OU RAG
        """

        # 🟢 ÉTAPE 0 : Détection d'intention
        intent = self.detect_intent(question)
        print(f"🧭 Intention détectée : {intent}")

        # ========================================================
        # 🟣 CONVERSATION (salut, merci, small talk)
        # ========================================================
        if intent == "CONVERSATION":
            answer = self.llm.ask(
                f"Réponds de manière naturelle, amicale et concise à ce message : {question}"
            )

            if use_memory:
                self.memory.add_exchange(question, answer)

            return {
                "answer": answer,
                "sources": [],
                "chunks_used": 0,
                "chunks": []
            }

        # ========================================================
        # 🟡 GENERATIVE (idées, conseils, créativité)
        # ========================================================
        if intent == "GENERATIVE":
            answer = self.llm.ask(
                f"Réponds de manière créative, utile et structurée à la demande suivante : {question}"
            )

            if use_memory:
                self.memory.add_exchange(question, answer)

            return {
                "answer": answer,
                "sources": [],
                "chunks_used": 0,
                "chunks": []
            }

        # ========================================================
        # 🔵 KNOWLEDGE → PIPELINE RAG
        # ========================================================
        print("🔍 Recherche de chunks pertinents (RAG)...")

        chunks = self.retrieval.search(query=question, top_k=top_k)

        if not chunks:
            return {
                "answer": (
                    "Je n’ai pas trouvé d’information pertinente dans ma base de "
                    "connaissances pour répondre à cette question."
                ),
                "sources": [],
                "chunks_used": 0,
                "chunks": []
            }

        print(f"   ✓ {len(chunks)} chunks trouvés")

        chunk_contents = [c["content"] for c in chunks]

        context_memory = None
        if use_memory and not self.memory.is_empty():
            context_memory = self.memory.get_context()

        prompt = self.llm_helper.build_prompt(
            question=question,
            chunks=chunk_contents,
            memory=context_memory
        )

        print("🤖 Génération de la réponse avec RAG...")
        answer = self.llm.ask(prompt)

        if use_memory:
            self.memory.add_exchange(question, answer)

        return {
            "answer": answer,
            "sources": [
                {
                    "file": c["file"],
                    "similarity": round(c["similarity"] * 100, 1)
                }
                for c in chunks
            ],
            "chunks_used": len(chunks),
            "chunks": [
                {
                    "preview": c["content"][:150] + "..."
                    if len(c["content"]) > 150
                    else c["content"],
                    "similarity": round(c["similarity"] * 100, 1)
                }
                for c in chunks
            ]
        }

    # ============================================================
    # 🧹 UTILITAIRES
    # ============================================================
    def clear_memory(self):
        self.memory.clear()
        print("🧹 Mémoire conversationnelle effacée")

    def get_database_stats(self) -> Dict:
        return self.retrieval.get_statistics()

    def close(self):
        self.retrieval.close()
        print("👋 Connexions fermées")
