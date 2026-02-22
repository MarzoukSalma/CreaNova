# backend/services/chunk.py


import re
from typing import List, Dict, Any


class TextChunker:
    """
    Classe pour découper intelligemment du texte en chunks.
    """
    
    def __init__(self, chunk_size: int = 500, overlap: int = 50):
        """
        Initialise le chunker.
        
        Args:
            chunk_size: Taille maximale d'un chunk en caractères
            overlap: Nombre de caractères qui se chevauchent entre chunks
        """
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def chunk_by_characters(self, text: str) -> List[Dict[str, Any]]:
        """
        Découpe le texte en chunks de taille fixe avec chevauchement.
        
        Args:
            text: Texte à découper
            
        Returns:
            Liste de dictionnaires contenant les chunks et leurs métadonnées
        """
        chunks = []
        start = 0
        chunk_index = 0
        
        # Nettoyer le texte
        text = text.strip()
        
        if not text:
            return chunks
        
        while start < len(text):
            end = start + self.chunk_size
            
            # Extraire le chunk
            chunk = text[start:end]
            
            # Si on n'est pas à la fin, éviter de couper au milieu d'un mot
            if end < len(text):
                # Chercher le dernier espace
                last_space = chunk.rfind(' ')
                if last_space != -1 and last_space > self.chunk_size * 0.8:
                    chunk = chunk[:last_space]
                    end = start + last_space
            
            # Nettoyer le chunk
            chunk = chunk.strip()
            
            if chunk:  # Ignorer les chunks vides
                chunks.append({
                    'content': chunk,
                    'chunk_index': chunk_index,
                    'start_pos': start,
                    'end_pos': end,
                    'size': len(chunk)
                })
                chunk_index += 1
            
            # Avancer avec chevauchement
            start = end - self.overlap
            
            # Éviter les boucles infinies
            if start >= len(text):
                break
        
        return chunks
    
    def chunk_by_sentences(self, text: str, max_sentences: int = 5) -> List[Dict[str, Any]]:
        """
        Découpe le texte par phrases (utilise des points, points d'exclamation, etc.).
        
        Args:
            text: Texte à découper
            max_sentences: Nombre maximum de phrases par chunk
            
        Returns:
            Liste de dictionnaires contenant les chunks et leurs métadonnées
        """
        # Découper en phrases (approximatif avec regex)
        sentence_endings = r'[.!?]+[\s]+'
        sentences = re.split(sentence_endings, text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        chunks = []
        chunk_index = 0
        
        for i in range(0, len(sentences), max_sentences):
            chunk_sentences = sentences[i:i + max_sentences]
            chunk = ' '.join(chunk_sentences)
            
            if chunk:
                chunks.append({
                    'content': chunk,
                    'chunk_index': chunk_index,
                    'sentence_count': len(chunk_sentences),
                    'size': len(chunk)
                })
                chunk_index += 1
        
        return chunks
    
    def chunk_by_paragraphs(self, text: str, max_paragraphs: int = 3) -> List[Dict[str, Any]]:
        """
        Découpe le texte par paragraphes (séparés par des sauts de ligne).
        
        Args:
            text: Texte à découper
            max_paragraphs: Nombre maximum de paragraphes par chunk
            
        Returns:
            Liste de dictionnaires contenant les chunks et leurs métadonnées
        """
        # Découper par double saut de ligne (paragraphes)
        paragraphs = re.split(r'\n\s*\n', text)
        paragraphs = [p.strip() for p in paragraphs if p.strip()]
        
        chunks = []
        chunk_index = 0
        
        for i in range(0, len(paragraphs), max_paragraphs):
            chunk_paragraphs = paragraphs[i:i + max_paragraphs]
            chunk = '\n\n'.join(chunk_paragraphs)
            
            if chunk:
                chunks.append({
                    'content': chunk,
                    'chunk_index': chunk_index,
                    'paragraph_count': len(chunk_paragraphs),
                    'size': len(chunk)
                })
                chunk_index += 1
        
        return chunks
    
    def chunk_smart(self, text: str) -> List[Dict[str, Any]]:
        """
        Découpage intelligent : combine paragraphes + taille maximale.
        Stratégie recommandée pour la plupart des cas.
        
        Args:
            text: Texte à découper
            
        Returns:
            Liste de dictionnaires contenant les chunks et leurs métadonnées
        """
        # Découper par paragraphes d'abord
        paragraphs = re.split(r'\n\s*\n', text)
        paragraphs = [p.strip() for p in paragraphs if p.strip()]
        
        chunks = []
        chunk_index = 0
        current_chunk = ""
        
        for paragraph in paragraphs:
            # Si ajouter ce paragraphe dépasse la taille max
            if len(current_chunk) + len(paragraph) > self.chunk_size:
                # Sauvegarder le chunk actuel s'il n'est pas vide
                if current_chunk.strip():
                    chunks.append({
                        'content': current_chunk.strip(),
                        'chunk_index': chunk_index,
                        'size': len(current_chunk.strip())
                    })
                    chunk_index += 1
                
                # Si le paragraphe est trop long, le découper
                if len(paragraph) > self.chunk_size:
                    sub_chunks = self.chunk_by_characters(paragraph)
                    for sub_chunk in sub_chunks:
                        chunks.append({
                            'content': sub_chunk['content'],
                            'chunk_index': chunk_index,
                            'size': sub_chunk['size']
                        })
                        chunk_index += 1
                    current_chunk = ""
                else:
                    current_chunk = paragraph
            else:
                # Ajouter le paragraphe au chunk actuel
                if current_chunk:
                    current_chunk += "\n\n" + paragraph
                else:
                    current_chunk = paragraph
        
        # Ajouter le dernier chunk
        if current_chunk.strip():
            chunks.append({
                'content': current_chunk.strip(),
                'chunk_index': chunk_index,
                'size': len(current_chunk.strip())
            })
        
        return chunks
    
    def chunk_by_tokens(self, text: str, max_tokens: int = 200) -> List[Dict[str, Any]]:
        """
        Découpe le texte par nombre de mots (approximation de tokens).
        
        Args:
            text: Texte à découper
            max_tokens: Nombre maximum de mots par chunk
            
        Returns:
            Liste de dictionnaires contenant les chunks et leurs métadonnées
        """
        words = text.split()
        chunks = []
        chunk_index = 0
        
        for i in range(0, len(words), max_tokens):
            chunk_words = words[i:i + max_tokens]
            chunk = ' '.join(chunk_words)
            
            if chunk:
                chunks.append({
                    'content': chunk,
                    'chunk_index': chunk_index,
                    'token_count': len(chunk_words),
                    'size': len(chunk)
                })
                chunk_index += 1
        
        return chunks


# Fonction helper pour utilisation simple
def chunk_text(text: str, 
               method: str = 'smart',
               chunk_size: int = 500, 
               overlap: int = 50,
               **kwargs) -> List[Dict[str, Any]]:
    """
    Fonction utilitaire pour découper du texte.
    
    Args:
        text: Texte à découper
        method: Méthode de découpage ('characters', 'sentences', 'paragraphs', 'smart', 'tokens')
        chunk_size: Taille des chunks (pour 'characters' et 'smart')
        overlap: Chevauchement (pour 'characters')
        **kwargs: Arguments supplémentaires selon la méthode
        
    Returns:
        Liste de chunks avec métadonnées
        
    Examples:
        >>> chunks = chunk_text("Mon texte...", method='smart', chunk_size=500)
        >>> chunks = chunk_text("Mon texte...", method='sentences', max_sentences=5)
        >>> chunks = chunk_text("Mon texte...", method='paragraphs', max_paragraphs=3)
    """
    chunker = TextChunker(chunk_size=chunk_size, overlap=overlap)
    
    methods = {
        'characters': chunker.chunk_by_characters,
        'sentences': chunker.chunk_by_sentences,
        'paragraphs': chunker.chunk_by_paragraphs,
        'smart': chunker.chunk_smart,
        'tokens': chunker.chunk_by_tokens
    }
    
    if method not in methods:
        raise ValueError(f"Méthode inconnue: {method}. Choix: {list(methods.keys())}")
    
    # Appeler la méthode appropriée
    if method in ['sentences', 'paragraphs', 'tokens']:
        return methods[method](text, **kwargs)
    else:
        return methods[method](text)


# Fonction pour afficher les statistiques des chunks
def print_chunk_stats(chunks: List[Dict[str, Any]]) -> None:
    """
    Affiche des statistiques sur les chunks générés.
    
    Args:
        chunks: Liste de chunks
    """
    if not chunks:
        print("⚠️ Aucun chunk généré")
        return
    
    total_size = sum(c['size'] for c in chunks)
    avg_size = total_size / len(chunks)
    min_size = min(c['size'] for c in chunks)
    max_size = max(c['size'] for c in chunks)
    
    print(f"📊 Statistiques des chunks:")
    print(f"  • Nombre de chunks: {len(chunks)}")
    print(f"  • Taille totale: {total_size} caractères")
    print(f"  • Taille moyenne: {avg_size:.0f} caractères")
    print(f"  • Taille min: {min_size} caractères")
    print(f"  • Taille max: {max_size} caractères")


# Test du module
if __name__ == "__main__":
    # Texte de test
    test_text = """
    La motivation est un élément clé pour atteindre ses objectifs. Elle peut provenir de sources internes ou externes.
    
    Les objectifs SMART sont Spécifiques, Mesurables, Atteignables, Réalistes et Temporellement définis. Cette méthode aide à structurer ses ambitions de manière concrète.
    
    La procrastination est l'ennemi de la productivité. Pour la vaincre, il faut comprendre ses causes profondes et mettre en place des stratégies adaptées.
    
    Les petites victoires quotidiennes sont essentielles pour maintenir sa motivation sur le long terme. Célébrez chaque progrès, même minime.
    """
    
    print("=== TEST DU MODULE CHUNKING ===\n")
    
    # Test 1: Chunking smart
    print("1️⃣ Méthode SMART (Recommandée):")
    chunks_smart = chunk_text(test_text, method='smart', chunk_size=200)
    print_chunk_stats(chunks_smart)
    print("\nPremier chunk:")
    print(f"  {chunks_smart[0]['content'][:100]}...\n")
    
    # Test 2: Chunking par caractères
    print("2️⃣ Méthode PAR CARACTÈRES:")
    chunks_chars = chunk_text(test_text, method='characters', chunk_size=150, overlap=30)
    print_chunk_stats(chunks_chars)
    
    # Test 3: Chunking par phrases
    print("\n3️⃣ Méthode PAR PHRASES:")
    chunks_sentences = chunk_text(test_text, method='sentences', max_sentences=2)
    print_chunk_stats(chunks_sentences)
    
    # Test 4: Chunking par paragraphes
    print("\n4️⃣ Méthode PAR PARAGRAPHES:")
    chunks_paragraphs = chunk_text(test_text, method='paragraphs', max_paragraphs=2)
    print_chunk_stats(chunks_paragraphs)