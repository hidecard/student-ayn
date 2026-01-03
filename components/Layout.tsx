
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, ClipboardList, Settings, Database, BrainCircuit, FileText } from 'lucide-react';
import AIChatWidget from './AIChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard (ပင်မစာမျက်နှာ)', path: '/', icon: LayoutDashboard },
    { name: 'Students (ကျောင်းသားများ)', path: '/students', icon: Users },
    { name: 'AI Reports (အစီရင်ခံစာများ)', path: '/reports', icon: BrainCircuit },
    { name: 'Tests (ကုဒ်ဖြေဆိုမှုများ)', path: '/tests', icon: ClipboardList },
    { name: 'Data Sync (ဒေတာရယူရန်)', path: '/sync', icon: Database },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <GraduationCap className="text-blue-400 w-8 h-8" />
          <h1 className="font-bold text-lg leading-tight">AI Coding Intelligence</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">AI Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Gemini 3.0 Live</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            {menuItems.find(i => i.path === location.pathname)?.name || 'Detail Analytics'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-l pl-4 ml-2">
              <div className="text-right">
                <p className="text-xs font-bold">Admin Panel</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Instructor View</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                <Users size={16} className="text-slate-500" />
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto pb-24">
          {children}
        </div>
      </main>

      {/* Floating AI Assistant Widget */}
      <AIChatWidget />
    </div>
  );
};

export default Layout;
