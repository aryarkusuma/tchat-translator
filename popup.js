document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle-button");
    const languageDropdown = document.getElementById("source-language");

    // Load the initial toggle state and language from storage
    chrome.storage.sync.get(['translatorEnabled', 'sourceLanguage'], (result) => {
        const isEnabled = result.translatorEnabled !== undefined ? result.translatorEnabled : true;
        const sourceLanguage = result.sourceLanguage || 'ar';

        toggleButton.textContent = isEnabled ? "Disable Translator" : "Enable Translator";
        languageDropdown.value = sourceLanguage;
    });

    // Toggle translation on button click
    toggleButton.addEventListener("click", () => {
        chrome.storage.sync.get(['translatorEnabled'], (result) => {
            const currentState = result.translatorEnabled !== undefined ? result.translatorEnabled : true;
            const newState = !currentState;

            // Save the new state to storage
            chrome.storage.sync.set({ translatorEnabled: newState }, () => {
                toggleButton.textContent = newState ? "Disable Translator" : "Enable Translator";

                // Send a message to the content script to enable/disable translation
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle", enabled: newState });
                    }
                });
            });
        });
    });

    // Update selected language in storage
    languageDropdown.addEventListener("change", () => {
        const selectedLanguage = languageDropdown.value;
        chrome.storage.sync.set({ sourceLanguage: selectedLanguage });
    });
});
