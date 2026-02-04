# backend/services/llm/llm_helper.py
from typing import List, Optional

class LLMHelper:
    def __init__(self, max_tokens: int = 1500):
        """
        Initialise le helper pour construire des prompts optimisés.
        
        Args:
            max_tokens: Limite approximative de tokens pour le prompt
        """
        self.max_tokens = max_tokens

    def build_prompt(self, question: str, chunks: List[str], memory: Optional[List[str]] = None) -> str:
        """
        Crée le prompt optimisé à envoyer au LLM.
        
        Args:
            question: La question de l'utilisateur
            chunks: Liste de passages récupérés depuis la base RAG
            memory: Contexte conversationnel précédent (optionnel)
            
        Returns:
            Le prompt formaté
        """
        prompt_parts = []

        # 1. Ajouter la mémoire conversationnelle si elle existe
        if memory and len(memory) > 0:
            prompt_parts.append("📝 Contexte de la conversation précédente:")
            for i, entry in enumerate(memory[-3:], 1):  # Garder seulement les 3 derniers
                prompt_parts.append(f"  {i}. {entry}")
            prompt_parts.append("")  # Ligne vide

        # 2. Ajouter les passages récupérés
        if chunks and len(chunks) > 0:
            prompt_parts.append("📚 Informations pertinentes extraites de la base de connaissances:")
            for i, chunk in enumerate(chunks, 1):
                # Nettoyer le chunk
                clean_chunk = chunk.strip()
                prompt_parts.append(f"\n[Document {i}]")
                prompt_parts.append(clean_chunk)
            prompt_parts.append("")  # Ligne vide
        
        # 3. Ajouter la question de l'utilisateur
        prompt_parts.append("❓ Question de l'utilisateur:")
        prompt_parts.append(question)
        prompt_parts.append("")  # Ligne vide
        
        # 4. Ajouter les instructions
        prompt_parts.append("📋 Instructions:")

        prompt_parts.append(
    "- Réponds de manière claire, naturelle et utile, avec une longueur moyenne (ni trop courte, ni trop longue)"
)
        prompt_parts.append(
    "- Si la question est une salutation (bonjour, salut, etc.), réponds de manière amicale et conversationnelle"
)
        prompt_parts.append("- Base-toi principalement sur les documents fournis")
        prompt_parts.append("- Si les documents ne contiennent pas l'information , réponds quand même de façon générale et bienveillante")
        prompt_parts.append("- Utilise un ton encourageant et motivant, humain")
        prompt_parts.append(
    "- Ne mentionne jamais l'existence de documents, de fichiers ou de base de connaissances"
)

        
        # Assembler le prompt
        prompt = "\n".join(prompt_parts)
        
        # Tronquer si trop long (approximation: 1 token ≈ 4 caractères)
        max_chars = self.max_tokens * 4
        if len(prompt) > max_chars:
            # Garder la question et les instructions, réduire les chunks
            prompt = prompt[:max_chars]
            prompt += "\n\n[... contexte tronqué pour respecter la limite de tokens ...]"
        
        return prompt

    def build_simple_prompt(self, question: str, context: str) -> str:
        """
        Crée un prompt simple sans formatage complexe.
        
        Args:
            question: La question
            context: Le contexte (texte brut)
            
        Returns:
            Le prompt simple
        """
        return f"""Contexte: {context}

Question: {question}

Réponds de manière claire et concise."""

    def estimate_tokens(self, text: str) -> int:
        """
        Estime le nombre de tokens dans un texte.
        Approximation: 1 token ≈ 4 caractères pour le français.
        
        Args:
            text: Le texte à estimer
            
        Returns:
            Nombre estimé de tokens
        """
        return len(text) // 4