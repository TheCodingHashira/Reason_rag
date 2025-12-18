import os
import glob
from typing import List
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from src.core import config

def load_documents(data_dir: str = config.DATA_DIR) -> List[Document]:
    """
    Load all PDF documents from the data directory.
    """
    pdf_files = glob.glob(os.path.join(data_dir, "*.pdf"))
    documents = []
    
    print(f"Found {len(pdf_files)} PDF files in {data_dir}")
    
    for file_path in pdf_files:
        try:
            loader = PyPDFLoader(file_path)
            docs = loader.load()
            # Add filename to metadata if not present (PyPDFLoader usually adds 'source')
            for doc in docs:
                doc.metadata["document_name"] = os.path.basename(file_path)
            documents.extend(docs)
            print(f"Loaded {len(docs)} pages from {os.path.basename(file_path)}")
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
            
    return documents

def split_documents(documents: List[Document]) -> List[Document]:
    """
    Split documents into semantic chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=config.CHUNK_SIZE,
        chunk_overlap=config.CHUNK_OVERLAP,
        add_start_index=True,
    )
    
    chunks = text_splitter.split_documents(documents)
    
    # Enrich metadata with chunk_id
    for i, chunk in enumerate(chunks):
        chunk.metadata["chunk_id"] = f"{chunk.metadata.get('document_name', 'doc')}_{chunk.metadata.get('page', 0)}_{i}"
        
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")
    return chunks
