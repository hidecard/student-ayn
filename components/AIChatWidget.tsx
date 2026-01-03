
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, User, BrainCircuit, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { createAIChatSession, generateClassReport } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  isReport?: boolean;
}

const AIChatWidget: React.FC = () => {
  const { students, tests, attendance } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'မင်္ဂလာပါ ဆရာ/ဆရာမရှင့်။ ကျောင်းသားတွေရဲ့ performance တွေအကြောင်း ဘာများကူညီပေးရမလဲရှင့်?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or reset chat session when data changes
  useEffect(() => {
    chatRef.current = createAIChatSession({ students, tests, attendance });
  }, [students, tests, attendance]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simple Markdown-lite formatter
  const formatMessage = (text: string) => {
    // Bold: **text**
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Underline: __text__
    formatted = formatted.replace(/__(.*?)__/g, '<span class="underline">$1</span>');
    // Inline Code: `text`
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-slate-100 text-rose-500 px-1 rounded font-mono text-[0.9em] border border-slate-200">$1</code>');
    // Newlines to breaks
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = createAIChatSession({ students, tests, attendance });
      }
      
      const result = await chatRef.current.sendMessage({ message: userMessage });
      const responseText = result.text || "တောင်းပန်ပါတယ်၊ အဖြေထုတ်ပေးလို့ မရဖြစ်နေပါတယ်။";
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "အမှားတစ်ခု ဖြစ်သွားပါတယ်။ ကျေးဇူးပြုပြီး ခဏနေမှ ထပ်ကြိုးစားကြည့်ပါ။" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickClassAnalysis = async () => {
    if (loading) return;
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: 'Analyze current class status (အတန်းတစ်ခုလုံး၏ အခြေအနေကို သုံးသပ်ပေးပါ)' }]);

    try {
      const report = await generateClassReport(students, tests, attendance);
      
      const reportText = `
**[Class Performance Summary]**
${report.summary}

**Weak Topics (အားနည်းချက်များ):**
${report.weakTopics.map((t: string) => `• ${t}`).join('\n')}

**Teaching Advice (သင်ကြားရေး အကြံပြုချက်):**
${report.teachingAdvice.map((a: string) => `• ${a}`).join('\n')}

**Attendance Insight:**
${report.attendanceInsight}
      `;

      setMessages(prev => [...prev, { role: 'model', text: reportText.trim(), isReport: true }]);
    } catch (error) {
      console.error("Quick analysis error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "အတန်းတစ်ခုလုံးစာ Report ထုတ်ယူရာတွင် အမှားတစ်ခု ဖြစ်သွားပါသည်။" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-3rem)] sm:w-[420px] h-[550px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-xl">
                <BrainCircuit size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">AI Teaching Assistant</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-300">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Active Data Synthesis
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleQuickClassAnalysis}
                disabled={loading}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/10 transition-all disabled:opacity-50"
              >
                <Zap size={12} className="text-amber-400" />
                Analyze
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-indigo-600'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                  </div>
                  <div 
                    className={`p-4 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : msg.isReport 
                          ? 'bg-slate-900 text-indigo-50 border border-indigo-500/30 rounded-tl-none font-medium'
                          : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none leading-relaxed'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                  />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2 flex-shrink-0">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="မေးမြန်းပါ..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-rose-500 shadow-rose-200' : 'bg-slate-900 shadow-slate-200'
        } text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all active:scale-95 group relative border-4 border-white`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default AIChatWidget;
