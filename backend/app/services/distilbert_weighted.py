"""
Tatsunori Marumo
A01327744
"""

from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from huggingface_hub import login
import torch
from app.config import settings

ACCESS_TOKEN = settings.ACCESS_TOKEN
USER_NAME = settings.USER_NAME
WEIGHTED_MODEL = settings.WEIGHTED_MODEL

if ACCESS_TOKEN:
    login(token=ACCESS_TOKEN)

label_map = {0: "ham", 1: "spam"}

tokenizer = DistilBertTokenizer.from_pretrained(f"{USER_NAME}/{WEIGHTED_MODEL}")
model = DistilBertForSequenceClassification.from_pretrained(f"{USER_NAME}/{WEIGHTED_MODEL}")
model.eval()


def predict(message: str) -> dict:
    with torch.no_grad():
        inputs = tokenizer(message, return_tensors="pt", padding=True, truncation=True, max_length=256)
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)
        pred_index = torch.argmax(probs, dim=1).item()
        score = round(probs[0][pred_index].item(), 2)

    return {
        "Category": label_map[pred_index],
        "score": score
    }


def main():
    pass


if __name__ == '__main__':
    main()
