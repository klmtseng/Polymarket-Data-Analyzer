
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { MarketData, ChatMessage } from '../types';
import { MessageAuthor } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
let chat: Chat | null = null;

const marketDataSchema = {
  type: Type.OBJECT,
  properties: {
    marketTitle: {
      type: Type.STRING,
      description: "A descriptive title for the prediction market.",
    },
    outcomes: {
      type: Type.ARRAY,
      description: "An array of possible outcomes for the market, typically 'Yes' and 'No'.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the outcome (e.g., 'Yes').",
          },
          priceHistory: {
            type: Type.ARRAY,
            description: "An array of historical price points for this outcome over the last 90 days.",
            items: {
              type: Type.OBJECT,
              properties: {
                date: {
                  type: Type.STRING,
                  description: "The date for the price point in 'YYYY-MM-DD' format.",
                },
                price: {
                  type: Type.NUMBER,
                  description: "The price of the outcome on that date, between 0.0 and 1.0.",
                },
              },
              required: ['date', 'price'],
            },
          },
          currentPrice: {
            type: Type.NUMBER,
            description: "The most recent price of the outcome.",
          },
          volume: {
            type: Type.NUMBER,
            description: "The total trading volume for this outcome.",
          },
        },
        required: ['name', 'priceHistory', 'currentPrice', 'volume'],
      },
    },
  },
  required: ['marketTitle', 'outcomes'],
};

export const fetchMarketData = async (topic: string): Promise<MarketData> => {
  const prompt = `
    You are a Polymarket data analyst. Based on the topic "${topic}", generate a realistic-looking but fictional set of historical data for a binary prediction market ('Yes' and 'No' outcomes).
    
    The data should cover the last 90 days. The prices for 'Yes' and 'No' at any given date should roughly sum to 1.0. The data should show plausible fluctuations.
    
    Return the data in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: marketDataSchema,
      },
    });
    
    const jsonString = response.text.trim();
    const data = JSON.parse(jsonString);

    // Reset chat history when new data is fetched
    chat = null;
    
    return data as MarketData;
  } catch (error) {
    console.error("Error fetching or parsing market data:", error);
    throw new Error("Failed to generate market data. The AI might be unable to create data for this topic. Please try another one.");
  }
};

export const analyzeMarketData = async (
  userMessage: string,
  marketData: MarketData
): Promise<string> => {
    if (!chat) {
        const systemInstruction = `You are a financial analyst specializing in prediction markets. Your role is to analyze the provided market data and answer user questions based *only* on that data. Do not use external knowledge. Be concise, data-driven, and insightful. Here is the market data you will be analyzing: ${JSON.stringify(marketData)}`;

        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
        });
    }

  try {
    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("Error analyzing market data:", error);
    throw new Error("The AI failed to provide an analysis. Please try again.");
  }
};
