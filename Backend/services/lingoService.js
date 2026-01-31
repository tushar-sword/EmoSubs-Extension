import { LingoDotDevEngine } from "lingo.dev/sdk";

// Initializing Lingo.dev 
const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY
});


 // Translate subtitle while preserving timing & emotion // Limit of words 
export async function localizeSubtitle(text, targetLang) {
  if (!targetLang || targetLang === "en") {
    return text;
  }

  try {
    const result = await lingo.localizeText(text, {
      sourceLocale: "en",
      targetLocale: targetLang
    });

    
    return result || text;
  } catch (error) {
    console.error("[lingoService] Translation error:", error.message || "Unknown error");
    //fallback 
    return text;
  }
}