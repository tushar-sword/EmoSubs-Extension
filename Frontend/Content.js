// EmoSubs – Content Script 
console.log("[EmoSubs] Content script loaded on:", window.location.href);

let lastSubtitleText = "";
let lastProcessedTime = 0;
let customSubtitleBox = null;
let subtitleCheckInterval = null;

// create custom subtitlw overlay
function createSubtitleBox() {
  if (customSubtitleBox) return customSubtitleBox;

  customSubtitleBox = document.createElement("div");
  customSubtitleBox.id = "emosubs-subtitle";
  customSubtitleBox.setAttribute("aria-hidden", "true");
  customSubtitleBox.style.display = "none";

  document.body.appendChild(customSubtitleBox);
  console.log("[EmoSubs] ✅ Custom subtitle box created");

  return customSubtitleBox;
}


 // Getting current subtitle text from Hotstar
function getCurrentSubtitleText() {
  // multiple selectors
  const selectors = [
    '.shaka-text-container span',
    '.subtitle-container span',
    '.cues-container span',
    '[class*="subtitle"] span'
  ];

  for (const selector of selectors) {
    const spans = document.querySelectorAll(selector);
    if (spans.length > 0) {
      let fullText = "";
      spans.forEach(span => {
        if (span.innerText) {
          fullText += span.innerText.trim() + " ";
        }
      });
      
      fullText = fullText.trim();
      if (fullText.length > 2) {
        return fullText;
      }
    }
  }

  return "";
}

// Hide original Hotstar subtitles - make invisible but keep in DOM

function hideOriginalSubtitles() {
  const containers = document.querySelectorAll('.shaka-text-container, .subtitle-container, .cues-container');
  
  containers.forEach(container => {
    if (!container.hasAttribute('data-emosubs-hidden')) {
      // Move container way off screen but keep in DOM
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.setAttribute('data-emosubs-hidden', 'true');
    }
  });
}

// Process new subtitle
function processSubtitle(text) {
  const now = Date.now();
  
  if (text === lastSubtitleText && (now - lastProcessedTime) < 300) {
    return;
  }

  console.log("[EmoSubs] 📝 NEW Subtitle captured:", text);

  lastSubtitleText = text;
  lastProcessedTime = now;

  // Show original text in custom box immediately
  const box = createSubtitleBox();
  box.style.display = "block";
  box.innerText = text;
  console.log("[EmoSubs] 👁️ Showing original in custom box");

  // Send to background for enhancement
  console.log("[EmoSubs] 📤 Sending to background for processing...");
  
  chrome.runtime.sendMessage({
    type: "SUBTITLE_CAPTURED",
    text
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("[EmoSubs] ❌ Error:", chrome.runtime.lastError.message);
    }
  });
}

// Check for subtitle changes (called every 250ms)
function checkSubtitles() {
  const currentText = getCurrentSubtitleText();

  if (currentText && currentText.length > 0) {
    // New subtitle found
    if (currentText !== lastSubtitleText) {
      console.log("[EmoSubs] 🆕 Detected subtitle change");
      processSubtitle(currentText);
    }
  } else {
    // No subtitle visible - hide custom box and reset
    if (customSubtitleBox && customSubtitleBox.style.display !== "none") {
      customSubtitleBox.style.display = "none";
      console.log("[EmoSubs] 🙈 No subtitle - hiding custom box");
    }
    // Reset so next subtitle works
    if (lastSubtitleText !== "") {
      lastSubtitleText = "";
      console.log("[EmoSubs] 🔄 Reset for next subtitle");
    }
  }
}

// Start monitoring subtitles
function startMonitoring() {
  console.log("[EmoSubs] 🚀 Starting subtitle monitoring...");

  // Hide original subtitles immediately
  hideOriginalSubtitles();

  // Clear any existing interval
  if (subtitleCheckInterval) {
    clearInterval(subtitleCheckInterval);
  }

  // Check for subtitles every 250ms
  subtitleCheckInterval = setInterval(() => {
    hideOriginalSubtitles(); // Keep them hidden
    checkSubtitles();
  }, 250);

  // Also use mutation observer as backup
  const observer = new MutationObserver(() => {
    hideOriginalSubtitles(); 
    checkSubtitles();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  console.log("[EmoSubs] ✅ Monitoring active");
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ENHANCED_SUBTITLE") {
    console.log("[EmoSubs] 📥 Received ENHANCED:", message.text);
    
    const box = createSubtitleBox();
    box.style.display = "block";
    box.innerText = message.text;
    box.style.opacity = "1";
    
    console.log("[EmoSubs] ✨ Updated to enhanced subtitle");

    sendResponse({ success: true });
  }
  
  return true;
});

// Start when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startMonitoring);
} else {
  setTimeout(startMonitoring, 1000);
}

console.log("[EmoSubs] 🎬 Ready to detect subtitles");