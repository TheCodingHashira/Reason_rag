import os
from dotenv import load_dotenv
import uvicorn
from src.api.routes import app

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("src.api.routes:app", host="0.0.0.0", port=port, reload=True)
