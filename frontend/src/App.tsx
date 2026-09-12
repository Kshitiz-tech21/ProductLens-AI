import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  BrainCircuit, 
  MessageSquare, 
  ListChecks, 
  FlaskConical, 
  CheckCircle2, 
  FileText, 
  Palette, 
  Settings 
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AIAnalyst from './pages/AIAnalyst';
import VOC from './pages/VOC';
import Prioritization from './pages/Prioritization';
import Experiments from './pages/Experiments';
import Recommendations from './pages/Recommendations';
import PRD from './pages/PRD';
import ProductDesign from './pages/ProductDesign';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/ai-analyst', label: 'AI Analyst', icon: BrainCircuit },
  { to: '/customer-intelligence', label: 'VOC', icon: MessageSquare },
  { to: '/prioritization', label: 'Prioritization', icon: ListChecks },
  { to: '/experiments', label: 'Experiments', icon: FlaskConical },
  { to: '/recommendations', label: 'Recommendations', icon: CheckCircle2 },
  { to: '/prd', label: 'PRD', icon: FileText },
  { to: '/product-design', label: 'Product Design', icon: Palette },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 text-brand-600 font-black text-xl tracking-tight">
              <BrainCircuit size={28} />
              <span>ProductLens AI</span>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link 
                key={item.to} 
                to={item.to} 
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-analyst" element={<AIAnalyst />} />
            <Route path="/customer-intelligence" element={<VOC />} />
            <Route path="/prioritization" element={<Prioritization />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/prd" element={<PRD />} />
            <Route path="/product-design" element={<ProductDesign />} />
            <Route path="/settings" element={<div className="text-2xl font-bold">Settings</div>} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
