from typing import Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Barebones API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello from Barebones API!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "barebones-api"}

@app.get("/api/data")
async def get_data() -> list[dict[str, Any]]:
    return [
            {"olympus_id": 45815, "cusip": "CND10004KM54"},
            {"olympus_id": 68312, "cusip": "69369EAD1"},
        ]

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
