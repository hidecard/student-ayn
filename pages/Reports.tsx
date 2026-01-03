
import React, { useState } from 'react';
import { Sparkles, Loader2, BrainCircuit, ChevronRight, CheckCircle2, Target, Lightbulb, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { generateStudentReport } from '../services/geminiService';
import { AIReport } from '../types';

const Reports: React.FC = () => {
  const { students, tests, attendance } = useData();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIReport | null>(null);

  const handleGenerateReport = async () => {
    if (!selectedStudentId) return;
    
    setLoading(true);
    setReport(null);
    try {
      const student = students.find(s => s.student_id === selectedStudentId);
      if (!student) return;

      const studentTests = tests.filter(t => t.name === student.student_name);
      const studentAttendance = attendance.filter(a => a.name === student.student_name);

      const aiResponse = await generateStudentReport(student, studentTests, studentAttendance);
      setReport({ ...aiResponse, studentId: selectedStudentId });
    } catch (error) {
      console.error("AI Report generation failed:", error);
      alert("AI Intelligence Report ထုတ်ယူရာတွင် အမှားအယွင်းရှိနေပါသည်။ ကျေးဇူးပြု၍ နောက်တစ်ကြိမ် ထပ်မံကြိုးစားကြည့်ပါ။");
    } finally {
      setLoading(false);
    }
  };

  const currentStudent = students.find(s => s.student_id === selectedStudentId);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-2">
            <BrainCircuit className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">AI Intelligence Report</h3>
          <p className="text-slate-500 text-sm">ကျောင်းသားတစ်ဦးချင်းစီ၏ စာမေးပွဲရလဒ်များ နှင့် ကျောင်းတက်ရောက်မှုအပေါ် အခြေခံ၍ AI မှ အကြံပြုချက်များကို ထုတ်ပေးမည်ဖြစ်ပါသည်။</p>
          
          <div className="flex gap-3 mt-6">
            <select 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">ကျောင်းသား ရွေးချယ်ပါ</option>
              {students.map(s => (
                <option key={s.student_id} value={s.student_id}>{s.student_name}</option>
              ))}
            </select>
            <button
              onClick={handleGenerateReport}
              disabled={loading || !selectedStudentId}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
             <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">AI မှ ဒေတာများကို သုံးသပ်နေပါသည်...</p>
          </div>
        </div>
      )}

      {report && currentStudent && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                {currentStudent.student_name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">{currentStudent.student_name}</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Personal Performance Analytics</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportSection title="Detected Challenges" items={report.problemsDetected} icon={<AlertCircle className="text-rose-600" />} color="bg-rose-50" />
            <ReportSection title="AI Improvement Ideas" items={report.improvementIdeas} icon={<Lightbulb className="text-amber-600" />} color="bg-amber-50" />
            <ReportSection title="Weekly Action Plan" items={report.weeklyActionPlan} icon={<Target className="text-blue-600" />} color="bg-blue-50" />
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-xl shadow-sm"><CheckCircle2 className="text-emerald-600" size={20} /></div>
                <h5 className="font-bold text-emerald-900">Expected Outcome</h5>
              </div>
              <div className="bg-white/80 p-5 rounded-xl border border-emerald-100 flex-1 text-slate-700 text-sm leading-relaxed">
                {report.expectedOutcome}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportSection: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => (
  <div className={`${color} p-6 rounded-2xl border border-slate-100 shadow-sm`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-white rounded-xl shadow-sm">{icon}</div>
      <h5 className="font-bold text-slate-800">{title}</h5>
    </div>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-3 bg-white/60 p-3 rounded-xl border border-white text-slate-700 text-sm items-start">
          <ChevronRight className="mt-0.5 text-slate-400 flex-shrink-0" size={16} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Reports;
