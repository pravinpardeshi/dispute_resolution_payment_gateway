Architecture Diagram:
                 ┌────────────────────────┐
                 │  Web UI (HTML/JS)      │
                 └──────────┬─────────────┘
                            │ REST
                            ▼
                 ┌────────────────────────┐
                 │ FastAPI Gateway        │
                 └──────────┬─────────────┘
                            │
        ┌───────────────────┼────────────────────┐
        ▼                   ▼                    ▼

┌──────────────┐  ┌────────────────┐  ┌─────────────────┐
│ Ingestion API│  │ LangGraph AI   │  │ Synthetic Data  │
│ (disputes)   │  │ Workflow Engine│  │ Generator       │
└──────┬───────┘  └──────┬─────────┘  └─────────────────┘
       │                 │
       ▼                 ▼
┌──────────────────────────────────────────────┐
│ Qdrant Vector DB                             │
│ - transaction embeddings                     │
│ - dispute embeddings                         │
│ - merchant history                           │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Local Mistral LLM (Ollama)   │
│ reasoning + decisions        │
└──────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Analyst UI + API response    │
└──────────────────────────────┘