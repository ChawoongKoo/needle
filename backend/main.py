from fastapi import FastAPI
from embed_query import router as embed_query_router

app = FastAPI()
app.include_router(embed_query_router)

@app.get('/hello')
def hello():
    print('hit fastapi backend')
    return {"body": "hello"}