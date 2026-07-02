# Needle

An interactive S&P 500 dashboard that lets you explore market history and query an AI financial analyst by double-clicking any point on the chart. Uses a RAG pipeline to ground responses in real historical financial documents.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688)

<img width="1437" height="702" alt="Screenshot 2026-07-02 at 2 59 45 AM" src="https://github.com/user-attachments/assets/941f67e0-9480-49a1-9d2c-7726c567c600" />


## Features

- **Interactive S&P 500 chart** — 10 years of historical index data rendered with [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- **AI-powered analysis** — double-click any data point to ask a financial analyst LLM what drove the market at that moment
- **RAG pipeline** — user queries are embedded and matched against a vector database of historical financial documents, grounding LLM responses in real context
- **Next.js API route** — LLM calls are proxied server-side, keeping API keys off the client
- **Dark OLED theme** — custom design system with Fira Code and Fira Sans

## Tech Stack

### Frontend
- [Next.js 16](https://nextjs.org/) — App Router, server components, API routes
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lightweight Charts v5](https://tradingview.github.io/lightweight-charts/) — financial charting library by TradingView
- [Hugging Face Inference API](https://huggingface.co/inference-api) — LLM backend (DeepSeek)

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) — Python API server for the RAG pipeline
- [Sentence Transformers](https://www.sbert.net/) — Qwen3-Embedding-0.6B for query embedding
- [Supabase](https://supabase.com/) + [pgvector](https://github.com/pgvector/pgvector) — vector database for document storage and similarity search

### Data
- S&P 500 index data from [Kaggle](https://www.kaggle.com/datasets/andrewmvd/sp-500-stocks)

## Getting Started

### Frontend

1. Install dependencies:

```bash
cd frontend && npm install
```

2. Create `frontend/.env.local`:

```
HF_KEY=hf_your_key_here
BACKEND_ENDPOINT=http://127.0.0.1:8000
```

3. Run the dev server:

```bash
npm run dev
```

### Backend

1. Install dependencies:

```bash
cd backend && uv sync
```

2. Create `backend/.env`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET=your_supabase_service_key
```

3. Run the FastAPI server:

```bash
uvicorn main:app --reload
```

## How It Works

1. On load, the app fetches `sp500_index.csv` and renders it as an interactive area chart
2. Double-clicking a data point captures the date and index value, then opens an input box near your cursor
3. On submit, the user's message is sent to the Next.js API route along with the clicked date and S&P 500 value
4. The Next.js route calls the FastAPI backend's `/query_matches` endpoint with the message
5. FastAPI embeds the query using Qwen3-Embedding-0.6B and performs a cosine similarity search against the Supabase vector database
6. The top 3 matching document chunks are returned and injected into the LLM prompt as context
7. The Hugging Face LLM generates a grounded response and returns it to the frontend
