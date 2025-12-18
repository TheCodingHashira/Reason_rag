# Reason_Verse 🧠✨

**Reason_Verse** is a production-ready, trustworthy Retrieval Augmented Generation (RAG) system designed to answer questions strictly based on your documents. 

It features a **FastAPI** backend that ensures grounded answers with citations and a modern **React (Vite)** frontend for interacting with your data.

## 🚀 Features

- **Strict Grounding**: Answers are derived *only* from ingested documents. Hallucinations are minimized.
- **Explainability**: Every answer includes inline citations `[Source: document.pdf, Page: 12]`.
- **Local Embeddings**: Uses `all-MiniLM-L6-v2` (free, runs locally) for privacy and zero cost.
- **Gemini Powered**: Uses Google's `gemini-2.5-flash` for high-speed, accurate generation.
- **Document Upload**: Upload PDFs/DOCX directly via the UI.
- **Supabase Ready**: Configured for PostgreSQL integration (Chat History, Users).

## 🛠️ Architecture

- **Backend** (`backend/`):
  - **Framework**: FastAPI (Python)
  - **Vector Store**: ChromaDB
  - **LLM**: Google Gemini
  - **Components**: `LangChain`, `PyPDF`, `SentenceTransformers`
- **Frontend** (`frontend/`):
  - **Framework**: React + Vite (TypeScript)
  - **Styling**: TailwindCSS, Shadcn/UI
  - **Network**: Fetch API (REST)

## 📦 Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)

pip install -r requirements.txt
```

**Configuration**:
Create a `.env` file in `backend/`:
```env
# Gemini API Key (Required)
GEM_API="your_gemini_api_key_here"

# Optional: Supabase Database URL
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

**Run Server**:
```bash
python main.py
```
*Server runs at `http://localhost:8000`*

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

## 💡 Usage

1. Open the frontend URL.
2. Click **Upload** to add PDF documents.
3. Wait for the "Ingestion Complete" toast.
4. Ask a question! e.g., *"What is the leave policy?"*

## 🤝 Contributing

Built with ❤️ by TheCodingHashira.

## 📄 License

MIT
