from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from app.graph import run_dispute_graph
from app.synthetic import generate_dispute
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any
import asyncio
import uuid
from datetime import datetime
import json


app = FastAPI()

# Task storage (in production, use Redis or database)
task_store: Dict[str, Dict[str, Any]] = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Root route → serve UI
@app.get("/")
def root():
    return FileResponse("static/index.html")

@app.post("/dispute/run")
async def run_dispute(background_tasks: BackgroundTasks, data: dict):
    """Start async dispute investigation"""
    task_id = str(uuid.uuid4())
    
    # Store initial task status
    task_store[task_id] = {
        "id": task_id,
        "status": "pending",
        "started_at": datetime.utcnow().isoformat(),
        "result": None,
        "error": None
    }
    
    # Add background task
    background_tasks.add_task(process_dispute_async, task_id, data)
    
    return {"task_id": task_id, "status": "started"}

@app.get("/dispute/status/{task_id}")
async def get_task_status(task_id: str):
    """Get task status and results"""
    if task_id not in task_store:
        return {"error": "Task not found"}
    
    return task_store[task_id]

async def process_dispute_async(task_id: str, data: dict):
    """Process dispute in background"""
    try:
        # Update status to processing
        task_store[task_id]["status"] = "processing"
        
        # Run the dispute graph (this is still synchronous but runs in background)
        result = run_dispute_graph(data)
        
        # Store result
        task_store[task_id]["status"] = "completed"
        task_store[task_id]["result"] = result
        task_store[task_id]["completed_at"] = datetime.utcnow().isoformat()
        
    except Exception as e:
        # Store error
        task_store[task_id]["status"] = "failed"
        task_store[task_id]["error"] = str(e)
        task_store[task_id]["completed_at"] = datetime.utcnow().isoformat()

@app.get("/synthetic")
def synthetic():
    return generate_dispute()
    
@app.get("/health")
def health():
    return {"status": "ok"}