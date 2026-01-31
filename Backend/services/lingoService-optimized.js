import OpenAI from "openai";
import { LingoDotDevEngine } from "lingo.dev/sdk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Lingo.dev
const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY
});

// Track Lingo.dev reliability
let lingoFailCount = 0;
let lingoSuccessCount = 0;

/**
 * Fast translation using OpenAI
 */
async function translateWithOpenAI(text, targetLang) {
  const languageMap = {
    ru: "Russian",
    es: "Spanish", 
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    hi: "Hindi",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ar: "Arabic",
    tr: "Turkish",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    kn: "Kannada",
    bn: "Bengali",
    pa: "Punjabi",
    mr: "Marathi",
    gu: "Gujarati",
    ur: "Urdu"
  };

  const targetLanguage = languageMap[targetLang] || targetLang;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Translate to ${targetLanguage}. Keep same tone, emotion, and length. Output ONLY the translation.`
      },
      {
        role: "user",
        content: text
      }
    ],
    temperature: 0.2,
    max_tokens: 150
  });

  return completion.choices[0].message.content.trim();
}

/**
 * Translate subtitle - Smart selection between Lingo.dev and OpenAI
 */
export async function localizeSubtitle(text, targetLang) {
  // No translation needed
  if (!targetLang || targetLang === "en") {
    return text;
  }

  // If Lingo.dev has failed too many times, skip it temporarily
  const skipLingo = lingoFailCount > 5 && lingoSuccessCount === 0;

  if (!skipLingo) {
    // Try Lingo.dev with 5 second timeout
    try {
      const lingoPromise = lingo.localizeText(text, {
        sourceLocale: "en",
        targetLocale: targetLang
      });

      // 5 second timeout (increased from 2s)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Lingo.dev timeout")), 5000)
      );

      const result = await Promise.race([lingoPromise, timeoutPromise]);
      
      if (result && result.length > 0) {
        lingoSuccessCount++;
        console.log("[lingoService] ✅ Lingo.dev (success rate:", 
          Math.round((lingoSuccessCount / (lingoSuccessCount + lingoFailCount)) * 100) + "%)");
        return result;
      }
    } catch (error) {
      lingoFailCount++;
      console.log("[lingoService] ⚠️ Lingo.dev failed (attempt " + lingoFailCount + "), using OpenAI...");
    }
  } else {
    console.log("[lingoService] ⏭️ Skipping Lingo.dev (too many failures), using OpenAI");
  }

  // Fall back to OpenAI
  try {
    const result = await translateWithOpenAI(text, targetLang);
    console.log("[lingoService] ✅ OpenAI translation");
    return result;
  } catch (error) {
    console.error("[lingoService] ❌ All translation failed:", error.message);
    return text;
  }
}