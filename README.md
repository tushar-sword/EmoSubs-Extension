# EmoSubs Extension 🎬💚  
**Emotion-aware, localized subtitles — without losing meaning or timing**

---

## 🧠 What is EmoSubs?

**Subtitles translate words — EmoSubs translates emotions.**

EmoSubs is a browser extension that enhances subtitles using AI to preserve emotional tone and then localizes them into the viewer’s preferred language **without breaking timing, lip-sync, or meaning**.

Traditional subtitle translation often loses emotion, sarcasm, urgency, or cultural nuance. EmoSubs fixes that by combining **AI-based emotional rewriting** with **high-quality localization powered by Lingo.dev**.

---

## 🚀 Why EmoSubs?

Subtitles today:
- Lose emotional depth
- Break lip-sync when translated
- Feel robotic or unnatural
- Are often translated word-for-word

EmoSubs solves this by:
- Enhancing emotional clarity **before** translation
- Preserving subtitle length and structure
- Localizing text with context-aware translation
- Delivering results in **real time**

---

## 🧩 How EmoSubs Works (High-Level Flow)

1. **Content Script**
   - Detects subtitle changes on platforms like Hotstar
   - Extracts the current subtitle text

2. **Background Script**
   - Receives subtitle text
   - Sends it to the backend with the selected target language

3. **Backend (Node.js + Express)**
   - **AI Service (OpenAI)**  
     Enhances emotional clarity while preserving length and intent
   - **Localization Service (Lingo.dev)**  
     Translates the enhanced subtitle into the target language while preserving tone and timing

4. **Back to the Browser**
   - The translated subtitle is injected back onto the video
   - Original subtitles are hidden
   - Emotionally accurate subtitles appear instantly

---

## 💚 Why Lingo.dev is the Heart of EmoSubs

Lingo.dev is **not just a translator** in this project — it is the **core localization engine**.

### How Lingo.dev is used:
- Converts AI-enhanced English subtitles into target languages
- Preserves emotion, tone, and sentence structure
- Supports a wide range of locale formats (e.g. `hi-IN`, `fr-CA`, `zh-Hant`)
- Enables scalable, production-grade localization

### Benefits of using Lingo.dev:
- Context-aware localization
- Language + region precision
- Clean SDK integration
- Perfect for real-time subtitle workflows

Without Lingo.dev, EmoSubs would lose:
- Emotional accuracy across languages
- Consistency in localization
- Scalability for global audiences

---

## 🌍 Supported Languages

EmoSubs supports a diverse set of languages and locales including:
- English (US, UK, AU, CA)
- Hindi, Tamil, Telugu, Malayalam, Bengali, Punjabi, Urdu
- French, German, Spanish, Portuguese, Italian, Dutch
- Arabic (multiple regions), Chinese (Simplified & Traditional)
- Japanese, Korean, Turkish, Vietnamese, Thai
- And many more via Lingo.dev

---

## 🛠 Tech Stack

### Frontend (Browser Extension)
- JavaScript
- Chrome Extension APIs
- MutationObserver
- Custom subtitle overlay

### Backend
- Node.js
- Express.js
- OpenAI SDK
- Lingo.dev SDK

---

## 🧪 Key Design Decisions

- **Emotion before translation**: AI enhancement happens before localization
- **Length preservation**: ±5% rule ensures lip-sync accuracy
- **Fail-safe logic**: Original subtitle is used if any service fails
- **Privacy-first**: No subtitles are stored permanently

---

## 🎯 Hackathon Alignment

This project was built specifically to:
- Showcase real-world usage of **Lingo.dev**
- Demonstrate advanced localization beyond word-for-word translation
- Solve a meaningful accessibility and globalization problem
- Combine AI + localization in a production-ready workflow

---

## 🔮 Future Improvements

- Speaker-aware emotion detection
- Auto language detection from content
- Support for live streams
- Subtitle style customization
- Caching & batching for performance

---

## 👨‍💻 Developed By

**Tushar Singh**  
Built for the **Lingo.dev Hackathon** 💚

---

_Subtitles shouldn’t just be readable — they should be feelable._
