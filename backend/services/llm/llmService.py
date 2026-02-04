# backend/services/llm/llm_service.py
import os
import requests
from typing import Optional

class LLMService:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialise le service LLM avec l'API Groq.
        
        Args:
            api_key: Clé API Groq (optionnel, utilise GROQ_API de .env par défaut)
        """
        self.api_key = api_key or os.getenv("GROQ_API", "")
        if not self.api_key:
            raise ValueError("⚠️ La clé API Groq n'est pas définie ! Ajoutez GROQ_API dans votre .env")

    def ask(self, prompt: str, model: str = "llama-3.3-70b-versatile", max_tokens: int = 1500) -> str:
        """
        Envoie une question au LLM et retourne la réponse.
        
        Args:
            prompt: Le prompt à envoyer
            model: Modèle Groq à utiliser
            max_tokens: Nombre maximum de tokens dans la réponse
            
        Returns:
            La réponse générée par le LLM
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": 0.7
        }

        try:
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            
            if data.get("choices"):
                return data["choices"][0]["message"]["content"]
            else:
                return "⚠️ Pas de réponse générée par le modèle."
                
        except requests.exceptions.HTTPError as e:
            try:
                err = response.json()
                error_msg = err.get("error", {}).get("message", response.text)
            except Exception:
                error_msg = response.text
            return f"⚠️ Erreur HTTP {response.status_code}: {error_msg}"
            
        except requests.exceptions.Timeout:
            return "⚠️ Délai d'attente dépassé (timeout). Le serveur Groq met trop de temps à répondre."
            
        except requests.exceptions.ConnectionError:
            return "⚠️ Erreur de connexion. Vérifiez votre connexion Internet."
            
        except Exception as e:
            return f"⚠️ Erreur inattendue lors de l'appel au LLM: {str(e)}"

    def ask_with_context(self, question: str, context: str, model: str = "llama-3.3-70b-versatile") -> str:
        """
        Envoie une question avec contexte au LLM.
        
        Args:
            question: La question de l'utilisateur
            context: Le contexte (chunks récupérés)
            model: Modèle à utiliser
            
        Returns:
            La réponse générée
        """
        prompt = f"""Contexte:
{context}

Question: {question}

Réponds de manière claire et concise en te basant sur le contexte fourni."""

        return self.ask(prompt, model=model)