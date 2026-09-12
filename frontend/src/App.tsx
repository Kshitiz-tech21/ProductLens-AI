import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, BarChart3, BrainCircuit, MessageSquare, ListOrdered, Zap, FileText, UserCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AIAnalyst from './pages/AIAnalyst';
import Prioritization from './pages/Prioritization';
import VOC from './pages/VOC';
import Experiments from './pages/Experiments';
import Recommendations from './pages/Recommendations';
import PRD from './pages/PRD';
import ProductDesign from './pages/ProductDesign';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors">
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

function App() {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-2">
        <div className="px-4 py-6 mb-4">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="text-brand-500" fill="currentColor" />
            ProductLens AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">Enterprise Intelligence</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Executive Dashboard" />
          <SidebarItem to="/analytics" icon={BarChart3} label="Product Analytics" />
          <SidebarItem to="/ai-analyst" icon={BrainCircuit} label="AI Analyst" />
          <SidebarItem to="/customer-intelligence" icon={MessageSquare} label="Voice of Customer" />
          <SidebarItem to="/prioritization" icon={ListOrdered} label="Prioritization" />
          <SidebarItem to="/experiments" icon={Zap} label="Experiments" />
          <SidebarItem to="/recommendations" icon={FileText} label="Recommendations" />
          <SidebarItem to="/product-design" icon={UserCircle} label="Product Design" />
        </nav>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Dashboard />} /> {/* Shared for now */}
          <Route path="/ai-analyst" element={<AIAnalyst />} />
          <Route path="/customer-intelligence" element={<VOC />} />
          <Route path="/prioritization" element={<Prioritization />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/prd" element={<PRD />} />
          <Route path="/product-design" element={<ProductDesign />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
