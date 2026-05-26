import wikipediaapi
from supabase import create_client
from config import settings
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("Qwen/Qwen3-Embedding-0.6B")

def get_wikipedia_page(title: str) -> dict:
    wiki = wikipediaapi.Wikipedia(
        language="en",
        user_agent="needle-app/1.0"  # required, can be anything
    )
    page = wiki.page(title)
    
    if not page.exists():
        raise ValueError(f"Page '{title}' not found")
    
    return {
        "title": page.title,
        "content": page.text,  # clean plain text
        "source": page.fullurl
    }

def embed(text: str):
    #For query embeds, use a prompt like:
    #"Instruct: Given a web search query, retrieve relevant passages that answer the query\nQuery: What is the capital of China?"

    #For document embedding, it's fine to just embed it as is.
    if not model:
        raise ValueError("Model not loaded")
    embedding = model.encode(text)
    return embedding

def chunk_text(text: str, size=500, overlap=50) -> list[str]:
    words = text.split()
    return [
        " ".join(words[i:i+size])
        for i in range(0, len(words), size - overlap)
    ]

db = create_client(supabase_url=settings.SUPABASE_URL, supabase_key=settings.SUPABASE_SECRET)
us_economic_history = get_wikipedia_page("Economic history of the United States")
db.table("documents").insert(us_economic_history).execute()#keep supabase titles lowercase by default

for chunk in chunk_text(str(us_economic_history)):
    db.table("chunks").insert(chunk).execute()

embed("hello world")
