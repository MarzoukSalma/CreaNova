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


def get_answer(query):
    """
    Fonction qui reçoit une question (query)
    et renvoie la réponse générée par le modèle RAG.
    """

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
    # Charger les embeddings + doc_id depuis la base
    # -----------------------------
    cursor.execute("SELECT id, document_id, embedding FROM embeddings")
    rows = cursor.fetchall()

    doc_ids = [row[1] for row in rows]
    embeddings = [np.array([float(x) for x in row[2]]) for row in rows]

    # -----------------------------
    # Trouver les documents similaires
    # -----------------------------
    query_embedding = model.encode([query])[0]
    similarities = cosine_similarity([query_embedding], embeddings)[0]
    top_k = 3
    best_indices = similarities.argsort()[-top_k:][::-1]

    # -----------------------------
    # Récupérer le contenu des meilleurs documents
    # -----------------------------
    retrieved_chunks = []
    for idx in best_indices:
        best_doc_id = doc_ids[idx]
        similarity_score = similarities[idx]
        cursor.execute("SELECT title, content FROM documents WHERE id = %s", (best_doc_id,))
        result = cursor.fetchone()
        if result:
            retrieved_chunks.append(result[1][:300])
            print(f"✅ Match (score={similarity_score:.4f}) - {result[0]}")

    # -----------------------------
    # Construire le prompt et interroger le LLM
    # -----------------------------
    llm_helper = LLMHelper(max_tokens=1500)
    llm_service = LLMService()

    prompt = llm_helper.build_prompt(query, retrieved_chunks)

    try:
        response = llm_service.ask(prompt)
    except Exception as e:
        response = f"⚠️ Erreur avec le LLMService : {e}"

    cursor.close()
    conn.close()

    return response
