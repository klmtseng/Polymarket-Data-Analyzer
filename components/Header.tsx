
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-8 border-b border-brand-border bg-brand-surface/50 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z" />
        </svg>
        Polymarket Data Analyzer
      </h1>
    </header>
  );
};

export default Header;
