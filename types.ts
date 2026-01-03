
export interface Student {
  student_id: string;
  student_name: string;
  email: string;
  phone: string;
}

export interface CodingTest {
  no: number;
  name: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  total: number;
}

export interface AttendanceDaily {
  no: number;
  name: string;
  date: string;
  attendance: string;
  assStatus: string;
  assTime: string;
  question: string;
  desc: string;
  arrivalTime: string;
  mark: number;
}

export interface AIReport {
  studentId: string;
  problemsDetected: string[];
  improvementIdeas: string[];
  weeklyActionPlan: string[];
  detailedPlan: string;
  expectedOutcome: string;
  psychologicalProfile: string;
  technicalDrills: string[];
}

export interface BatchAnalysis {
  weakTopics: string[];
  attendanceInsight: string;
  teachingAdvice: string[];
  improvementIdeas: string[];
  summary: string;
}
