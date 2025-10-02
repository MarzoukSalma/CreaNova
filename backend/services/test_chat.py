import psycopg2
from sentence_transformers import SentenceTransformer
import os

# Connexion à la base de données PostgreSQL
conn = psycopg2.connect("dbname=rag_chatbot_db user=postgres password=salma")  # Remplace 'yourpassword' par ton mot de passe 
cursor = conn.cursor()

# Charger le modèle de Sentence-Transformers
model = SentenceTransformer('all-MiniLM-L6-v2')

# Fonction pour insérer un document et ses embeddings dans la base de données
def process_file(file_path):
    with open(file_path, "r",encoding="utf-8") as file:
        content = file.read()
    # Découper le contenu en chunks (par exemple par lignes ou toute autre méthode)
    chunks = content.split("\n")  # Ou utilise une autre méthode pour découper par exemple par mots

    # Insérer le document dans la base
    cursor.execute("INSERT INTO documents(title, content) VALUES(%s, %s) RETURNING id", (file_path, content))
    doc_id = cursor.fetchone()[0]

    # Générer et insérer les embeddings pour chaque chunk
    for chunk in chunks:
        if chunk.strip():  # Ignore les chunks vides
            embeddings = model.encode([chunk])
            cursor.execute("INSERT INTO embeddings(document_id, content, embedding) VALUES(%s, %s, %s)",
                           (doc_id, chunk, embeddings[0].tolist()))  # Convertir en liste pour JSON

    conn.commit()
    print(f"Document '{file_path}' traité et indexé avec succès.")

# Fonction pour traiter tous les fichiers dans un répertoire
def process_directory(directory_path):
    # Liste tous les fichiers dans le répertoire
    for filename in os.listdir(directory_path):
        if filename.endswith(".txt"):  # Filtrer les fichiers texte
            file_path = os.path.join(directory_path, filename)
            process_file(file_path)

# Exemple : Traiter tous les fichiers dans le répertoire 'data'
data_directory = 'backend/services/data'  # Remplace par ton répertoire de fichiers
process_directory(data_directory)

# Fermer la connexion à la base de données
cursor.close()
conn.close()
