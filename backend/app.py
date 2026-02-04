# backend/app.py
import sys
sys.stdout.reconfigure(encoding="utf-8")

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from services.rag_engine import RAGEngine

# Charger les variables d'environnement
load_dotenv()

# Initialiser Flask
app = Flask(__name__)
CORS(app)  # Permettre les requêtes depuis Express.js

# Initialiser le moteur RAG (une seule fois au démarrage)
print(" Initialisation du service RAG...")
try:
    db_url = f"dbname={os.getenv('DB_NAME', 'rag_chatbot_db')} user={os.getenv('DB_USER', 'postgres')} password={os.getenv('DB_PASSWORD', 'RAG_DB_PASSWORD')}"
    groq_key = os.getenv("GROQ_API", "")
    
    if not groq_key:
        raise ValueError(" GROQ_API manquante dans .env")
    
    rag_engine = RAGEngine(db_url, groq_key)
    print(" Service RAG prêt !\n")
except Exception as e:
    print(f" Erreur d'initialisation: {e}")
    rag_engine = None


# ==================== ROUTES API ====================

@app.route('/', methods=['GET'])
def home():
    """Route de test pour vérifier que le service est actif."""
    return jsonify({
        'service': 'RAG Chatbot API',
        'status': 'running',
        'version': '1.0.0'
    })


@app.route('/health', methods=['GET'])
def health_check():
    """Vérifie l'état du service."""
    if rag_engine is None:
        return jsonify({
            'status': 'error',
            'message': 'RAG engine not initialized'
        }), 503
    
    return jsonify({
        'status': 'healthy',
        'engine': 'ready'
    })


@app.route('/api/ask', methods=['POST'])
def ask_question():
    """
    Endpoint principal pour poser une question au RAG.
    
    Body JSON:
    {
        "question": "Comment rester motivé ?",
        "user_id": "user123",  // optionnel
        "use_memory": true     // optionnel (défaut: true)
    }
    
    Response:
    {
        "success": true,
        "answer": "Pour rester motivé...",
        "sources": [...],
        "chunks_used": 3
    }
    """
    if rag_engine is None:
        return jsonify({
            'success': False,
            'error': 'Service RAG non disponible'
        }), 503
    
    try:
        # Récupérer les données
        data = request.get_json()
        
        if not data or 'question' not in data:
            return jsonify({
                'success': False,
                'error': 'Question manquante'
            }), 400
        
        question = data['question']
        user_id = data.get('user_id', 'anonymous')
        use_memory = data.get('use_memory', True)
        
        # Appeler le moteur RAG
        result = rag_engine.ask(question, use_memory=use_memory)
        
        # Log (optionnel)
        print(f"[{user_id}] Question: {question[:50]}...")
        
        return jsonify({
            'success': True,
            'answer': result['answer'],
            'sources': result['sources'],
            'chunks_used': result['chunks_used']
        })
    
    except Exception as e:
        print(f" Erreur: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'answer': "Désolé, une erreur s'est produite."
        }), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    Retourne les statistiques du système RAG.
    
    Response:
    {
        "success": true,
        "database": {
            "num_documents": 3,
            "num_chunks": 12
        },
        "memory": {
            "size": 2,
            "max_history": 5
        }
    }
    """
    if rag_engine is None:
        return jsonify({
            'success': False,
            'error': 'Service non disponible'
        }), 503
    
    try:
        db_stats = rag_engine.get_database_stats()
        memory_stats = rag_engine.get_memory_summary()
        
        return jsonify({
            'success': True,
            'database': db_stats,
            'memory': {
                'size': memory_stats['size'],
                'max_history': memory_stats['max_history']
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/clear-memory', methods=['POST'])
def clear_memory():
    """
    Efface la mémoire conversationnelle.
    
    Body JSON (optionnel):
    {
        "user_id": "user123"
    }
    """
    if rag_engine is None:
        return jsonify({
            'success': False,
            'error': 'Service non disponible'
        }), 503
    
    try:
        rag_engine.clear_memory()
        
        return jsonify({
            'success': True,
            'message': 'Mémoire conversationnelle effacée'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/search', methods=['POST'])
def search_chunks():
    """
    Recherche directe dans la base sans génération LLM.
    Utile pour du debugging ou de l'auto-complétion.
    
    Body JSON:
    {
        "query": "motivation",
        "top_k": 5
    }
    """
    if rag_engine is None:
        return jsonify({
            'success': False,
            'error': 'Service non disponible'
        }), 503
    
    try:
        data = request.get_json()
        query = data.get('query', '')
        top_k = data.get('top_k', 5)
        
        if not query:
            return jsonify({
                'success': False,
                'error': 'Query manquante'
            }), 400
        
        # Recherche directe (sans LLM)
        chunks = rag_engine.retrieval.search(query, top_k=top_k)
        
        return jsonify({
            'success': True,
            'results': chunks
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# Gestion de la fermeture propre



# ==================== LANCEMENT ====================

if __name__ == '__main__':
    # Lancer le serveur Flask
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(
        host='0.0.0.0',  # Accessible depuis l'extérieur
        port=port,
        debug=True
    )