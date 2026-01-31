console.log("[EmoSubs Popup] Loaded");

const languageSelect = document.getElementById("languageSelect");
const toggleSwitch = document.getElementById("toggleSwitch");
const statusText = document.getElementById("statusText");

/**
 * Supported languages (matching your backend)
 */
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },

  { code: "hi", label: "Hindi (हिन्दी)" },
  { code: "ta", label: "Tamil (தமிழ்)" },
  { code: "te", label: "Telugu (తెలుగు)" },
  { code: "ml", label: "Malayalam (മലയാളം)" },
  { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
  { code: "bn", label: "Bengali (বাংলা)" },
  { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "mr", label: "Marathi (मराठी)" },
  { code: "gu", label: "Gujarati (ગુજરાતી)" },
  { code: "ur", label: "Urdu (اردو)" },

  { code: "es", label: "Spanish (Español)" },
  { code: "fr", label: "French (Français)" },
  { code: "de", label: "German (Deutsch)" },
  { code: "it", label: "Italian (Italiano)" },
  { code: "pt", label: "Portuguese (Português)" },
  { code: "ru", label: "Russian (Русский)" },
  { code: "ja", label: "Japanese (日本語)" },
  { code: "ko", label: "Korean (한국어)" },
  { code: "zh", label: "Chinese (中文)" },
  { code: "ar", label: "Arabic (العربية)" },
  { code: "tr", label: "Turkish (Türkçe)" },
  { code: "vi", label: "Vietnamese (Tiếng Việt)" },
  { code: "th", label: "Thai (ไทย)" },
  { code: "id", label: "Indonesian (Bahasa Indonesia)" }
];

/**
 * Update status message
 */
function updateStatus(enabled, language) {
  if (!language) {
    statusText.textContent = "Select a language to enable";
    statusText.style.color = "#9ca3af";
  } else if (enabled) {
    statusText.textContent = `✅ Active - Translating to ${getLanguageLabel(language)}`;
    statusText.style.color = "#4ade80";
  } else {
    statusText.textContent = `⏸️ Paused - Toggle to activate`;
    statusText.style.color = "#fbbf24";
  }
}

/**
 * Get language label from code
 */
function getLanguageLabel(code) {
  const lang = LANGUAGES.find(l => l.code === code);
  return lang ? lang.label : code;
}

/**
 * Populate language dropdown
 */
languageSelect.appendChild(new Option("Select language...", ""));

LANGUAGES.forEach(({ code, label }) => {
  languageSelect.appendChild(new Option(label, code));
});

/**
 * Load saved state
 */
chrome.storage.sync.get(
  ["targetLanguage", "enabled"],
  ({ targetLanguage, enabled }) => {

    if (targetLanguage) {
      languageSelect.value = targetLanguage;
      toggleSwitch.disabled = false;
    }

    toggleSwitch.checked = Boolean(enabled);
    updateStatus(enabled, targetLanguage);
    
    console.log("[Popup] Loaded state:", { targetLanguage, enabled });
  }
);

/**
 * Handle language selection
 */
languageSelect.addEventListener("change", () => {
  const lang = languageSelect.value;

  if (!lang) {
    // No language selected - disable toggle
    toggleSwitch.checked = false;
    toggleSwitch.disabled = true;
    chrome.storage.sync.set({ enabled: false, targetLanguage: null });
    updateStatus(false, null);
    console.log("[Popup] Language cleared");
    return;
  }

  // Language selected - enable toggle
  toggleSwitch.disabled = false;
  chrome.storage.sync.set({ targetLanguage: lang });

  // Notify background script
  chrome.runtime.sendMessage({
    type: "SET_LANGUAGE",
    language: lang
  });

  updateStatus(toggleSwitch.checked, lang);
  console.log("[Popup] ✅ Language selected:", lang, "-", getLanguageLabel(lang));
});

/**
 * Handle toggle ON/OFF
 */
toggleSwitch.addEventListener("change", () => {
  const enabled = toggleSwitch.checked;
  const lang = languageSelect.value;

  chrome.storage.sync.set({ enabled });

  // Notify background script
  chrome.runtime.sendMessage({
    type: "SET_ENABLED",
    enabled
  });

  updateStatus(enabled, lang);
  console.log("[Popup] EmoSubs enabled:", enabled);
});

console.log("[Popup] Ready");