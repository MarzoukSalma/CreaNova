# backend/services/llm/llm_service.py
import os
import requests

class LLMService:
    def __init__(self, api_key: str | None = None):
        # Utilise la clé passée ou celle définie dans l'environnement
        self.api_key = api_key or os.getenv("GROQ_API", "")
        if not self.api_key:
            raise ValueError("⚠️ La clé API Groq n'est pas définie !")

    def ask(self, prompt: str, model: str = "llama-3.3-70b-versatile") -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1500,
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
            return data["choices"][0]["message"]["content"] if data.get("choices") else "⚠️ Pas de réponse générée."
        except requests.exceptions.HTTPError as e:
            try:
                err = response.json()
            except Exception:
                err = response.text
            return f"⚠️ Erreur HTTP {response.status_code}: {err}"
        except requests.exceptions.Timeout:
            return "⚠️ Délai dépassé (timeout)."
        except Exception as e:
            return f"⚠️ Erreur lors de l'appel LLM: {e}"
