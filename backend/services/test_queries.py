import sys
import os
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import psycopg2

# -----------------------------
# Ajouter les dossiers au chemin Python
# -----------------------------
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "llm"))

# Import des helpers
from llm.llmService import LLMService
from llm.llmHelper import LLMHelper

# -----------------------------
# Connexion PostgreSQL
# -----------------------------
conn = psycopg2.connect("dbname=rag_chatbot_db user=postgres password=salma")
cursor = conn.cursor()

# -----------------------------
# Charger le modèle
# -----------------------------
model = SentenceTransformer('all-MiniLM-L6-v2')

# -----------------------------
# Liste de requêtes à tester
# -----------------------------
queries = [
    "Comment je peux réaliser mes rêves ?",
    "Quels sont les bienfaits de la méditation ?",
    "Comment gérer le stress au travail ?",
    "Comment améliorer ma concentration ?"
]

# -----------------------------
# Charger les embeddings + doc_id depuis la base
# -----------------------------
cursor.execute("SELECT id, document_id, embedding FROM embeddings")
rows = cursor.fetchall()

embedding_ids = [row[0] for row in rows]
doc_ids = [row[1] for row in rows]
embeddings = [np.array([float(x) for x in row[2]]) for row in rows]

# -----------------------------
# Instancier helper & LLM
# -----------------------------
llm_helper = LLMHelper(max_tokens=1500)
llm_service = LLMService()

# -----------------------------
# Boucle sur chaque requête
# -----------------------------
for query in queries:
    print(f"🔹 Question : {query}")
    query_embedding = model.encode([query])[0]

    # Similarité cosinus
    similarities = cosine_similarity([query_embedding], embeddings)[0]

    # Trier les documents par score décroissant
    top_k = 3  # nombre de chunks/documents à utiliser
    best_indices = similarities.argsort()[-top_k:][::-1]

    # Récupérer les contenus des meilleurs documents
    retrieved_chunks = []
    for idx in best_indices:
        best_doc_id = doc_ids[idx]
        similarity_score = similarities[idx]
        cursor.execute("SELECT title, content FROM documents WHERE id = %s", (best_doc_id,))
        result = cursor.fetchone()
        if result:
            retrieved_chunks.append(result[1][:300])  # on prend un extrait
            print(f"✅ Match (score={similarity_score:.4f}) - {result[0]}")

    # Construire le prompt
    prompt = llm_helper.build_prompt(query, retrieved_chunks)
    print("\n--- Prompt généré ---\n")
    print(prompt)

    # Envoyer au LLM
    try:
        response = llm_service.ask(prompt)
        print("\n--- Réponse LLM ---\n")
        print(response)
    except Exception as e:
        print(f"⚠️ Erreur avec le LLMService : {e}")

    print("\n============================\n")

cursor.close()
conn.close()
