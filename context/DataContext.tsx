
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Student, CodingTest, AttendanceDaily } from '../types';
import { MOCK_STUDENTS, MOCK_TESTS, MOCK_ATTENDANCE } from '../constants';
import { fetchAllSheetData } from '../services/sheetService';

interface SheetConfig {
  testSheetId: string;
  attendanceSheetId: string;
}

interface State {
  students: Student[];
  tests: CodingTest[];
  attendance: AttendanceDaily[];
  loading: boolean;
  lastSync: string | null;
  sheetConfig: SheetConfig;
}

type Action =
  | { type: 'SYNC_START' }
  | { type: 'SYNC_SUCCESS'; payload: { students: Student[]; tests: CodingTest[]; attendance: AttendanceDaily[]; lastSync: string } }
  | { type: 'SYNC_ERROR' }
  | { type: 'UPDATE_CONFIG'; payload: SheetConfig };

interface DataState extends State {
  syncData: () => Promise<void>;
  updateSheetConfig: (config: SheetConfig) => void;
}

const DEFAULT_CONFIG: SheetConfig = {
  testSheetId: '17dG3mTQchr4oib6jIkHuFUwOITzjgRnlrKpvUkV4yMA',
  attendanceSheetId: '14NXZPjfWPFQVrAnuouYT2PVYLFCjHki_nIYUPoRj50o'
};

const getInitialConfig = (): SheetConfig => {
  const saved = localStorage.getItem('sheet_config');
  return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
};

const initialState: State = {
  students: MOCK_STUDENTS,
  tests: MOCK_TESTS,
  attendance: MOCK_ATTENDANCE,
  loading: false,
  lastSync: null,
  sheetConfig: getInitialConfig(),
};

const dataReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SYNC_START':
      return { ...state, loading: true };
    case 'SYNC_SUCCESS':
      return {
        ...state,
        loading: false,
        students: action.payload.students.length ? action.payload.students : MOCK_STUDENTS,
        tests: action.payload.tests.length ? action.payload.tests : MOCK_TESTS,
        attendance: action.payload.attendance.length ? action.payload.attendance : MOCK_ATTENDANCE,
        lastSync: action.payload.lastSync,
      };
    case 'SYNC_ERROR':
      return { ...state, loading: false };
    case 'UPDATE_CONFIG':
      return { ...state, sheetConfig: action.payload };
    default:
      return state;
  }
};

const DataContext = createContext<DataState | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const updateSheetConfig = useCallback((config: SheetConfig) => {
    localStorage.setItem('sheet_config', JSON.stringify(config));
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  }, []);

  const syncData = useCallback(async () => {
    dispatch({ type: 'SYNC_START' });
    try {
      const data = await fetchAllSheetData(state.sheetConfig.testSheetId, state.sheetConfig.attendanceSheetId);
      const lastSync = new Date().toLocaleString('my-MM', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      dispatch({
        type: 'SYNC_SUCCESS',
        payload: {
          students: data.students,
          tests: data.tests,
          attendance: data.attendance,
          lastSync
        }
      });
    } catch (error: any) {
      dispatch({ type: 'SYNC_ERROR' });
      console.error("Failed to sync from Google Sheets:", error);
      alert(
        `Google Sheets နှင့် ချိတ်ဆက်၍မရပါ။\n\nအရေးကြီးအချက်များ:\n` +
        `၁။ Sheets အားလုံးကို "Anyone with the link can view" သို့မဟုတ် "Publish to Web" လုပ်ထားရန် လိုအပ်ပါသည်။\n` +
        `၂။ Sheet ID မှန်ကန်မှုရှိမရှိ စစ်ဆေးပါ။\n\n` +
        `အသေးစိတ်အမှား: ${error.message || 'Network Error'}`
      );
    }
  }, [state.sheetConfig]);

  return (
    <DataContext.Provider value={{
      ...state,
      syncData,
      updateSheetConfig
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
