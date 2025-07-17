import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.api import completions_router, history_router, menu_router
from src.config import config

app = FastAPI()


@app.get("/health", tags=["Health"])
async def healthcheck():
    return JSONResponse(content={"status": "ok"})


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


prefix = "/api"
app.include_router(history_router, prefix=prefix)
app.include_router(completions_router, prefix=prefix)
app.include_router(menu_router, prefix=prefix)

if __name__ == "__main__":
    uvicorn.run(
        app="src.main:app",
        host=config.uvicorn_host,
        port=config.uvicorn_port,
        workers=config.uvicorn_workers,
        reload=config.uvicorn_reload,
    )
