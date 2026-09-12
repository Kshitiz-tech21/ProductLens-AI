import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const API_BASE = 'http://localhost:8000/api';

interface KPIValue {
  value: number;
  diff: number;
}

interface Summary {
  [key: string]: KPIValue;
}

const KPICard = ({ label, value, diff, isPositive }: { label: string; value: string; diff: number; isPositive: boolean }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <div className="flex items-baseline gap-2 mt-2">
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <span className={`text-xs font-bold flex items-center ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(diff).toFixed(1)}%
      </span>
    </div>
  </div>
);

function Dashboard() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: async (): Promise<Summary> => (await axios.get(`${API_BASE}/dashboard/summary`)).data
  });

  if (isLoading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-32 bg-slate-200 rounded-xl w-full" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Executive Overview</h2>
        <p className="text-slate-500">Real-time product health and business KPIs</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary && Object.entries(summary).map(([key, data]) => (
          <KPICard 
            key={key} 
            label={key} 
            value={typeof data.value === 'number' && data.value > 1000 ? `₹${(data.value/100000).toFixed(1)}L` : data.value.toFixed(1) + '%'} 
            diff={data.diff} 
            isPositive={data.diff > 0} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{name: 'Jan', val: 40}, {name: 'Feb', val: 30}, {name: 'Mar', val: 60}, {name: 'Apr', val: 80}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="val" stroke="#007fff" fill="#007fff20" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Conversion Funnel</h3>
          <div className="space-y-4">
            {['Landing', 'View', 'Cart', 'Checkout', 'Payment', 'Purchase'].map((stage, i) => (
              <div key={stage} className="relative">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-600">{stage}</span>
                  <span className="text-slate-400">{100 - (i * 15)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full transition-all duration-1000" style={{ width: `${100 - (i * 15)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
