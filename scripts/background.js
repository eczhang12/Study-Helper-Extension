// scripts/background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'findDefinition') {
        const word = encodeURIComponent(message.word);
        const url = `https://www.google.com/search?q=define+${word}`;

        // Open a new tab with the definition
        chrome.tabs.create({ url });

        // Add the word to the list in the second sliding panel
        chrome.storage.local.get('wordsList', (result) => {
            const wordsList = result.wordsList || [];
            if (!wordsList.includes(message.word)) {
                wordsList.push(message.word);
                chrome.storage.local.set({ wordsList });
            }
        });
    }
});