
import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { ClipboardList, Trophy, Target, AlertCircle, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';

const TESTS_PER_PAGE = 10;

const Tests: React.FC = () => {
  const { tests, loading } = useData();
  const [currentPage, setCurrentPage] = useState(1);

  // Use useMemo for calculations and sorting to avoid unnecessary re-computations
  const stats = useMemo(() => {
    if (!tests || tests.length === 0) return { highestScore: 0, averageScore: 0, passCount: 0, passRate: 0, sortedTests: [] };
    
    const highestScore = Math.max(...tests.map(t => t.total || 0), 0);
    const averageScore = tests.reduce((acc, t) => acc + (t.total || 0), 0) / tests.length;
    const passCount = tests.filter(t => (t.total || 0) >= 70).length; 
    const passRate = (passCount / tests.length) * 100;
    const sortedTests = [...tests].sort((a, b) => (b.total || 0) - (a.total || 0));

    return { highestScore, averageScore, passCount, passRate, sortedTests };
  }, [tests]);

  // Pagination Logic
  const totalPages = Math.ceil(stats.sortedTests.length / TESTS_PER_PAGE);
  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * TESTS_PER_PAGE;
    return stats.sortedTests.slice(startIndex, startIndex + TESTS_PER_PAGE);
  }, [stats.sortedTests, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-8">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Highest Score" 
          value={stats.highestScore.toString()} 
          icon={<Trophy className="text-amber-500" />} 
          subtitle="Top Performer"
        />
        <SummaryCard 
          title="Class Average" 
          value={stats.averageScore.toFixed(1)} 
          icon={<Target className="text-blue-500" />} 
          subtitle="Mean performance"
        />
        <SummaryCard 
          title="Passing Rate (70+ Mark)" 
          value={`${stats.passRate.toFixed(0)}%`} 
          icon={<TrendingDown className={`transform rotate-180 ${stats.passRate > 70 ? 'text-emerald-500' : 'text-rose-500'}`} />} 
          subtitle={`${stats.passCount} students passed`}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <ClipboardList className="text-indigo-600" size={20} />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Coding Test Detailed Results</h4>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm italic">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">No.</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-4 py-4 text-center">Q1</th>
                <th className="px-4 py-4 text-center">Q2</th>
                <th className="px-4 py-4 text-center">Q3</th>
                <th className="px-4 py-4 text-center">Q4</th>
                <th className="px-4 py-4 text-center">Q5</th>
                <th className="px-6 py-4 text-right">Total Score</th>
                <th className="px-6 py-4 text-center">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTests.length > 0 ? (
                paginatedTests.map((test, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-slate-400 font-medium text-sm">{test.no}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">{test.name}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600 text-sm">{test.q1}</td>
                    <td className="px-4 py-4 text-center text-slate-600 text-sm">{test.q2}</td>
                    <td className="px-4 py-4 text-center text-slate-600 text-sm">{test.q3}</td>
                    <td className="px-4 py-4 text-center text-slate-600 text-sm">{test.q4}</td>
                    <td className="px-4 py-4 text-center text-slate-600 text-sm">{test.q5}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-block px-3 py-1 rounded-lg font-bold text-sm ${
                        test.total >= 85 ? 'bg-emerald-100 text-emerald-700' : 
                        test.total >= 70 ? 'bg-blue-100 text-blue-700' : 
                        test.total >= 50 ? 'bg-amber-100 text-amber-700' : 
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {test.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {test.total < 70 ? (
                        <div className="flex items-center justify-center gap-1 text-rose-500">
                          <AlertCircle size={14} />
                          <span className="text-[10px] font-bold uppercase">At Risk</span>
                        </div>
                      ) : test.total >= 90 ? (
                        <span className="text-[10px] font-bold uppercase text-emerald-500">Elite</span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-slate-400">Stable</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ClipboardList className="text-slate-200 w-12 h-12" />
                      <p className="text-slate-400 italic">No test data available. Please sync from Google Sheets.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Showing page {currentPage} of {totalPages} ({stats.sortedTests.length} total results)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                      currentPage === pageNum 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white text-slate-400 border border-slate-200 hover:text-indigo-600 hover:border-indigo-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ title: string; value: string; icon: React.ReactNode; subtitle: string }> = ({ title, value, icon, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
    <div className="p-4 bg-slate-50 rounded-2xl">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-black text-slate-800">{value}</h4>
        <span className="text-[10px] text-slate-400 font-medium">{subtitle}</span>
      </div>
    </div>
  </div>
);

export default Tests;
