# backend/services/llm/llm_helper.py
class LLMHelper:
    def __init__(self, max_tokens=1500):
        self.max_tokens = max_tokens  # Limite de tokens pour le prompt

    def build_prompt(self, question, chunks, memory=None):
        """
        Crée le prompt à envoyer au LLM.
        - question : la question de l'utilisateur
        - chunks : liste de passages récupérés
        - memory : contexte conversationnel (optionnel)
        """
        prompt = ""

        # Ajouter la mémoire si elle existe
        if memory:
            prompt += "Contexte précédent:\n"
            for entry in memory:
                prompt += f"- {entry}\n"
            prompt += "\n"

        # Ajouter les passages récupérés
        prompt += "Voici des informations extraites de documents :\n"
        for i, chunk in enumerate(chunks):
            prompt += f"{i+1}. {chunk}\n"

        # Ajouter la question de l'utilisateur
        prompt += f"\nQuestion : {question}\n"
        prompt += "Réponds de manière claire et concise."

        # Tronquer si trop long
        if len(prompt) > self.max_tokens:
            prompt = prompt[:self.max_tokens]

        return prompt
