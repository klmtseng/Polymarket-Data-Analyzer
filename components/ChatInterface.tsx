
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { MessageAuthor } from '../types';
import Loader from './Loader';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border flex flex-col h-[600px] mt-8">
      <div className="p-4 border-b border-brand-border">
        <h3 className="text-lg font-semibold text-brand-text">AI Data Analyst</h3>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.author === MessageAuthor.USER ? 'justify-end' : 'justify-start'}`}>
            {msg.author === MessageAuthor.AI && (
              <div className="bg-brand-secondary h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold">A</div>
            )}
            <div className={`max-w-md p-3 rounded-lg ${msg.author === MessageAuthor.USER ? 'bg-brand-primary text-white' : 'bg-brand-bg'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
             {msg.author === MessageAuthor.USER && (
              <div className="bg-brand-primary h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold">U</div>
            )}
          </div>
        ))}
        {isLoading && (
           <div className="flex items-start gap-3 justify-start">
             <div className="bg-brand-secondary h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold">A</div>
             <div className="max-w-md p-3 rounded-lg bg-brand-bg">
                <Loader size={5}/>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-brand-border flex items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the data..."
          className="flex-1 bg-brand-bg border border-brand-border rounded-lg p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-brand-primary hover:bg-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
        >
          Send
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
