from fastapi import APIRouter
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

from config import settings
from supabase import create_client

db = create_client(supabase_url=settings.SUPABASE_URL, supabase_key=settings.SUPABASE_SECRET)
model = SentenceTransformer("Qwen/Qwen3-Embedding-0.6B")

class UserQuery(BaseModel):
    message: str

router = APIRouter()

@router.post('/query_matches')
def query_matches(req: UserQuery):
    print("hit embed query at backend")
    text = req.message
    embedding = model.encode(text, prompt_name="query").tolist()
    
    matches = db.rpc("match_documents", {
        "query_embedding": embedding,
        "match_count": 3
    }).execute()

    return {"matches": matches.data}