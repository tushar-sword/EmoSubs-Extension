console.log("[EmoSubs] Background loaded");

const BACKEND_URL = "https://emosubs-extension.onrender.com/api/enhance"; 

let targetLanguage = null;
let enabled = false;

// Load saved state on startup
chrome.storage.sync.get(
  ["targetLanguage", "enabled"],
  (res) => {
    targetLanguage = res.targetLanguage || null;
    enabled = Boolean(res.enabled);

    console.log("[EmoSubs] Init:", { targetLanguage, enabled });
  }
);

// Listening for messages from popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // handle language 
  if (message.type === "SET_LANGUAGE") {
    targetLanguage = message.language;
    console.log("[EmoSubs] Language set:", targetLanguage);
    return;
  }

  //handle enable/disable
  if (message.type === "SET_ENABLED") {
    enabled = message.enabled;
    console.log("[EmoSubs] Enabled:", enabled);
    return;
  }


  if (message.type === "SUBTITLE_CAPTURED") {

    // extension is enabled and language is set
    if (!enabled || !targetLanguage) {
      console.log("[EmoSubs] Ignored subtitle (disabled or no language selected)");
      return;
    }

    const { text } = message;
    const tabId = sender.tab?.id;

    if (!tabId) {
      console.error("[EmoSubs] No tab ID found");
      return;
    }

    console.log("[EmoSubs] Processing subtitle:", text);
    console.log("[EmoSubs] Target language:", targetLanguage);

    // Send to backend
    fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        targetLang: targetLanguage
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("[EmoSubs] Backend response:", data);

        if (!data?.enhancedText) {
          console.error("[EmoSubs] No enhanced text in response");
          return;
        }

        // enhanced subtitle back to content script
        chrome.tabs.sendMessage(tabId, {
          type: "ENHANCED_SUBTITLE",
          text: data.enhancedText
        });

        console.log("[EmoSubs] Sent enhanced subtitle to tab");
      })
      .catch(err => {
        console.error("[EmoSubs] Backend error:", err);
        
        // Send original text as fallback
        chrome.tabs.sendMessage(tabId, {
          type: "ENHANCED_SUBTITLE",
          text: text
        });
      });
    
    // true return to indicate async response
    return true;
  }
});

// Log when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  console.log("[EmoSubs] Extension icon clicked");
});