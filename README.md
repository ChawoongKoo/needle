# Needle

An interactive S&P 500 dashboard that lets you explore market history and query an AI financial analyst by double-clicking any point on the chart.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## Features

- **Interactive S&P 500 chart** — 10 years of historical index data rendered with [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- **AI-powered analysis** — double-click any data point to ask a financial analyst LLM what drove the market at that moment
- **Next.js API route** — LLM calls are proxied server-side, keeping API keys off the client
- **Dark OLED theme** — custom design system with Fira Code and Fira Sans

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, server components, API routes
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lightweight Charts v5](https://tradingview.github.io/lightweight-charts/) — financial charting library by TradingView
- [Hugging Face Inference API](https://huggingface.co/inference-api) — LLM backend (DeepSeek)
- S&P 500 data sourced from [Kaggle](https://www.kaggle.com/datasets/andrewmvd/sp-500-stocks)

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root with your Hugging Face API key:

```
HF_KEY=hf_your_key_here
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## How It Works

1. On load, the app fetches `sp500_index.csv` from the public directory and parses it into chart-compatible data
2. Lightweight Charts renders the data as an interactive area chart
3. Double-clicking a data point captures the date and index value, then opens an input box near your cursor
4. Your question is sent to a Next.js API route along with the date and value
5. The API route calls the Hugging Face Inference API and streams back a response from a financial analyst LLM
