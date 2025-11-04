
import React, { useState } from 'react';
import Header from './components/Header';
import MarketChart from './components/MarketChart';
import ChatInterface from './components/ChatInterface';
import Loader from './components/Loader';
import { fetchMarketData, analyzeMarketData } from './services/geminiService';
import type { MarketData, ChatMessage } from './types';
import { MessageAuthor } from './types';

const App: React.FC = () => {
  const [marketTopic, setMarketTopic] = useState<string>('');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketTopic.trim()) return;

    setIsLoadingData(true);
    setError(null);
    setMarketData(null);
    setChatHistory([]);

    try {
      const data = await fetchMarketData(marketTopic);
      setMarketData(data);
      setChatHistory([{
        author: MessageAuthor.AI,
        text: "I've generated the historical data for this market. What would you like to know?"
      }]);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!marketData) return;

    const newHistory: ChatMessage[] = [...chatHistory, { author: MessageAuthor.USER, text: message }];
    setChatHistory(newHistory);
    setIsLoadingAnalysis(true);

    try {
      const aiResponse = await analyzeMarketData(message, marketData);
      setChatHistory([...newHistory, { author: MessageAuthor.AI, text: aiResponse }]);
    } catch (err: any) {
      setChatHistory([...newHistory, { author: MessageAuthor.SYSTEM, text: `Error: ${err.message}` }]);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-brand-surface rounded-lg p-6 border border-brand-border">
          <h2 className="text-xl font-semibold mb-4 text-brand-text">Enter a Polymarket Topic</h2>
          <p className="text-brand-text-secondary mb-4">
            Enter a topic for a prediction market (e.g., "Will AI achieve AGI by 2030?"). The AI will generate a plausible, fictional dataset for you to analyze.
          </p>
          <form onSubmit={handleFetchData} className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={marketTopic}
              onChange={(e) => setMarketTopic(e.target.value)}
              placeholder="e.g., Will commercial flights to Mars happen by 2050?"
              className="w-full bg-brand-bg border border-brand-border rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
              disabled={isLoadingData}
            />
            <button
              type="submit"
              disabled={isLoadingData || !marketTopic.trim()}
              className="w-full sm:w-auto bg-brand-primary hover:bg-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoadingData ? <Loader size={5}/> : 'Generate Data'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mt-8">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {isLoadingData && (
          <div className="flex flex-col items-center justify-center text-center p-16 mt-8 bg-brand-surface rounded-lg border border-brand-border">
            <Loader text="Generating realistic market data..." />
            <p className="mt-4 text-brand-text-secondary">This may take a moment...</p>
          </div>
        )}

        {marketData && (
          <div className="mt-8">
            <MarketChart data={marketData} />
            <ChatInterface 
                messages={chatHistory} 
                onSendMessage={handleSendMessage}
                isLoading={isLoadingAnalysis}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
