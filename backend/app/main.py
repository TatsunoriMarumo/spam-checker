from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import spam_checker, health_check
from app.config import settings

BASE_URL = settings.BASE_URL

app = FastAPI(
    openapi_url=f"{BASE_URL}/openapi.json",
    docs_url=f"{BASE_URL}/docs",
    redoc_url=f"{BASE_URL}/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spam_checker.router, prefix=f"{BASE_URL}")
