from src.ingestion.loader import load_documents, split_documents
from src.rag.vector_store import index_documents, clear_vector_store

def main():
    print("Starting ingestion process...")
    
    # 1. Load Documents
    docs = load_documents()
    if not docs:
        print("No documents found in data directory.")
        return
        
    # 2. Split Documents
    chunks = split_documents(docs)
    
    # 3. Index Documents
    # Optional: clear existing DB before indexing to avoid duplicates in this simple setup
    # clear_vector_store() 
    index_documents(chunks)
    
    print("Ingestion complete!")

if __name__ == "__main__":
    main()
