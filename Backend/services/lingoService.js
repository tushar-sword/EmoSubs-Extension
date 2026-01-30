import { LingoDotDevEngine } from "lingo.dev/sdk";

// Initialize Lingo.dev (API key ONLY)
const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY
});

/**
 * Translate subtitle while preserving timing & emotion
 */
export async function localizeSubtitle(text, targetLang) {
  // No translation needed - keep original if English or no target
  if (!targetLang || targetLang === "en") {
    return text;
  }

  try {
    // The correct SDK method is localizeText
    const result = await lingo.localizeText(text, {
      sourceLocale: "en",
      targetLocale: targetLang
    });

    // The result is the translated string directly
    return result || text;
  } catch (error) {
    console.error("[lingoService] Translation error:", error.message || "Unknown error");
    // Safe fallback to AI-enhanced English
    return text;
  }
}