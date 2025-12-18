from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document
from src.core import config
from langchain_community.llms import FakeListLLM

# Initialize LLM
if config.USE_MOCK or getattr(config, "USE_MOCK_LLM", False):
    print("WARN: Using Mock LLM")
    llm = FakeListLLM(responses=[
        "This is a MOCK answer. I retrieved relevance context but cannot generate a real answer without a valid API Key. [Source: See Metadata]",
        "Another mock response."
    ])
else:
    try:
        # Initialize Gemini
        llm = ChatGoogleGenerativeAI(
            model=config.LLM_MODEL, 
            google_api_key=config.GEMINI_API_KEY,
            temperature=0,
            convert_system_message_to_human=True # Sometimes needed for older models, but harmless
        )
    except Exception as e:
        print(f"Error init LLM: {e}. Fallback to Mock.")
        llm = FakeListLLM(responses=["Error initializing LLM."])

# Define Prompt
RAG_SYSTEM_PROMPT = """You are a trustworthy AI assistant for a Question Answering system.
Your task is to answer the user's question explicitly based ONLY on the provided Context.

CRITICAL RULES:
1. Use ONLY the provided context chunks to answer.
2. If the answer is not in the context, state "Answer not found in provided documents". Do NOT guess.
3. **MANDATORY**: Cite the source document and page number for EVERY claim or sentence you write. 
   - Format: "...statement [Source: DocName, Page: X]."
4. Provide specific snippets from the context that support your answer using quotation marks.
5. Do not use any external knowledge.

Context:
{context}
"""

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", RAG_SYSTEM_PROMPT),
    ("human", "{question}")
])

chain = qa_prompt | llm | StrOutputParser()

def format_docs(docs: List[Document]) -> str:
    formatted = []
    for doc in docs:
        source = doc.metadata.get("document_name", "Unknown")
        page = doc.metadata.get("page", "Unknown")
        content = doc.page_content.replace("\n", " ")
        formatted.append(f"--- Document: {source}, Page: {page} ---\nContent: {content}\n")
    return "\n".join(formatted)

def generate_answer(question: str, docs: List[Document]) -> Dict[str, Any]:
    """
    Generate an answer using the LLM and retrieved documents.
    """
    if not docs:
        return {
            "answer": "Insufficient evidence in the document corpus",
            "sources": []
        }
    
    context_text = format_docs(docs)
    
    try:
        print(f"INFO: Generating answer using Gemini model: {config.LLM_MODEL}...")
        response_text = chain.invoke({
            "question": question,
            "context": context_text
        })
        print("INFO: Gemini response received.")
    except Exception as e:
        print(f"ERROR: Gemini generation failed: {e}")
        response_text = f"Error generating answer: {str(e)}"
    
    # Extract metadata for structured response
    sources_metadata = []
    seen = set()
    for doc in docs:
        identifier = f"{doc.metadata.get('document_name')}_p{doc.metadata.get('page')}"
        if identifier not in seen:
            sources_metadata.append({
                "document": doc.metadata.get("document_name"),
                "page": doc.metadata.get("page"),
                "snippet": doc.page_content[:100] + "..." 
            })
            seen.add(identifier)
            
    return {
        "answer": response_text,
        "sources": sources_metadata
    }
