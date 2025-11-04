
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MarketData } from '../types';

interface MarketChartProps {
  data: MarketData;
}

const COLORS = ['#38bdf8', '#818cf8', '#f472b6', '#4ade80'];

const MarketChart: React.FC<MarketChartProps> = ({ data }) => {
  const chartData = data.outcomes[0].priceHistory.map((_, index) => {
    const point: { date: string; [key: string]: string | number } = {
      date: data.outcomes[0].priceHistory[index].date,
    };
    data.outcomes.forEach(outcome => {
      point[outcome.name] = outcome.priceHistory[index]?.price ?? 0;
    });
    return point;
  });

  return (
    <div className="bg-brand-surface rounded-lg p-6 border border-brand-border">
      <h2 className="text-xl font-bold mb-4 text-brand-text">{data.marketTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {data.outcomes.map((outcome, index) => (
          <div key={outcome.name} className="bg-brand-bg p-4 rounded-md border border-brand-border/50">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-lg" style={{ color: COLORS[index % COLORS.length] }}>
                    {outcome.name}
                </span>
                <span className="text-2xl font-bold">
                    ${outcome.currentPrice.toFixed(2)}
                </span>
            </div>
            <p className="text-sm text-brand-text-secondary mt-1">Volume: ${outcome.volume.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" domain={[0, 1]} tick={{ fontSize: 12 }} />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155', 
                    color: '#e2e8f0' 
                }}
                labelStyle={{ color: '#94a3b8' }}
            />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
            {data.outcomes.map((outcome, index) => (
                <Line 
                    key={outcome.name} 
                    type="monotone" 
                    dataKey={outcome.name} 
                    stroke={COLORS[index % COLORS.length]} 
                    strokeWidth={2}
                    dot={false}
                />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketChart;
