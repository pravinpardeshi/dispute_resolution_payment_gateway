import requests
import json

def mistral_call(prompt: str):
    url = "http://localhost:11434/api/generate"

    payload = {
        "model": "mistral:7b",
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(url, json=payload)

    # ----------------------------
    # 🚨 Step 1: check HTTP errors
    # ----------------------------
    if response.status_code != 200:
        raise Exception(f"Ollama error: {response.text}")

    data = response.json()

    # ----------------------------
    # 🚨 Step 2: safe extraction
    # ----------------------------
    if "response" in data:
        return data["response"]

    # fallback if structure differs
    if "message" in data:
        return data["message"]

    if "error" in data:
        raise Exception(f"LLM error: {data['error']}")

    return str(data)