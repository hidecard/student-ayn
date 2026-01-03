
import { GoogleGenAI, Type } from "@google/genai";
import { Student, CodingTest, AttendanceDaily } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a specific AI Intelligence Report for a single student.
 */
export const generateStudentReport = async (
  student: Student,
  tests: CodingTest[],
  attendance: AttendanceDaily[]
) => {
  const prompt = `
    Analyze the performance and behavior of the following student and provide a master-level pedagogical intelligence report in Myanmar language.
    
    Student Name: ${student.student_name}
    
    Coding Test History:
    ${JSON.stringify(tests)}
    
    Attendance and Discipline History:
    ${JSON.stringify(attendance)}

    The report MUST provide extreme detail in these categories:
    1. Technical Gaps: Precise sub-topics (e.g., Array methods, CSS Grid, Async/Await) based on Ques 1-5 scores.
    2. Psychological Analysis: Current motivation level, burnout risk, and learning mindset (Fixed vs Growth).
    3. Specialized Technical Drills: 3-5 high-impact practical exercises specifically for this student.
    4. 4-Week Vision: Where they will be if they follow the roadmap.

    Generate the report in the following JSON structure (values must be in Myanmar language):
    {
      "problemsDetected": ["Problem 1", "Problem 2"],
      "improvementIdeas": ["Strategy 1", "Strategy 2"],
      "weeklyActionPlan": ["Week 1 Focus", "Week 2 Focus", "Week 3 Focus", "Week 4 Milestone"],
      "detailedPlan": "A 250-word comprehensive deep dive into the pedagogical approach for this student.",
      "psychologicalProfile": "A detailed analysis of their mental state and motivation (100 words).",
      "technicalDrills": ["Drill 1: Detailed instruction", "Drill 2: Detailed instruction", "Drill 3: Detailed instruction"],
      "expectedOutcome": "Final outcome description."
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problemsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
          weeklyActionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
          detailedPlan: { type: Type.STRING },
          psychologicalProfile: { type: Type.STRING, description: "Mental and emotional profile in Myanmar language." },
          technicalDrills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific coding drills." },
          expectedOutcome: { type: Type.STRING }
        },
        required: ["problemsDetected", "improvementIdeas", "weeklyActionPlan", "detailedPlan", "psychologicalProfile", "technicalDrills", "expectedOutcome"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Generates an overall class performance and improvement report.
 */
export const generateClassReport = async (
  students: Student[],
  tests: CodingTest[],
  attendance: AttendanceDaily[]
) => {
  const prompt = `
    Analyze the overall performance of the entire class.
    Provide a comprehensive analysis, teaching advice, and class-wide improvement ideas in Myanmar language.
    
    Class Data:
    - Total Students: ${students.length}
    - Test Results: ${JSON.stringify(tests)}
    - Attendance Logs: ${JSON.stringify(attendance)}

    Focus on:
    1. Weak topics (logic gaps).
    2. Relationship between attendance and marks.
    3. Actionable teaching improvement advice for the trainer.
    4. General improvement ideas for the class as a whole, categorized into "Technical", "Discipline", and "Engagement".

    Generate the report in the following JSON structure (values must be in Myanmar language):
    {
      "weakTopics": ["Topic 1", "Topic 2"],
      "attendanceInsight": "Detailed explanation of how attendance is affecting marks",
      "teachingAdvice": ["Advice 1", "Advice 2"],
      "improvementIdeas": [
        {"category": "Technical", "idea": "Myanmar language description"},
        {"category": "Discipline", "idea": "Myanmar language description"},
        {"category": "Engagement", "idea": "Myanmar language description"}
      ],
      "summary": "Overall class summary",
      "classHealthScore": 85
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weakTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          attendanceInsight: { type: Type.STRING },
          teachingAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementIdeas: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: {
                category: { type: Type.STRING },
                idea: { type: Type.STRING }
              },
              required: ["category", "idea"]
            } 
          },
          summary: { type: Type.STRING },
          classHealthScore: { type: Type.INTEGER }
        },
        required: ["weakTopics", "attendanceInsight", "teachingAdvice", "improvementIdeas", "summary", "classHealthScore"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

/**
 * Creates a chat session for the teaching assistant widget.
 */
export const createAIChatSession = (context: {
  students: Student[];
  tests: CodingTest[];
  attendance: AttendanceDaily[];
}) => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an AI Teaching Assistant for a Web Design & Development (WDD) course. 
      Your goal is to help teachers analyze student performance and generate reports.
      You have access to the following current class data:
      - Students: ${JSON.stringify(context.students)}
      - Test Results: ${JSON.stringify(context.tests)}
      - Attendance: ${JSON.stringify(context.attendance)}

      When a teacher asks a question, use this data to provide specific, evidence-based insights.
      Always respond in Myanmar language unless technical terms are better in English.
      Be professional, encouraging, and data-driven.
      If asked for a report on a specific student, summarize their tests and attendance trends clearly.`,
    },
  });
};
