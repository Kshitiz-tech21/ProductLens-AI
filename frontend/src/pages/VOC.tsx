import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:8000/api';

function VOC() {
  const { data, isLoading } = useQuery({
    queryKey: ['voc'],
    queryFn: async () => (await axios.get(`${API_BASE}/dashboard/voc/summary`)).data
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Voice of Customer</h2>
        <p className="text-slate-500">Sentiment and topic analysis from reviews and support tickets</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Issue Frequency by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#007fff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Negative Sentiment Ratio</h3>
          <div className="space-y-4">
            {data?.map(item => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">{item.category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full" 
                      style={{ width: `${item.negative_ratio * 100}%` }} 
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400">{(item.negative_ratio * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VOC;
