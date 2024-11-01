let targetNode;
const targetSelector = "#live-page-chat > div > div > div.Layout-sc-1xcs6mc-0.iTiPMO.chat-shell.chat-shell__expanded > div > div > section > div > div.Layout-sc-1xcs6mc-0.InjectLayout-sc-1i43xsx-0.chat-list--default.font-scale--default.iClcoJ > div.Layout-sc-1xcs6mc-0.InjectLayout-sc-1i43xsx-0.iWWhvN > div.scrollable-area > div.simplebar-scroll-content > div > div";
let observer;

// Function to observe target node
function observeTargetNode() {
  observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((newNode) => {
          const specificElement = newNode.querySelector("div > div > div.Layout-sc-1xcs6mc-0.cwtKyw.chat-line__message-container > div:nth-child(2) > div > div > span:nth-child(3) > span") || newNode.querySelector("div > div > div.Layout-sc-1xcs6mc-0.cwtKyw.chat-line__message-container > div:nth-child(2) > div > div > span:nth-child(3) > span:nth-child(2)") ;

          if (specificElement) {
            const originalText = specificElement.textContent;

            // Get source language from storage before translating
            chrome.storage.sync.get(['sourceLanguage'], (result) => {
              const sourceLanguage = result.sourceLanguage || 'ar';

              // Translation request
              fetch("https://tweetpic.taila9d411.ts.net/translate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  q: originalText,
                  source: sourceLanguage,
                  target: "en"
                })
              })
              .then(response => response.json())
              .then(data => {
                if (data && data.translatedText) {
                  specificElement.textContent = data.translatedText;
                }
              })
              .catch(error => console.error("Translation API error:", error));
            });
          }
        });
      }
    });
  });

  observer.observe(targetNode, { childList: true });
}

// Start observing the target node
function startObserving() {
  if (!targetNode) return;

  console.log("Starting to observe the target node.");
  observeTargetNode();
}

// Stop observing the target node
function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log("Stopped observing the target node.");
  }
}

// Check for the target node every 5 seconds
function checkForTargetNode() {
  targetNode = document.querySelector(targetSelector);
  
  if (targetNode) {
    console.log("Target node found!");
    startObserving();
    clearInterval(checkInterval);
  } else {
    console.log("Target node not found, checking again...");
  }
}

// Periodic check
const checkInterval = setInterval(checkForTargetNode, 5000);

// Listen for toggle messages from the popup
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggle") {
    request.enabled ? startObserving() : stopObserving();
  }
});
