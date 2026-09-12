import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

function Experiments() {
  const { data, isLoading } = useQuery({
    queryKey: ['exp-1'],
    queryFn: async () => (await axios.get(`${API_BASE}/analytics/experiments/1/analysis`)).data
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">A/B Experiments</h2>
        <p className="text-slate-500">Statistical validation of product hypotheses</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase mb-2">Control</span>
          <div className="text-4xl font-black text-slate-900 mb-2">{(data?.control_rate * 100).toFixed(2)}%</div>
          <p className="text-sm text-slate-500">Conversion Rate</p>
        </div>

        <div className="bg-brand-50 p-8 rounded-2xl border border-brand-200 shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold text-brand-600 uppercase mb-2">Variant A</span>
          <div className="text-4xl font-black text-brand-600 mb-2">{(data?.variant_rate * 100).toFixed(2)}%</div>
          <p className="text-sm text-brand-500">Conversion Rate</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase mb-2">Relative Lift</span>
          <div className="text-4xl font-black text-emerald-600 mb-2">{(data?.lift * 100).toFixed(2)}%</div>
          <p className="text-sm text-slate-500">Statistical Improvement</p>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold mb-2">Statistical Significance</h3>
          <p className="text-slate-400">p-value: <span className="text-white font-mono">{data?.p_value.toFixed(4)}</span></p>
        </div>
        <div className="text-right">
          <div className={`px-4 py-2 rounded-full font-bold text-sm ${data?.significant ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {data?.significant ? 'Statistically Significant' : 'Not Significant'}
          </div>
          <p className="mt-2 text-sm text-slate-400">Recommendation: <span className="text-white font-medium">{data?.recommendation}</span></p>
        </div>
      </div>
    </div>
  );
}

export default Experiments;
