// Test the actual service functions
import { generateStudentReport, generateClassReport, createAIChatSession } from './services/geminiService.js';
import { MOCK_STUDENTS, MOCK_TESTS, MOCK_ATTENDANCE } from './constants.js';

async function testServices() {
  console.log("🧪 Testing Puter.js service integration...");

  try {
    // Test student report generation
    console.log("📊 Testing student report generation...");
    const studentReport = await generateStudentReport(MOCK_STUDENTS[0], MOCK_TESTS, MOCK_ATTENDANCE);
    console.log("✅ Student report generated successfully:", studentReport);

    // Test class report generation
    console.log("📈 Testing class report generation...");
    const classReport = await generateClassReport(MOCK_STUDENTS, MOCK_TESTS, MOCK_ATTENDANCE);
    console.log("✅ Class report generated successfully:", classReport);

    // Test chat session creation and message sending
    console.log("💬 Testing AI chat session...");
    const chatSession = createAIChatSession({
      students: MOCK_STUDENTS,
      tests: MOCK_TESTS,
      attendance: MOCK_ATTENDANCE
    });

    const chatResponse = await chatSession.sendMessage("မင်္ဂလာပါ၊ ကျောင်းသားတွေရဲ့ အခြေအနေကို သုံးသပ်ပေးပါ။");
    console.log("✅ Chat response received:", chatResponse);

    console.log("🎉 All Puter.js integration tests passed!");

  } catch (error) {
    console.error("❌ Service test failed:", error);
  }
}

// Run tests when puter is available
if (typeof puter !== 'undefined') {
  testServices();
} else {
  console.log("⏳ Waiting for Puter.js to load...");
  window.addEventListener('load', () => {
    setTimeout(testServices, 2000); // Wait a bit longer for React to load
  });
}
