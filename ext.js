let targetNode;
const targetSelector = "#live-page-chat > div > div > div.Layout-sc-1xcs6mc-0.iTiPMO.chat-shell.chat-shell__expanded > div > div > section > div > div.Layout-sc-1xcs6mc-0.InjectLayout-sc-1i43xsx-0.chat-list--default.font-scale--default.iClcoJ > div.Layout-sc-1xcs6mc-0.InjectLayout-sc-1i43xsx-0.iWWhvN > div.scrollable-area > div.simplebar-scroll-content > div > div";

// Function to observe the target node for changes
function observeTargetNode() {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((newNode) => {
          const specificElements = newNode.querySelectorAll("div > div > div.Layout-sc-1xcs6mc-0.cwtKyw.chat-line__message-container > div:nth-child(2) > div > div > span:nth-child(3) > span.text-fragment");

          specificElements.forEach((specificElement) => {
            const originalText = specificElement.textContent;
            
            // Send the original text for translation
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
                // Set the translated text as the content of the specific element
                specificElement.textContent = data.translatedText;
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

// Function to check for the target node every 5 seconds
function checkForTargetNode() {
  targetNode = document.querySelector(targetSelector);
  
  if (targetNode) {
    console.log("Target node found!");
    observeTargetNode(); // Start observing if the target node is found
    clearInterval(checkInterval); // Stop checking once the node is found
  } else {
    console.log("Target node not found, checking again...");
  }
}

// Check for the target node every 5 seconds
const checkInterval = setInterval(checkForTargetNode, 5000);
