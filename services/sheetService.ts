
import Papa from 'papaparse';
import { Student, CodingTest, AttendanceDaily } from '../types';

const getCsvUrl = (id: string) => 
  `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=0`;

async function fetchCsv(url: string, label: string) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404 || response.status === 401) {
        throw new Error(`Access Denied: Please check if the [${label}] sheet is shared as "Anyone with the link can view".`);
      }
      throw new Error(`HTTP error! status: ${response.status} for ${label}`);
    }
    
    const text = await response.text();
    
    if (text.trim().startsWith('<!DOCTYPE html>') || text.includes('google-signin')) {
      throw new Error(`Authentication Required: The [${label}] sheet is not publicly accessible. Set it to "Anyone with the link" -> "Viewer".`);
    }

    return new Promise<any[]>((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (h) => h.trim(),
        complete: (results) => {
          if (results.errors.length > 0 && results.data.length === 0) {
            reject(new Error(`CSV Parse Error [${label}]: ${results.errors[0].message}`));
          } else {
            resolve(results.data);
          }
        },
        error: (error: any) => reject(new Error(`CSV Parse Error [${label}]: ${error.message}`))
      });
    });
  } catch (error: any) {
    console.error(`Fetch error [${label}]:`, error);
    if (error.message === 'Failed to fetch') {
      throw new Error(`Connection Blocked: Could not reach Google Sheets for [${label}]. This usually means the sheet is private or your browser is blocking the request.`);
    }
    throw error;
  }
}

export const fetchAllSheetData = async (testSheetId: string, attendanceSheetId: string) => {
  try {
    const [testsRaw, attendanceRaw] = await Promise.all([
      fetchCsv(getCsvUrl(testSheetId), 'Tests'),
      fetchCsv(getCsvUrl(attendanceSheetId), 'Attendance')
    ]);

    const uniqueNames = Array.from(new Set(attendanceRaw.map(r => r.Name || r.name).filter(Boolean)));
    const students: Student[] = uniqueNames.map((name, idx) => ({
      student_id: `S${(idx + 1).toString().padStart(3, '0')}`,
      student_name: name as string,
      email: `${(name as string).toLowerCase().replace(/\s/g, '')}@gmail.com`,
      phone: '-'
    }));

    const tests: CodingTest[] = testsRaw.map((r: any) => ({
      no: parseInt(r.No || r.no) || 0,
      name: r.Name || r.name || '',
      q1: parseInt(r['Ques 1'] || r['q1']) || 0,
      q2: parseInt(r['Ques 2'] || r['q2']) || 0,
      q3: parseInt(r['Ques 3'] || r['q3']) || 0,
      q4: parseInt(r['Ques 4'] || r['q4']) || 0,
      q5: parseInt(r['Ques 5'] || r['q5']) || 0,
      total: parseInt(r.Total || r.total) || 0,
    })).filter(t => t.name);

    const attendance: AttendanceDaily[] = attendanceRaw.map((r: any) => ({
      no: parseInt(r.No || r.no) || 0,
      name: r.Name || r.name || '',
      date: r.Date || r.date || '',
      attendance: r.Attendance || r.attendance || 'Absent',
      assStatus: r['Ass Status'] || r.assStatus || 'No',
      assTime: r['Ass Time'] || r.assTime || 'No',
      question: r.Question || r.question || 'No',
      desc: r.Desc || r.desc || 'No',
      arrivalTime: r['Arrival Time'] || r.arrivalTime || '-',
      mark: parseInt(r.Mark || r.mark) || 0
    })).filter(a => a.name);

    return { students, tests, attendance };
  } catch (err: any) {
    throw new Error(`Data Sync Failed: ${err.message || 'Unknown network error'}.`);
  }
};
