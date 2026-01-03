
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Database, Download, RefreshCw, FileCheck, TableProperties, AlertCircle, Save, ExternalLink, Link2, Loader2 } from 'lucide-react';

const SYNC_MESSAGES = [
  "Connecting to Google Sheets API...",
  "Fetching coding test records...",
  "Retrieving daily attendance logs...",
  "Synthesizing student performance data...",
  "Finalizing data synchronization..."
];

const Sync: React.FC = () => {
  const { syncData, loading, lastSync, sheetConfig, updateSheetConfig } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState(sheetConfig);
  const [syncStatusIndex, setSyncStatusIndex] = useState(0);

  // Cycle through sync messages while loading
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setSyncStatusIndex((prev) => (prev + 1) % SYNC_MESSAGES.length);
      }, 1500);
    } else {
      setSyncStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSave = () => {
    updateSheetConfig(config);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header Sync Card */}
      <div className={`bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center relative overflow-hidden transition-all duration-500 ${loading ? 'ring-2 ring-indigo-500/20 shadow-indigo-100 scale-[1.01]' : ''}`}>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Database size={120} className={`text-indigo-600 ${loading ? 'animate-pulse' : ''}`} />
        </div>

        {/* Top Progress Bar (Visible during sync) */}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 overflow-hidden">
            <div className="h-full bg-indigo-600 animate-progress-indeterminate"></div>
          </div>
        )}
        
        <div className="relative z-10">
          <div className={`inline-flex items-center justify-center p-4 rounded-3xl mb-6 transition-colors duration-500 ${loading ? 'bg-indigo-600 text-white animate-bounce-subtle' : 'bg-indigo-50 text-indigo-600'}`}>
            <Database className={loading ? 'animate-pulse' : ''} size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Live Sheets Integration</h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
            Google Sheets မှ နောက်ဆုံးရဒေတာများကို ရယူရန်အောက်ပါခလုတ်ကို နှိပ်ပါ။ ဒေတာများသည် ကျောင်းသားတစ်ဦးချင်းစီ၏ Analytics များကို တိုက်ရိုက်သက်ရောက်စေမည်ဖြစ်ပါသည်။
          </p>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={syncData}
                disabled={loading}
                className={`relative overflow-hidden bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-80 group`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                )}
                <span className="relative z-10">
                  {loading ? 'Synchronizing...' : 'Sync Live Data'}
                </span>
              </button>
              
              <button className="border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-50 transition-all">
                <Download size={20} />
                Export CSV
              </button>
            </div>

            {/* Sync Progress Status Message */}
            {loading && (
              <div className="mt-2 flex flex-col items-center gap-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm font-medium text-indigo-600 italic">
                  {SYNC_MESSAGES[syncStatusIndex]}
                </p>
                <div className="flex gap-1.5 mt-1">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === syncStatusIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
            )}
            
            {!loading && lastSync && (
              <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 animate-in zoom-in-95 duration-500">
                <FileCheck size={16} className="text-emerald-600" />
                <span className="text-sm text-emerald-700 font-medium">
                  နောက်ဆုံး Sync လုပ်ခဲ့သည့်အချိန်: <span className="font-bold">{lastSync}</span>
                </span>
              </div>
            )}
            
            {!lastSync && !loading && (
              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
                <AlertCircle size={16} className="text-amber-600" />
                <span className="text-sm text-amber-700 font-medium">ကနဦး Sync လုပ်ရန် လိုအပ်ပါသည်။</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-200 rounded-lg">
              <Link2 size={20} className="text-slate-600" />
            </div>
            <h3 className="font-bold text-slate-800">Google Sheet IDs Configuration</h3>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              isEditing ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {isEditing ? <Save size={16} /> : <RefreshCw size={16} />}
            {isEditing ? 'Save Configuration' : 'Edit IDs'}
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Coding Tests Sheet ID</label>
              {isEditing ? (
                <input 
                  type="text"
                  value={config.testSheetId}
                  onChange={(e) => setConfig({ ...config, testSheetId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                  placeholder="Paste Sheet ID here..."
                />
              ) : (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                  <span className="text-sm font-mono text-slate-600 truncate mr-4">{sheetConfig.testSheetId}</span>
                  <a 
                    href={`https://docs.google.com/spreadsheets/d/${sheetConfig.testSheetId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance Daily Sheet ID</label>
              {isEditing ? (
                <input 
                  type="text"
                  value={config.attendanceSheetId}
                  onChange={(e) => setConfig({ ...config, attendanceSheetId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                  placeholder="Paste Sheet ID here..."
                />
              ) : (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                  <span className="text-sm font-mono text-slate-600 truncate mr-4">{sheetConfig.attendanceSheetId}</span>
                  <a 
                    href={`https://docs.google.com/spreadsheets/d/${sheetConfig.attendanceSheetId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 items-start">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-blue-700 leading-relaxed">
              <strong>Admin Note:</strong> Sheet ID ဆိုသည်မှာ Google Sheet URL အတွင်းရှိ <code>/d/</code> နှင့် <code>/edit</code> ကြားမှ စာသားများဖြစ်ပါသည်။ <br/>
              ဥပမာ - <code>https://docs.google.com/spreadsheets/d/<span className="font-black underline text-blue-900">17dG3mTQchr4oib6jIkHuFUwOITzjgRnlrKpvUkV4yMA</span>/edit</code>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SheetStatusCard 
          name="coding_tests" 
          id={sheetConfig.testSheetId} 
          active={!!lastSync} 
        />
        <SheetStatusCard 
          name="attendance_daily" 
          id={sheetConfig.attendanceSheetId} 
          active={!!lastSync} 
        />
      </div>

      <style>{`
        @keyframes progress-indeterminate {
          0% { left: -30%; width: 30%; }
          50% { left: 40%; width: 30%; }
          100% { left: 100%; width: 30%; }
        }
        .animate-progress-indeterminate {
          position: absolute;
          animation: progress-indeterminate 1.5s infinite linear;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

const SheetStatusCard: React.FC<{ name: string; id: string; active: boolean }> = ({ name, id, active }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-all">
          <TableProperties className="text-slate-400 group-hover:text-indigo-600 transition-all" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">{name}</h4>
          <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {id.substring(0, 10)}...</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${active ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
        {active ? 'Active' : 'Disconnected'}
      </span>
    </div>
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:bg-slate-100/50 transition-colors">
      <p className="text-[10px] text-slate-500 leading-relaxed">
        Connected via G-Visualization CSV Export Protocol. Public access required for seamless synchronization.
      </p>
    </div>
  </div>
);

export default Sync;
