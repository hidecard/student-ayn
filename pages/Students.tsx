
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Mail, Phone, ExternalLink, RefreshCw, ChevronLeft, ChevronRight, Search, UserCircle } from 'lucide-react';

const STUDENTS_PER_PAGE = 6;

const Students: React.FC = () => {
  const { students, loading, syncData } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + STUDENTS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-800 font-sans">Student Directory (ကျောင်းသားစာရင်း)</h3>
          <p className="text-sm text-slate-500">
            {filteredStudents.length} students found
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="အမည် သို့မဟုတ် ID ဖြင့်ရှာဖွေပါ..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={syncData}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Sync Records
          </button>
        </div>
      </div>

      {paginatedStudents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedStudents.map((student) => (
              <div key={student.student_id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {student.student_name.charAt(0)}
                  </div>
                  <span className="bg-slate-50 text-slate-400 text-[10px] px-2 py-1 rounded font-bold uppercase">{student.student_id}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">{student.student_name}</h4>
                
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail size={14} />
                    <span className="text-xs truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={14} />
                    <span className="text-xs">{student.phone}</span>
                  </div>
                </div>

                <Link 
                  to={`/student/${student.student_id}`}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
                >
                  Analyze Profile <ExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-20 rounded-2xl border border-dashed border-slate-200 text-center">
          <UserCircle size={48} className="mx-auto text-slate-200 mb-4" />
          <h4 className="text-lg font-bold text-slate-800">ကျောင်းသားစာရင်း မရှိသေးပါ</h4>
          <p className="text-slate-500 text-sm">ဒေတာများကို Sync လုပ်ရန် သို့မဟုတ် ရှာဖွေမှုစကားလုံးကို စစ်ဆေးရန် လိုအပ်ပါသည်။</p>
        </div>
      )}
    </div>
  );
};

export default Students;
