// Simple test to verify Puter.js integration
// This will test if puter.ai.chat works correctly

async function testPuterIntegration() {
  console.log("Testing Puter.js integration...");

  try {
    // Test basic chat functionality
    const response = await puter.ai.chat("Hello, can you respond in one sentence?", {
      model: 'gemini-3-flash-preview'
    });

    console.log("✅ Puter.js chat test successful!");
    console.log("Response:", response);

    // Test JSON response parsing
    const jsonResponse = await puter.ai.chat('Return this JSON: {"test": "success", "message": "Puter.js integration working"}', {
      model: 'gemini-3-flash-preview'
    });

    console.log("✅ JSON response test:");
    console.log("Raw response:", jsonResponse);

    try {
      const parsed = JSON.parse(jsonResponse);
      console.log("✅ JSON parsing successful:", parsed);
    } catch (parseError) {
      console.log("❌ JSON parsing failed:", parseError);
    }

  } catch (error) {
    console.error("❌ Puter.js test failed:", error);
  }
}

// Run test when puter is available
if (typeof puter !== 'undefined') {
  testPuterIntegration();
} else {
  console.log("Waiting for Puter.js to load...");
  window.addEventListener('load', () => {
    setTimeout(testPuterIntegration, 1000);
  });
}
