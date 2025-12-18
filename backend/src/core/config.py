import os
from dotenv import load_dotenv

load_dotenv()

DATA_DIR = os.path.join(os.getcwd(), "data")
CHROMA_DB_DIR = os.path.join(os.getcwd(), "chroma_db")

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

# Gemini Config
GEMINI_API_KEY = os.getenv("GEM_API")
LLM_MODEL = "gemini-2.5-flash" 

# Embedding Config (Local)
EMBEDDING_MODEL = "all-MiniLM-L6-v2" # Sentence-Transformers model
USE_LOCAL_EMBEDDINGS = True

# Mock Config
USE_MOCK = False 
USE_MOCK_LLM = False # We have a real key now

# Retrieval Config
RETRIEVAL_TOP_K = 5
SIMILARITY_THRESHOLD = 0.0 if USE_MOCK else 0.5  # Accept all in mock mode

# Database Config (Supabase)
# Default to credentials provided by user if not in ENV
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:tqzBGvgh5SXQyZ5e@db.xtsmbqljlrdulhtrjcap.supabase.co:5432/postgres")
