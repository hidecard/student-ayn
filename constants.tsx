
import { Student, CodingTest, AttendanceDaily } from './types';

export const MOCK_STUDENTS: Student[] = [
  { student_id: "S001", student_name: "Shwe Sin Phoo", email: "shwesin@gmail.com", phone: "0912345678" },
  { student_id: "S002", student_name: "May Thu Thu Kyaw", email: "maythu@gmail.com", phone: "0912345679" },
  { student_id: "S003", student_name: "Kyaw Kyaw", email: "kyawkyaw@gmail.com", phone: "0912345680" }
];

export const MOCK_TESTS: CodingTest[] = [
  { no: 5, name: "Shwe Sin Phoo", q1: 20, q2: 18, q3: 20, q4: 20, q5: 20, total: 98 },
  { no: 4, name: "May Thu Thu Kyaw", q1: 15, q2: 10, q3: 12, q4: 14, q5: 8, total: 59 },
  { no: 3, name: "Kyaw Kyaw", q1: 20, q2: 20, q3: 20, q4: 15, q5: 18, total: 93 }
];

export const MOCK_ATTENDANCE: AttendanceDaily[] = [
  { no: 4, name: "May Thu Thu Kyaw", date: "2025-04-07", attendance: "Class", assStatus: "Yes", assTime: "Yes", question: "Yes", desc: "Yes", arrivalTime: "Arrive", mark: 30 },
  { no: 4, name: "May Thu Thu Kyaw", date: "2025-04-08", attendance: "Absent", assStatus: "No", assTime: "No", question: "No", desc: "No", arrivalTime: "None", mark: 0 },
  { no: 5, name: "Shwe Sin Phoo", date: "2025-04-07", attendance: "Class", assStatus: "Yes", assTime: "Yes", question: "Yes", desc: "Yes", arrivalTime: "Arrive", mark: 30 }
];
