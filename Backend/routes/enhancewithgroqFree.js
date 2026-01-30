// const express = require("express");
// const router = express.Router();

// const { enhanceSubtitle } = require("../services/aiService");

// router.post("/", async (req, res) => {
//   const { text, targetLang } = req.body;

//   if (!text) {
//     return res.status(400).json({ error: "Subtitle text is required" });
//   }

//   console.log("[API] Received subtitle:", text);
//   console.log("[API] Target language:", targetLang);

//   const enhancedText = await enhanceSubtitle(text, targetLang);

//   res.json({ enhancedText });
// });

// module.exports = router;
