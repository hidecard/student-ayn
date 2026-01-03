
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, Calendar, CheckCircle2, Clock, 
  BrainCircuit, Sparkles, Loader2, AlertCircle, 
  Lightbulb, Target, ChevronRight, BarChart3, TrendingUp,
  History, Download, Copy, Check, BookOpen, Map, Flag, Compass,
  Users, ChevronLeft, Zap, HeartPulse, Code2, Terminal, Cpu, Layers
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { generateStudentReport } from '../services/geminiService';
import { AIReport } from '../types';

interface StoredReport extends AIReport {
  timestamp: string;
}

const LOGS_PER_PAGE = 5;

// Icons for technical drills
const DRILL_ICONS = [
  <Terminal size={20} />,
  <Cpu size={20} />,
  <Layers size={20} />,
  <Zap size={20} />,
  <Code2 size={20} />
];

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { students, attendance, tests } = useData();
  const [report, setReport] = useState<StoredReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Pagination State
  const [attendancePage, setAttendancePage] = useState(1);

  const student = students.find((s) => s.student_id === id);

  useEffect(() => {
    if (id) {
      const savedReport = localStorage.getItem(`ai_report_${id}`);
      if (savedReport) {
        setReport(JSON.parse(savedReport));
      }
    }
  }, [id]);

  const attendanceRecords = useMemo(() => 
    attendance.filter((a) => a.name === student?.student_name),
    [attendance, student]
  );

  // Pagination Logic
  const totalAttendancePages = Math.ceil(attendanceRecords.length / LOGS_PER_PAGE);
  const paginatedAttendance = useMemo(() => {
    const startIndex = (attendancePage - 1) * LOGS_PER_PAGE;
    return attendanceRecords.slice(startIndex, startIndex + LOGS_PER_PAGE);
  }, [attendanceRecords, attendancePage]);
  
  const studentTests = useMemo(() => 
    tests.filter((t) => t.name === student?.student_name),
    [tests, student]
  );

  const skillData = useMemo(() => {
    if (!studentTests.length) return [];
    const latestTest = [...studentTests].sort((a, b) => b.no - a.no)[0];
    if (!latestTest) return [];

    return [
      { subject: 'Q1: Syntax', score: latestTest.q1, full: 20 },
      { subject: 'Q2: Logic', score: latestTest.q2, full: 20 },
      { subject: 'Q3: Algorithm', score: latestTest.q3, full: 20 },
      { subject: 'Q4: UI/UX', score: latestTest.q4, full: 20 },
      { subject: 'Q5: Project', score: latestTest.q5, full: 20 },
    ];
  }, [studentTests]);

  if (!student) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800">ကျောင်းသား ရှာမတွေ့ပါ</h3>
        <Link to="/students" className="text-blue-600 hover:underline mt-4 inline-block font-medium">
          ကျောင်းသားစာရင်းသို့ ပြန်သွားရန်
        </Link>
      </div>
    );
  }

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const aiResponse = await generateStudentReport(student, studentTests, attendanceRecords);
      const newReport: StoredReport = {
        ...aiResponse,
        studentId: id!,
        timestamp: new Date().toLocaleString('my-MM', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setReport(newReport);
      localStorage.setItem(`ai_report_${id}`, JSON.stringify(newReport));
    } catch (error) {
      console.error("AI Report generation failed:", error);
      alert("AI Intelligence Report ထုတ်ယူရာတွင် အမှားအယွင်းရှိနေပါသည်။");
    } finally {
      setReportLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    const text = `Student: ${student.student_name}\n\n[Pedagogical Roadmap]\n${report.detailedPlan}\n\n[Action Steps]\n${report.weeklyActionPlan.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Link to="/students" className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all text-slate-500 shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-slate-900">{student.student_name}</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">{student.email} • ID: {student.student_id}</p>
          </div>
        </div>
        
        <button 
          onClick={handleGenerateReport}
          disabled={reportLoading}
          className="relative overflow-hidden bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50 group active:scale-95"
        >
          {reportLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles className="group-hover:rotate-12 transition-transform" size={18} />}
          {report ? 'Refresh Deep Intelligence' : 'Generate Full Pedagogical Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users size={20} className="text-indigo-600" /> Student Profile
            </h4>
            <div className="space-y-5">
              <InfoBlock label="Phone" value={student.phone} />
              <InfoBlock label="Email" value={student.email} />
              <InfoBlock label="Attendance Rate" value={`${Math.round((attendanceRecords.filter(r => r.attendance === 'Class').length / Math.max(1, attendanceRecords.length)) * 100)}%`} highlight />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h5 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-600" /> Technical Proficiency
            </h5>
            <div className="h-[220px] w-full">
              {skillData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData} layout="vertical" margin={{ left: -10 }}>
                    <XAxis type="number" domain={[0, 20]} hide />
                    <YAxis dataKey="subject" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={80} />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                      {skillData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score >= 15 ? '#10b981' : entry.score >= 10 ? '#3b82f6' : '#f43f5e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 italic border-2 border-dashed border-slate-50 rounded-2xl">
                  <p className="text-xs">Data unavailable</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Intelligence Content */}
        <div className="lg:col-span-8 space-y-8">
          {reportLoading ? (
            <div className="bg-white p-20 rounded-[2rem] border border-indigo-100 shadow-sm flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-indigo-50 rounded-full animate-ping absolute inset-0 opacity-20"></div>
                <BrainCircuit className="text-indigo-600 w-16 h-16 animate-pulse relative z-10" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-800 mb-2">Deep Pedagogical Synthesis...</h4>
                <p className="text-slate-500 max-w-sm font-medium">ကျောင်းသား၏ Coding Skills နှင့် စိတ်ပိုင်းဆိုင်ရာ တိုးတက်မှုကို AI မှ အသေးစိတ် ပေါင်းစပ်တွက်ချက်နေပါသည်...</p>
              </div>
            </div>
          ) : report ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
              {/* Main Analysis Banner */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-indigo-500/20">
                <div className="absolute -right-20 -top-20 bg-indigo-500/10 w-64 h-64 rounded-full blur-[100px]"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-lg shadow-indigo-500/20">
                      <BrainCircuit size={28} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black tracking-tight">AI Pedagogical Mastery Report</h4>
                      <div className="flex items-center gap-2 mt-1 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                        <History size={12} />
                        <span>Analyzed: {report.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleCopy} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all flex items-center gap-3 text-sm font-bold border border-white/10">
                    {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                    {copied ? 'Copied' : 'Share Intelligence'}
                  </button>
                </div>
              </div>

              {/* Psychological & Mental Profile */}
              <div className="bg-gradient-to-r from-rose-500 to-indigo-600 p-1 rounded-[2.5rem] shadow-xl">
                <div className="bg-white p-8 rounded-[2.4rem]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                      <HeartPulse size={24} />
                    </div>
                    <h5 className="text-xl font-black text-slate-800">Psychological & Motivational Profile (စိတ်ပိုင်းဆိုင်ရာသုံးသပ်ချက်)</h5>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium italic">
                    {report.psychologicalProfile}
                  </p>
                </div>
              </div>

              {/* Strategic Deep Dive & Outcome */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Compass size={180} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <BookOpen size={20} className="text-amber-300" />
                      </div>
                      <h5 className="text-xl font-black"> Strategic Pedagogical Roadmap</h5>
                    </div>
                    <p className="text-indigo-50 text-sm leading-loose font-medium">
                      {report.detailedPlan}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4 bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col shadow-sm relative overflow-hidden">
                   <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Target className="text-emerald-600" size={20} />
                      </div>
                      <h5 className="font-black text-emerald-900 uppercase tracking-widest text-[10px]">Expected 4-Week Goal</h5>
                    </div>
                    <div className="flex-1 bg-white/80 p-6 rounded-2xl border border-emerald-100 text-slate-700 text-sm leading-relaxed font-bold italic">
                      {report.expectedOutcome}
                    </div>
                   </div>
                </div>
              </div>

              {/* Specialized Technical Drills */}
              <div className="bg-white p-10 rounded-[3rem] border border-indigo-100 shadow-xl shadow-indigo-50/50">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-lg shadow-indigo-200">
                    <Code2 size={28} />
                  </div>
                  <div>
                    <h5 className="text-2xl font-black text-slate-900">Specialized Technical Drills</h5>
                    <p className="text-slate-500 text-sm font-medium">ကျောင်းသား၏ အားနည်းချက်များအား အဓိကပြုပြင်ရန် သီးသန့်လေ့ကျင့်ခန်းများ</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {report.technicalDrills.map((drill, idx) => {
                    const iconIndex = idx % DRILL_ICONS.length;
                    return (
                      <div key={idx} className="flex items-start gap-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-400 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                          {DRILL_ICONS[iconIndex]}
                        </div>
                        <div className="space-y-2">
                          <h6 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Drill Routine {idx + 1}</h6>
                          <p className="text-slate-800 text-sm font-bold leading-relaxed">{drill}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Action Roadmap */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Map size={24} />
                  </div>
                  <h5 className="text-xl font-black text-slate-800">Action Path Roadmap (အဆင့်ဆင့်လုပ်ဆောင်ရန်)</h5>
                </div>
                
                <div className="relative pl-8 border-l-2 border-dashed border-indigo-100 space-y-12">
                  {report.weeklyActionPlan.map((step, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                        <p className="text-slate-800 font-bold leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                  <div className="absolute -left-[13px] -bottom-2 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Flag size={12} className="text-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Barriers & Adaptations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ReportGridCard 
                  title="Identified Learning Barriers" 
                  items={report.problemsDetected} 
                  icon={<AlertCircle className="text-rose-600" />} 
                  color="bg-rose-50" 
                  borderColor="border-rose-100"
                />
                <ReportGridCard 
                  title="Adaptive Improvement Strategies" 
                  items={report.improvementIdeas} 
                  icon={<Zap className="text-amber-600" />} 
                  color="bg-amber-50" 
                  borderColor="border-amber-100"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                <BrainCircuit className="text-slate-200" size={40} />
              </div>
              <h4 className="text-2xl font-black text-slate-800 mb-3">Pedagogical Intelligence Offline</h4>
              <p className="text-slate-500 max-w-xs mb-10 leading-relaxed font-medium">ကျောင်းသား၏ Coding performance နှင့် mental profile ကို အသေးစိတ် သိရှိရန် Report ကို စတင်ထုတ်ယူပါ။</p>
              <button 
                onClick={handleGenerateReport}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95"
              >
                Launch Intelligence Report
              </button>
            </div>
          )}

          {/* Records History */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-indigo-600">
                  <Calendar size={20} />
                </div>
                <h4 className="text-xl font-black text-slate-800">Historical Attendance Logs</h4>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase tracking-widest font-black">
                    <th className="px-10 py-6">Timeline</th>
                    <th className="px-10 py-6">Engagement</th>
                    <th className="px-10 py-6">Submission</th>
                    <th className="px-10 py-6 text-right">Performance Mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedAttendance.length > 0 ? (
                    paginatedAttendance.map((record, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6 font-bold text-slate-700 text-sm">{record.date}</td>
                        <td className="px-10 py-6">
                          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase ${record.attendance === 'Class' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {record.attendance}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`text-[10px] font-black tracking-widest ${record.assStatus === 'Yes' ? 'text-indigo-600' : 'text-slate-300'}`}>
                            HW: {record.assStatus}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right font-black text-slate-900 text-lg">{record.mark}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-16 text-center text-slate-400 font-medium italic">No activity recorded for this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls for Attendance Logs */}
            {totalAttendancePages > 1 && (
              <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium">
                  Showing {((attendancePage - 1) * LOGS_PER_PAGE) + 1} to {Math.min(attendancePage * LOGS_PER_PAGE, attendanceRecords.length)} of {attendanceRecords.length} records
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAttendancePage(p => Math.max(1, p - 1))}
                    disabled={attendancePage === 1}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalAttendancePages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setAttendancePage(pageNum)}
                        className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                          attendancePage === pageNum 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setAttendancePage(p => Math.min(totalAttendancePages, p + 1))}
                    disabled={attendancePage === totalAttendancePages}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBlock: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black ${highlight ? 'text-emerald-600' : 'text-slate-700'} truncate`}>{value}</p>
    </div>
  </div>
);

const ReportGridCard: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string; borderColor: string }> = ({ title, items, icon, color, borderColor }) => (
  <div className={`${color} p-8 rounded-[2.5rem] border ${borderColor} shadow-sm transition-all hover:shadow-2xl duration-500`}>
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 bg-white rounded-2xl shadow-sm">{icon}</div>
      <h5 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em]">{title}</h5>
    </div>
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-4 bg-white/70 p-5 rounded-[1.5rem] border border-white text-slate-800 text-xs font-bold leading-relaxed items-start shadow-sm">
          <ChevronRight className="mt-0.5 text-indigo-400 flex-shrink-0" size={16} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default StudentDetail;
