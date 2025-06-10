"""
Tatsunori Marumo
A01327744
"""

from fastapi import APIRouter, Response, status
from pydantic import BaseModel
from app.services import distilbert_plain, distilbert_weighted

router = APIRouter()


class MessageRequest(BaseModel):
    message: str


@router.post("/predict/plain")
def predict_plain(request: MessageRequest):
    result = distilbert_plain.predict(request.message)
    return result


@router.post("/predict/weighted")
def predict_weighted(request: MessageRequest):
    result = distilbert_weighted.predict(request.message)
    return result


@router.get("/models")
def list_models():
    return {"models": ["plain", "weighted"]}


@router.get("/healthz", include_in_schema=False)
async def healthz():
    return {"status": "ok"}


@router.head("/healthz", include_in_schema=False)
async def healthz_head() -> Response:
    return Response(status_code=status.HTTP_200_OK)


def main():
    pass


if __name__ == '__main__':
    main()
