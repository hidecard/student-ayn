
// Puter.js provides free access to Gemini models without API keys
// Global puter object is available after including the script in index.html
declare global {
  interface Window {
    puter: any;
  }
}

const puter = window.puter;

import { Student, CodingTest, AttendanceDaily } from "../types";

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

    IMPORTANT: Return ONLY valid JSON. No markdown formatting, no explanations, just the JSON object.
  `;

  const response = await puter.ai.chat(prompt, {
    model: 'gemini-3-flash-preview'
  });

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error("Failed to parse student report JSON:", error);
    throw new Error("Invalid JSON response from AI");
  }
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

    IMPORTANT: Return ONLY valid JSON. No markdown formatting, no explanations, just the JSON object.
  `;

  const response = await puter.ai.chat(prompt, {
    model: 'gemini-3-flash-preview'
  });

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error("Failed to parse class report JSON:", error);
    throw new Error("Invalid JSON response from AI");
  }
};

/**
 * Creates a chat session for the teaching assistant widget.
 * Since Puter.js doesn't have persistent chat sessions, we create a simple session
 * that maintains conversation history and sends it with each request.
 */
export const createAIChatSession = (context: {
  students: Student[];
  tests: CodingTest[];
  attendance: AttendanceDaily[];
}) => {
  const systemPrompt = `You are an AI Teaching Assistant for a Web Design & Development (WDD) course.
  Your goal is to help teachers analyze student performance and generate reports.
  You have access to the following current class data:
  - Students: ${JSON.stringify(context.students)}
  - Test Results: ${JSON.stringify(context.tests)}
  - Attendance: ${JSON.stringify(context.attendance)}

  When a teacher asks a question, use this data to provide specific, evidence-based insights.
  Always respond in Myanmar language unless technical terms are better in English.
  Be professional, encouraging, and data-driven.
  If asked for a report on a specific student, summarize their tests and attendance trends clearly.`;

  const chatHistory: Array<{role: 'user' | 'model', content: string}> = [];

  return {
    sendMessage: async (message: string) => {
      // Add user message to history
      chatHistory.push({ role: 'user', content: message });

      // Create the full prompt with system instruction and conversation history
      const fullPrompt = `${systemPrompt}

Previous conversation:
${chatHistory.slice(0, -1).map(msg => `${msg.role === 'user' ? 'Teacher' : 'Assistant'}: ${msg.content}`).join('\n')}

Current question: ${message}

Please provide a helpful response based on the class data above.`;

      try {
        const response = await puter.ai.chat(fullPrompt, {
          model: 'gemini-3-flash-preview'
        });

        // Add AI response to history
        chatHistory.push({ role: 'model', content: response });

        return response;
      } catch (error) {
        console.error("Chat error:", error);
        throw new Error("Failed to get AI response");
      }
    }
  };
};
