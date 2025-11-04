
export interface PricePoint {
  date: string;
  price: number;
}

export interface Outcome {
  name: string;
  priceHistory: PricePoint[];
  currentPrice: number;
  volume: number;
}

export interface MarketData {
  marketTitle: string;
  outcomes: Outcome[];
}

export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
}
