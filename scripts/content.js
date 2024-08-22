// scripts/content.js

document.addEventListener('mouseup', function(event) {
    const selection = window.getSelection().toString().trim();

    // Remove any existing button
    const existingButton = document.getElementById('find-definition-btn');
    if (existingButton) {
        existingButton.remove();
    }

    if (selection) {
        const range = window.getSelection().getRangeAt(0);
        const button = document.createElement('button');
        button.id = 'find-definition-btn';
        button.textContent = 'Find Definition';
        button.style.position = 'absolute';
        button.style.left = `${range.getBoundingClientRect().left}px`;
        button.style.top = `${range.getBoundingClientRect().bottom + window.scrollY}px`;
        button.style.zIndex = 1000;

        button.addEventListener('click', function() {
            chrome.runtime.sendMessage({ action: 'findDefinition', word: selection });
            button.remove();
        });

        document.body.appendChild(button);
    }
});