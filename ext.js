let targetNode;
let observer; // Store the observer to manage it later
let checkInterval = setInterval(checkForTargetNode, 3000);
const targetSelector = "#live-page-chat > div > div > div.Layout-sc-1xcs6mc-0.iTiPMO.chat-shell.chat-shell__expanded > div > div > section > div > div.Layout-sc-1xcs6mc-0.InjectLayout-sc-1i43xsx-0.chat-list--default.font-scale--default.iClcoJ > div.Layout-sc-1xcs6mc-0.InjectLayout-sc-1i43xsx-0.iWWhvN > div.scrollable-area > div.simplebar-scroll-content > div > div";

// Function to observe the target node for changes
function observeTargetNode() {
  console.log("Starting to observe target node for mutations.");

  // If there's already an observer, disconnect it before starting a new one
  if (observer) {
    observer.disconnect();
    console.log("Disconnected the previous observer.");
  }

  observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((newNode) => {
          console.log("New node added:", newNode);

          let specificElements = newNode.querySelectorAll("div > div > div.Layout-sc-1xcs6mc-0.cwtKyw.chat-line__message-container > div:nth-child(2) > div > div > span:nth-child(3) > span.text-fragment");
          
          specificElements.forEach((specificElement) => {
            const originalText = specificElement.textContent;
            console.log("Original text found:", originalText);

            // fetch translation
            fetch("https://tchat-translator.aryarkusuma.my.id/translate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                q: originalText,
                source: "auto",
                target: "en"
              })
            })
            .then(response => response.json())
            .then(data => {
              if (data && data.translatedText) {
                console.log("Translated text received:", data.translatedText);
                // Set the translated text as the content of the specific element
                specificElement.textContent = data.translatedText;
              } else {
                console.warn("Translation API response did not contain translated text:", data);
              }
            })
            .catch(error => console.error("Translation API error:", error));
          });
        });
      }
    });
  });

  observer.observe(targetNode, { childList: true });
}

// Function to check for the target node every 3 seconds
function checkForTargetNode() {
  targetNode = document.querySelector(targetSelector);

  if (targetNode) {
    console.log("Target node found! Starting observation.");
    observeTargetNode(); // Start observing if the target node is found
    clearInterval(checkInterval); // Stop checking once the node is found
  } else {
    console.log("Target node not found, checking again...");
  }
}

// Check for the target node every 3 seconds
// Listen for page changes or history navigation
window.addEventListener('hashchange', () => {
  console.log("Page navigation detected. Restarting interval...");

});


let currentPath = window.location.href;

setInterval(() => {
  if (window.location.href !== currentPath) {
    currentPath = window.location.href;
    console.log('Page path changed:', currentPath);
    clearInterval(checkInterval); // Clear the previous interval
    checkInterval = setInterval(checkForTargetNode, 3000); // Restart the interval
  }
}, 5000); 
