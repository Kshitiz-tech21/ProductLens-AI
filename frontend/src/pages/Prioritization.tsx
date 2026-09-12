import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE } from '../api/config';

interface FeaturePriority {
  name: string;
  rice: number;
  ice: number;
  expected_revenue: number;
  cost: number;
}

function Prioritization() {
  const { data, isLoading } = useQuery({
    queryKey: ['priorities'],
    queryFn: async (): Promise<FeaturePriority[]> => (await axios.get(`${API_BASE}/analytics/prioritization`)).data
  });

  if (isLoading) return <div className="p-8 text-slate-500">Loading Priorities...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Feature Prioritization</h2>
        <p className="text-slate-500">RICE scoring for objective feature ranking</p>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-600 text-sm">
              <th className="px-6 py-4 font-semibold">Feature</th>
              <th className="px-6 py-4 font-semibold text-center">RICE Score</th>
              <th className="px-6 py-4 font-semibold text-center">ICE Score</th>
              <th className="px-6 py-4 font-semibold text-right">Expected Revenue</th>
              <th className="px-6 py-4 font-semibold text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data?.map((f) => (
              <tr key={f.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{f.name}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-xs font-bold">
                    {f.rice.toFixed(0)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-slate-600">{f.ice.toFixed(1)}</td>
                <td className="px-6 py-4 text-right text-slate-600">₹{(f.expected_revenue/1000).toFixed(0)}k</td>
                <td className="px-6 py-4 text-right text-slate-600">₹{(f.cost/1000).toFixed(0)}k</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Prioritization;
