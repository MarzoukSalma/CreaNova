# backend/services/retrieval.py

import psycopg2
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict

class RetrievalService:
    """
    Service de recherche vectorielle (cosine similarity en Python).
    Compatible PostgreSQL FLOAT8[] (sans pgvector).
    """

    def __init__(self, db_connection_string: str):
        try:
            self.conn = psycopg2.connect(db_connection_string)
            print("✅ Connexion à la base de données établie")
        except Exception as e:
            raise Exception(f"❌ Erreur de connexion à la base: {e}")

        print("⏳ Chargement du modèle de recherche...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Modèle de recherche chargé")

    def _cosine_similarity(self, a, b) -> float:
        a = np.array(a)
        b = np.array(b)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

    def search(
        self,
        query: str,
        top_k: int = 3,
        similarity_threshold: float = 0.5
    ) -> List[Dict]:

        # 1️⃣ Vectoriser la question
        query_embedding = self.model.encode([query])[0]

        cursor = self.conn.cursor()

        try:
            # 2️⃣ Récupérer TOUS les chunks
            cursor.execute("""
                SELECT
                    e.content,
                    e.chunk_index,
                    e.embedding,
                    d.title,
                    d.source
                FROM embeddings e
                JOIN documents d ON e.document_id = d.id
            """)

            results = []

            for content, chunk_index, embedding, title, source in cursor.fetchall():
                similarity = self._cosine_similarity(query_embedding, embedding)

                if similarity >= similarity_threshold:
                    results.append({
                        "content": content,
                        "chunk_index": chunk_index,
                        "source": title,
                        "file": source,
                        "similarity": similarity
                    })

            # 3️⃣ Trier par similarité décroissante
            results.sort(key=lambda x: x["similarity"], reverse=True)

            return results[:top_k]

        except Exception as e:
            print(f"❌ Erreur lors de la recherche: {e}")
            return []

        finally:
            cursor.close()

    def get_statistics(self) -> Dict:
        cursor = self.conn.cursor()
        try:
            cursor.execute("SELECT COUNT(*) FROM documents")
            num_docs = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM embeddings")
            num_chunks = cursor.fetchone()[0]

            return {
                "num_documents": num_docs,
                "num_chunks": num_chunks
            }
        finally:
            cursor.close()

    def close(self):
        if self.conn:
            self.conn.close()
            print("✅ Connexion à la base fermée")
