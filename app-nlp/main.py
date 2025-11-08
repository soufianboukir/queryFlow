from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from app.faq_ai import FaqAI

app = FastAPI(title="FAQ AI v0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

faq_ai = FaqAI("app/data/faqs.csv")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FAQ AI v0 running"}

@app.get("/faq")
def get_faq(query: str = Query(..., description="User question")):
    return faq_ai.get_answer(query)
