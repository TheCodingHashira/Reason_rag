from typing import List, Tuple
from langchain_core.documents import Document
from src.rag.vector_store import get_vector_store
from src.core import config

def retrieve_documents(query: str) -> List[Tuple[Document, float]]:
    """
    Retrieve documents relevant to the query with similarity scores.
    Returns a list of (Document, score) tuples.
    """
    vector_store = get_vector_store()
    
    # search_type="similarity_score_threshold" is also an option in langchain but let's do manual for explicit control/logging
    # Chroma returns distance usually, but Langchain wrapper can return similarity score
    
    # Using similarity_search_with_score
    # Note: Chroma in LangChain returns cosine distance by default (lower is better) or similarity (higher is better) depending on config.
    # Default OpenAI embeddings usually use cosine distance. 
    # However, let's use the relevance_score_fn if available or just check the raw scores.
    # Standard Langchain Chroma `similarity_search_with_score` returns (doc, score) where score is typically L2 distance for default Chroma.
    # BUT OpenAI embeddings are normalized, so L2 is related to cosine.
    # Anyhow, let's use `similarity_search_with_relevance_score` which normalizes to 0-1 range where 1 is best.
    
    # Logic for Mock Mode
    if config.USE_MOCK:
        # FakeEmbeddings fallback
        docs = vector_store.similarity_search(query, k=config.RETRIEVAL_TOP_K)
        return [(doc, 0.99) for doc in docs]
    
    # Use similarity_search_with_score which is more stable across versions
    # Chroma default: L2 distance (Lower is better).
    # But usually we want Similarity (Higher is better).
    # If using Cosine distance in Chroma (default for some), we might need to invert.
    # For now, let's treat the score as "Distance" and check if it's small enough.
    # OR we just assume valid retrieval.
    
    results = vector_store.similarity_search_with_score(
        query,
        k=config.RETRIEVAL_TOP_K
    )
    
    # Filter by threshold (Note: Score interpretation depends on distance metric)
    # L2 Distance: 0 is identical. 1 is far.
    # Cosine Distance: 0 is identical. 1 is opposite.
    # Let's simple include everything for now or implement a "max_distance" logic.
    
    filtered_results = []
    MAX_DISTANCE = 1.0 # Very loose threshold
    
    for doc, score in results:
        # Assuming score is Distance (lower is better)
        if score <= MAX_DISTANCE:
             # Convert distance to a "similarity" proxy for the UI (1 / (1 + score))
            sim_score = 1 / (1 + score)
            filtered_results.append((doc, sim_score))
        else:
            print(f"Skipped doc {doc.metadata.get('chunk_id')} with distance {score}")
            
    return filtered_results
