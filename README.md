# Polymarket Data Analyzer

A React + Vite app for exploring prediction-market data: enter a market topic, and Gemini generates a plausible, fictional dataset that you can chart and interrogate through a chat interface.

Note: the data is AI-generated for study purposes, not fetched from the live Polymarket API.

## Features

- Generates a structured market dataset (outcomes, 90-day price history, current prices, volumes) from any topic via a Gemini JSON schema
- Interactive price-history chart built with Recharts
- Chat interface for asking follow-up questions about the generated dataset
- Typed data model shared across the chart, chat, and generation services

## Run locally

Prerequisite: Node.js

1. Install dependencies: `npm install`
2. Create `.env.local` and set `GEMINI_API_KEY` to your Gemini API key
3. Start the dev server: `npm run dev`
