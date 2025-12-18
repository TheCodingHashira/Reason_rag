import shutil
import os
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from typing import List
from src.core import config

from langchain_community.embeddings import FakeEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings

def get_vector_store():
    """
    Initialize or load the Chroma vector store.
    """
    if config.USE_MOCK:
        print("WARN: Using FakeEmbeddings (Mock Mode)")
        embeddings = FakeEmbeddings(size=1536)
    elif config.USE_LOCAL_EMBEDDINGS:
        print(f"INFO: Using Local Embeddings ({config.EMBEDDING_MODEL})")
        embeddings = HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL)
    else:
        embeddings = OpenAIEmbeddings(model=config.EMBEDDING_MODEL)
    
    vector_store = Chroma(
        persist_directory=config.CHROMA_DB_DIR,
        embedding_function=embeddings,
        collection_name="rag_documents"
    )
    return vector_store

def index_documents(chunks: List[Document]):
    """
    Add documents to the vector store.
    """
    if not chunks:
        print("No chunks to index.")
        return

    vector_store = get_vector_store()
    
    # Add documents
    # ids = [chunk.metadata["chunk_id"] for chunk in chunks] # Chroma generates IDs if not provided, or we can use ours
    # Using default ID generation to avoid collision issues if reusing IDs mechanically without cleanup
    
    vector_store.add_documents(documents=chunks)
    print(f"Indexed {len(chunks)} chunks into ChromaDB at {config.CHROMA_DB_DIR}")

def clear_vector_store():
    """
    Clear existing vector store data (useful for resets).
    """
    if os.path.exists(config.CHROMA_DB_DIR):
        shutil.rmtree(config.CHROMA_DB_DIR)
        print("Vector store cleared.")
