# backend/services/memory.py

from typing import List, Dict
from collections import deque

class ConversationMemory:
    """
    Gère l'historique des conversations.
    Permet au chatbot de se souvenir des échanges précédents.
    """
    
    def __init__(self, max_history: int = 5):
        """
        Initialise la mémoire conversationnelle.
        
        Args:
            max_history: Nombre maximum d'échanges à conserver (par défaut 5)
        """
        self.max_history = max_history
        self.history = deque(maxlen=max_history)  # Queue avec taille limitée
    
    def add_exchange(self, question: str, answer: str):
        """
        Ajoute un échange Q/A à l'historique.
        
        Args:
            question: Question posée par l'utilisateur
            answer: Réponse donnée par le chatbot
        """
        self.history.append({
            "question": question,
            "answer": answer
        })
    
    def get_context(self) -> List[str]:
        """
        Retourne l'historique formaté pour être ajouté au prompt.
        
        Returns:
            Liste de strings formatées "Q: ... R: ..."
        """
        return [
            f"Q: {entry['question']}\nR: {entry['answer']}"
            for entry in self.history
        ]
    
    def get_last_n(self, n: int) -> List[Dict]:
        """
        Récupère les n derniers échanges.
        
        Args:
            n: Nombre d'échanges à récupérer
            
        Returns:
            Liste des n derniers échanges sous forme de dictionnaires
        """
        history_list = list(self.history)
        return history_list[-n:] if len(history_list) > 0 else []
    
    def clear(self):
        """Efface complètement l'historique."""
        self.history.clear()
    
    def is_empty(self) -> bool:
        """Vérifie si l'historique est vide."""
        return len(self.history) == 0
    
    def size(self) -> int:
        """Retourne le nombre d'échanges dans l'historique."""
        return len(self.history)


# Test du module
if __name__ == "__main__":
    print("=== TEST DE LA MÉMOIRE CONVERSATIONNELLE ===\n")
    
    # Créer une mémoire
    memory = ConversationMemory(max_history=3)
    
    # Ajouter des échanges
    memory.add_exchange("Comment rester motivé ?", "Fixez-vous des objectifs SMART...")
    memory.add_exchange("C'est quoi SMART ?", "SMART signifie Spécifique, Mesurable...")
    memory.add_exchange("Merci !", "De rien, je suis là pour vous aider !")
    
    # Afficher le contexte
    print("📝 Contexte mémorisé:")
    for ctx in memory.get_context():
        print(f"  {ctx}\n")
    
    # Tester la limite
    memory.add_exchange("Autre question", "Autre réponse")
    print(f"Taille de la mémoire: {memory.size()} / {memory.max_history}")