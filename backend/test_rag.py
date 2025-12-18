import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_root():
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root endpoint: {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Root endpoint failed: {e}")

def test_query(question):
    print(f"\nAsking: '{question}'")
    try:
        response = requests.post(f"{BASE_URL}/query", json={"question": question})
        if response.status_code == 200:
            data = response.json()
            print("Answer:", data["answer"])
            print("Sources:", json.dumps(data["sources"], indent=2))
        else:
            print(f"Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Query failed: {e}")

if __name__ == "__main__":
    print("Waiting for server to start...")
    time.sleep(5) # Give the server a moment if we run this immediately after starting it
    
    test_root()
    
    # Test 1: Relevant Question (Based on filename)
    test_query("What is the difference between machine learning and deep learning?")
    
    # Test 2: Irrelevant Question
    test_query("What is the capital of France?")
