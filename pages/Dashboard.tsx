
import React, { useMemo, useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useData } from '../context/DataContext';
import { 
  TrendingUp, Users, CheckCircle, AlertTriangle, 
  Loader2, Sparkles, BrainCircuit, Lightbulb, 
  ChevronRight, Zap, ChevronLeft, Heart, ShieldCheck, Rocket
} from 'lucide-react';
import { generateClassReport } from '../services/geminiService';

const RANKINGS_PER_PAGE = 5;

const Dashboard: React.FC = () => {
  const { students, tests, attendance, loading } = useData();
  const [classReport, setClassReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  
  // Pagination State for Ranking
  const [rankingPage, setRankingPage] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('class_ai_report');
    if (saved) setClassReport(JSON.parse(saved));
  }, []);

  const avgScore = tests.reduce((acc, t) => acc + (t.total || 0), 0) / (tests.length || 1);
  const attendanceRate = (attendance.filter(a => a.attendance === 'Class').length / (attendance.length || 1)) * 100;

  const chartData = useMemo(() => {
    return tests.map(t => ({
      name: t.name || 'Unknown',
      total: t.total || 0,
      attendance: attendance.filter(a => a.name === t.name && a.attendance === 'Class').length * 20
    }));
  }, [tests, attendance]);

  const topPerformers = useMemo(() => {
    return [...tests].sort((a, b) => (b.total || 0) - (a.total || 0));
  }, [tests]);

  // Pagination Logic for Ranking
  const totalRankingPages = Math.ceil(topPerformers.length / RANKINGS_PER_PAGE);
  const paginatedRankings = useMemo(() => {
    const start = (rankingPage - 1) * RANKINGS_PER_PAGE;
    return topPerformers.slice(start, start + RANKINGS_PER_PAGE);
  }, [topPerformers, rankingPage]);

  const handleGenerateClassReport = async () => {
    setReportLoading(true);
    try {
      const report = await generateClassReport(students, tests, attendance);
      setClassReport(report);
      localStorage.setItem('class_ai_report', JSON.stringify(report));
    } catch (err) {
      console.error(err);
      alert("Class report generation failed.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={students.length.toString()} 
          icon={<Users className="text-blue-600" />} 
          trend="Sync Active"
          color="bg-blue-50"
        />
        <StatCard 
          title="Avg. Coding Score" 
          value={avgScore.toFixed(1)} 
          icon={<TrendingUp className="text-emerald-600" />} 
          trend="Realtime"
          color="bg-emerald-50"
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${attendanceRate.toFixed(1)}%`} 
          icon={<CheckCircle className="text-amber-600" />} 
          trend="Aggregated"
          color="bg-amber-50"
        />
        <StatCard 
          title="Critical Alerts (< 70 Mark)" 
          value={tests.filter(t => t.total < 70).length.toString()} 
          icon={<AlertTriangle className="text-rose-600" />} 
          trend="Needs Analysis"
          color="bg-rose-50"
        />
      </div>

      {/* AI Class Intelligence Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden relative shadow-2xl shadow-indigo-100">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
              <BrainCircuit size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black">AI Class Performance Intelligence</h3>
              <p className="text-indigo-200 text-sm max-w-xl mt-1">
                အတန်းတစ်ခုလုံး၏ ဒေတာများကို သုံးသပ်၍ သင်ကြားရေးဆိုင်ရာ အကြံပြုချက်များ နှင့် တိုးတက်ရေး အကြံဉာဏ်များ။
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {classReport?.classHealthScore && (
              <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                <Heart size={16} className="text-rose-400 fill-rose-400" />
                <div className="text-left">
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Health Score</p>
                  <p className="text-lg font-black">{classReport.classHealthScore}%</p>
                </div>
              </div>
            )}
            <button 
              onClick={handleGenerateClassReport}
              disabled={reportLoading}
              className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
            >
              {reportLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-indigo-600" />}
              Analyze Trends
            </button>
          </div>
        </div>

        {reportLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
             <Loader2 className="animate-spin text-white opacity-50" size={40} />
             <p className="text-indigo-100 animate-pulse font-medium">အတန်းတစ်ခုလုံး၏ ဒေတာများကို တွက်ချက်နေပါသည်...</p>
          </div>
        ) : classReport ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                <h5 className="flex items-center gap-2 font-bold mb-4 text-rose-300">
                  <AlertTriangle size={16} /> Weak Topics
                </h5>
                <ul className="space-y-2">
                  {classReport.weakTopics.map((topic: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-indigo-50">
                      <ChevronRight size={14} className="text-indigo-400" /> {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                <h5 className="flex items-center gap-2 font-bold mb-4 text-emerald-300">
                  <CheckCircle size={16} /> Attendance Insight
                </h5>
                <p className="text-sm text-indigo-50 leading-relaxed italic">
                  {classReport.attendanceInsight}
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                <h5 className="flex items-center gap-2 font-bold mb-4 text-amber-300">
                  <Lightbulb size={16} /> Teaching Advice
                </h5>
                <ul className="space-y-2">
                  {classReport.teachingAdvice.map((adv: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-indigo-50 font-medium">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div> {adv}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Categorized Improvement Ideas */}
            <div className="space-y-4">
              <h5 className="flex items-center gap-2 font-bold text-indigo-200">
                <Zap size={18} className="text-amber-400" /> AI-Generated Class Improvement Ideas (အတန်းတစ်ခုလုံးအတွက် တိုးတက်ရေး အကြံပြုချက်များ)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {classReport.improvementIdeas?.map((item: any, i: number) => (
                  <div key={i} className="bg-white/10 p-6 rounded-3xl border border-white/10 hover:bg-white/15 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        item.category === 'Technical' ? 'bg-blue-500/20 text-blue-300' :
                        item.category === 'Discipline' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {item.category}
                      </span>
                      {item.category === 'Technical' ? <Rocket size={16} className="text-blue-400" /> :
                       item.category === 'Discipline' ? <ShieldCheck size={16} className="text-rose-400" /> :
                       <Zap size={16} className="text-emerald-400" />}
                    </div>
                    <p className="text-sm text-indigo-50 leading-relaxed font-bold">
                      {item.idea}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
             <p className="text-white/40 text-sm italic">Generate AI Insights for Class Performance</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Coding Test Performance</h3>
          {loading && (
            <div className="absolute inset-x-0 bottom-0 top-16 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center animate-pulse">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="text-blue-500 animate-spin" size={24} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Updating Chart...</span>
              </div>
            </div>
          )}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance Trend ( engagement )</h3>
          {loading && (
            <div className="absolute inset-x-0 bottom-0 top-16 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center animate-pulse">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="text-emerald-500 animate-spin" size={24} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Updating Trend...</span>
              </div>
            </div>
          )}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="colorAttendanceBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar 
                  dataKey="attendance" 
                  fill="url(#colorAttendanceBar)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Top Performers Ranking (ရမှတ်အစဉ်လိုက်)</h3>
          {loading && <Loader2 className="animate-spin text-slate-400" size={16} />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-slate-100">Name</th>
                <th className="px-6 py-4 border-b border-slate-100">Total Mark</th>
                <th className="px-6 py-4 border-b border-slate-100">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-slate-100 ${loading ? 'opacity-50' : ''}`}>
              {paginatedRankings.map((test, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-50/80 text-indigo-700 font-bold text-sm shadow-sm border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      {test.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-tight ${test.total >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {test.total}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-xs font-bold">
                      <div className={`w-2 h-2 rounded-full ${test.total >= 85 ? 'bg-emerald-500 animate-pulse' : test.total >= 70 ? 'bg-blue-500' : 'bg-rose-500'}`}></div> 
                      <span className={test.total >= 85 ? 'text-emerald-600' : test.total >= 70 ? 'text-blue-600' : 'text-rose-600'}>
                        {test.total >= 85 ? 'Excellent' : test.total >= 70 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedRankings.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No rankings available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls for Rankings */}
        {totalRankingPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium italic">
              Showing page {rankingPage} of {totalRankingPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRankingPage(p => Math.max(1, p - 1))}
                disabled={rankingPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalRankingPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setRankingPage(pageNum)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                      rankingPage === pageNum 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setRankingPage(p => Math.min(totalRankingPages, p + 1))}
                disabled={rankingPage === totalRankingPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string; color: string }> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-50 text-slate-500 rounded-full">
        {trend}
      </span>
    </div>
    <p className="text-slate-500 text-xs font-medium mb-1">{title}</p>
    <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
  </div>
);

export default Dashboard;
