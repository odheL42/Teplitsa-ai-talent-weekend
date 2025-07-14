import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api import history_router
from src.config import config

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://client",
        "http://localhost:3000",
        "http://client:80",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


prefix = "/api"
app.include_router(history_router, prefix=prefix)

if __name__ == "__main__":
    uvicorn.run(
        app="src.main:app",
        host=config.uvicorn_host,
        port=config.uvicorn_port,
        workers=config.uvicorn_workers,
        reload=config.uvicorn_reload,
    )
