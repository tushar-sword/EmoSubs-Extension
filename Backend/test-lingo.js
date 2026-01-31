// Test Lingo.dev Connection
// Run this with: node test-lingo.js

import "dotenv/config";
import { LingoDotDevEngine } from "lingo.dev/sdk";

console.log("=== Testing Lingo.dev Connection ===\n");

// Check if API key exists
if (!process.env.LINGODOTDEV_API_KEY) {
  console.error("❌ LINGODOTDEV_API_KEY not found in .env file!");
  process.exit(1);
}

console.log("✅ API Key found:", process.env.LINGODOTDEV_API_KEY.substring(0, 10) + "...");

// Initialize Lingo.dev
const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY
});

console.log("✅ Lingo.dev engine initialized\n");

// Test 1: Simple translation
console.log("Test 1: Simple English → Russian translation");
console.log("Input: 'Hello world'");

try {
  const start = Date.now();
  
  const result = await lingo.localizeText("Hello world", {
    sourceLocale: "en",
    targetLocale: "ru"
  });
  
  const duration = Date.now() - start;
  
  console.log("✅ Success!");
  console.log("Result:", result);
  console.log("Duration:", duration + "ms\n");
  
} catch (error) {
  console.error("❌ Failed!");
  console.error("Error:", error.message);
  console.error("Full error:", error);
  console.log("");
}

// Test 2: Japanese translation
console.log("Test 2: English → Japanese translation");
console.log("Input: 'Good morning'");

try {
  const start = Date.now();
  
  const result = await lingo.localizeText("Good morning", {
    sourceLocale: "en",
    targetLocale: "ja"
  });
  
  const duration = Date.now() - start;
  
  console.log("✅ Success!");
  console.log("Result:", result);
  console.log("Duration:", duration + "ms\n");
  
} catch (error) {
  console.error("❌ Failed!");
  console.error("Error:", error.message);
  console.log("");
}

// Test 3: Test with timeout
console.log("Test 3: Translation with 3s timeout");
console.log("Input: 'This is a test subtitle'");

try {
  const translationPromise = lingo.localizeText("This is a test subtitle", {
    sourceLocale: "en",
    targetLocale: "ru"
  });
  
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout after 3s")), 3000)
  );
  
  const start = Date.now();
  const result = await Promise.race([translationPromise, timeoutPromise]);
  const duration = Date.now() - start;
  
  console.log("✅ Success!");
  console.log("Result:", result);
  console.log("Duration:", duration + "ms\n");
  
} catch (error) {
  console.error("❌ Failed!");
  console.error("Error:", error.message);
  console.log("");
}

console.log("=== Test Complete ===");
console.log("\nDiagnosis:");
console.log("If all tests failed → Lingo.dev API key or connection issue");
console.log("If some succeeded → Timeout issue (increase timeout in lingoService)");
console.log("If all succeeded → Issue is with parallel processing in main app");