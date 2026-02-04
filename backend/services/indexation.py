# backend/services/indexation.py
import psycopg2
from sentence_transformers import SentenceTransformer
import os
from chunk import chunk_text, print_chunk_stats  # ← Import du nouveau module

# Connexion à la base de données PostgreSQL
conn = psycopg2.connect(
    dbname="rag_chatbot_db",
    user="postgres",
    password=os.getenv("RAG_DB_PASSWORD"),
    host="localhost",
    port=5432
)
cursor = conn.cursor()

# Charger le modèle
model = SentenceTransformer('all-MiniLM-L6-v2')

def process_file(file_path):
    """Traite un fichier et l'indexe dans la base de données."""
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
        
        if not content.strip():
            print(f"⚠️ Fichier vide ignoré: {file_path}")
            return
        
        # ✅ NOUVEAU : Utiliser le chunking intelligent
        chunks = chunk_text(
            content, 
            method='smart',      # Méthode recommandée
            chunk_size=500,      # 500 caractères par chunk
            overlap=50           # Chevauchement de 50 caractères
        )
        
        # Afficher les stats
        print(f"\n📄 Traitement de: {os.path.basename(file_path)}")
        print_chunk_stats(chunks)
        
        # Insérer le document dans la base
        cursor.execute(
            "INSERT INTO documents(title, content, source) VALUES(%s, %s, %s) RETURNING id",
            (os.path.basename(file_path), content, file_path)
        )
        doc_id = cursor.fetchone()[0]
        
        # Générer et insérer les embeddings pour chaque chunk
        for chunk_data in chunks:
            chunk_content = chunk_data['content']
            chunk_index = chunk_data['chunk_index']
            
            # Générer l'embedding
            embedding = model.encode([chunk_content])[0]
            
            # Insérer dans la base
            cursor.execute(
                """
                INSERT INTO embeddings(document_id, content, embedding, chunk_index) 
                VALUES(%s, %s, %s, %s)
                """,
                (doc_id, chunk_content, embedding.tolist(), chunk_index)
            )
        
        conn.commit()
        print(f"✅ '{os.path.basename(file_path)}' traité avec succès ({len(chunks)} chunks)\n")
    
    except Exception as e:
        conn.rollback()
        print(f"❌ Erreur lors du traitement de '{file_path}': {e}")

def process_directory(directory_path):
    """Traite tous les fichiers .txt dans un répertoire."""
    if not os.path.exists(directory_path):
        print(f"❌ Répertoire introuvable: {directory_path}")
        return
    
    txt_files = [f for f in os.listdir(directory_path) if f.endswith('.txt')]
    
    if not txt_files:
        print(f"⚠️ Aucun fichier .txt trouvé dans {directory_path}")
        return
    
    print(f"📁 {len(txt_files)} fichier(s) trouvé(s)\n")
    
    for filename in txt_files:
        file_path = os.path.join(directory_path, filename)
        process_file(file_path)

# Exécution
if __name__ == "__main__":
    data_directory = 'services/data'
    process_directory(data_directory)
    
    cursor.close()
    conn.close()
    print("\n🎉 Indexation terminée!")