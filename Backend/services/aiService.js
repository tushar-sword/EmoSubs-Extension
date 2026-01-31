import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

//Output ScHema
const SubtitleOutputSchema = z.object({
  enhancedText: z.string()
});

//Mr Prompt
const SUBTITLE_SYSTEM_PROMPT = `
You are an AI that rewrites subtitles for movies and TV shows.

Your goal:
- Enhance emotional clarity and naturalness
- Keep the SAME meaning, intent, and tone
- Preserve timing and lip-sync accuracy

STRICT RULES:
- Do NOT change the sentence length significantly (max ±5%)
- Do NOT add or remove information
- Do NOT add emojis, symbols, or formatting
- Do NOT explain anything
- Do NOT output quotes or extra text
- Output ONLY the rewritten subtitle text in JSON format

STYLE GUIDELINES:
- Sound natural and conversational
- Match the emotional tone (anger, sarcasm, fear, joy, sadness, etc.)
- Keep punctuation minimal and natural
- Maintain original sentence structure where possible

The output MUST be suitable to replace the original subtitle directly.

CRITICAL: Return your response as JSON with this exact structure:
{
  "enhancedText": "your rewritten subtitle here"
}
`;

//main function
export async function enhanceSubtitle(text, targetLang = "en") {
  try {
    const messages = [
      {
        role: "system",
        content: SUBTITLE_SYSTEM_PROMPT
      },
      {
        role: "user",
        content: `
Original subtitle:
"${text}"

Target language:
${targetLang}

Rewrite the subtitle following all rules. Return ONLY valid JSON.
`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
      response_format: { type: "json_object" }
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    const validated = SubtitleOutputSchema.parse(parsed);

    return validated.enhancedText;

  } catch (error) {
    console.error("[aiService] Error:", error);
    // Safe fallback = original text
    return text;
  }
}