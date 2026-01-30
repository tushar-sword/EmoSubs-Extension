import express from "express";

import { enhanceSubtitle } from "../services/aiService.js";
import { localizeSubtitle } from "../services/lingoService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text) {
    return res.status(400).json({
      error: "Subtitle text is required"
    });
  }

  console.log("[API] Received subtitle:", text);
  console.log("[API] Target language:", targetLang);

  try {
    // Step 1: Emotion & clarity (OpenAI)
    const enhancedText = await enhanceSubtitle(text, "en");
    console.log("[API] Enhanced text:", enhancedText);

    // Step 2: Localization (Lingo.dev)
    const finalText = await localizeSubtitle(enhancedText, targetLang);
    console.log("[API] Final text:", finalText);

    res.json({
      enhancedText: finalText
    });
  } catch (error) {
    console.error("[API] Enhancement failed:", error);
    res.status(500).json({
      error: "Subtitle processing failed"
    });
  }
});

export default router;