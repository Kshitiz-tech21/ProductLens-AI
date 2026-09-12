import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE } from '../api/config';
import { CheckCircle, XCircle, Search } from 'lucide-react';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  expected_impact: string;
  revenue_impact: number;
  confidence: number;
}

function Recommendations() {
  const { data: recs, isLoading } = useQuery({
    queryKey: ['recs'],
    queryFn: async (): Promise<Recommendation[]> => (await axios.get(`${API_BASE}/governance/recommendations`)).data
  });

  if (isLoading) return <div className="p-8 text-slate-500">Loading Recommendations...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Strategic Recommendations</h2>
        <p className="text-slate-500">AI-generated product improvements awaiting human approval</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {recs?.map((rec) => (
          <div key={rec.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{rec.title}</h3>
                <p className="text-slate-600 mt-1">{rec.description}</p>
              </div>
              <div className="flex gap-4">
                <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-500">
                  Impact: {rec.expected_impact}
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-500">
                  Revenue: ₹{(rec.revenue_impact/100000).toFixed(1)}L/mo
                </div>
                <div className="px-3 py-1 bg-brand-100 rounded-full text-xs font-medium text-brand-700">
                  Confidence: {(rec.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                <CheckCircle size={24} />
              </button>
              <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Reject">
                <XCircle size={24} />
              </button>
              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Investigate">
                <Search size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
