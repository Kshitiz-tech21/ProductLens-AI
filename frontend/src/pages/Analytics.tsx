import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE } from '../api/config';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['funnel'],
    queryFn: async () => (await axios.get(`${API_BASE}/analytics/funnel`)).data
  });

  if (isLoading) return <div className="p-8 text-slate-500">Loading Analytics...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Product Analytics</h2>
        <p className="text-slate-500">Conversion funnel and user behavior tracking</p>
      </header>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Conversion Funnel</h3>
        <div className="space-y-4">
          {data?.stages?.map((stage: any, i: number) => (
            <div key={stage.name} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-600">{stage.name}</span>
                <span className="text-slate-400">{stage.conversion.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-brand-500 h-full transition-all duration-1000" 
                  style={{ width: `${stage.conversion}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
