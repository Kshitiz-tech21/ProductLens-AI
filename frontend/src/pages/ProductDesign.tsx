import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE } from '../api/config';
import { User, ArrowRight, AlertCircle, RefreshCcw } from 'lucide-react';

interface Persona {
  id: number;
  name: string;
  age: number;
  description: string;
  pain_points: string;
}

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
    <div className="p-3 bg-rose-100 text-rose-600 rounded-full">
      <AlertCircle size={32} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900">Failed to load data</h3>
      <p className="text-slate-500">We couldn't retrieve the personas. This might be a temporary network issue.</p>
    </div>
    <button 
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
    >
      <RefreshCcw size={16} /> Retry Request
    </button>
  </div>
);

function ProductDesign() {
  const { data: personas, isLoading, isError, refetch } = useQuery({
    queryKey: ['personas'],
    queryFn: async (): Promise<Persona[]> => (await axios.get(`${API_BASE}/design/personas`)).data
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-lg w-1/4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Product Design</h2>
        <p className="text-slate-500">User personas and journey mapping</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {personas?.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-brand-100 p-3 rounded-full text-brand-600">
                <User size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{p.name}, {p.age}</h3>
                <p className="text-sm text-slate-500">{p.description}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Pain Points</h4>
                <p className="text-sm text-slate-600">{p.pain_points}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Ideal Journey</h4>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <span>Search</span> <ArrowRight size={12} /> 
                  <span>Cart</span> <ArrowRight size={12} /> 
                  <span>Checkout</span> <ArrowRight size={12} /> 
                  <span className="text-brand-600 font-bold">Payment Retry</span> <ArrowRight size={12} /> 
                  <span className="text-emerald-600 font-bold">Success</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDesign;
