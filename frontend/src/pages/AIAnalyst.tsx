import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Search, AlertTriangle, CheckCircle, ArrowRight, Info } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

function AIAnalyst() {
  const [query, setQuery] = useState('');
  const { data: result, isLoading } = useQuery({
    queryKey: ['investigation', query],
    queryFn: async () => {
      if (!query) return null;
      const res = await axios.post(`${API_BASE}/ai/investigate?question=${encodeURIComponent(query)}`);
      return res.data;
    },
    enabled: !!query
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">AI Product Analyst</h2>
        <p className="text-slate-500">Ask a question about your product metrics and customer signals</p>
      </header>

      <div className="relative">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Why did checkout conversion fall this month?"
          className="w-full p-4 pl-12 rounded-2xl border border-slate-200 shadow-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all text-lg"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </div>

      {isLoading && <div className="text-center py-12 animate-pulse text-slate-500">AI is analyzing signals...</div>}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 mb-4">
                <AlertTriangle size={20} />
                <h3 className="font-bold text-lg">{result.issue}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                The primary decline is driven by <span className="font-bold text-slate-900">{result.affected_group}</span>, 
                contributing to <span className="font-bold text-slate-900">{result.contribution}</span> of the total drop.
              </p>
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Root Cause</h4>
                <p className="text-lg font-semibold text-slate-900">{result.root_cause}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Info size={20} className="text-brand-500" />
                Evidence Chain
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="bg-brand-100 text-brand-600 p-1 rounded">1</div>
                  <p className="text-sm text-slate-600">Detected anomaly: <span className="font-bold">{result.correlated_signal}</span></p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <div className="bg-brand-100 text-brand-600 p-1 rounded">2</div>
                  <p className="text-sm text-slate-600">VOC Signal: <span className="font-bold">{result.feedback}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-brand-600 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold mb-4">Confidence Score</h3>
              <div className="text-4xl font-black mb-2">{(result.confidence * 100).toFixed(0)}%</div>
              <p className="text-brand-100 text-sm">Based on 3 cross-correlated signals</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold mb-4">Recommendation</h3>
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium mb-4">
                High Priority: Fix Mobile Payment Flow
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                View ROI <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAnalyst;
