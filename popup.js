// Function to open a sliding panel
function openPanel(panelId) {
    document.querySelector(panelId).classList.add('active');
}

// Function to close a sliding panel
function closePanel() {
    this.closest('.sliding-panel').classList.remove('active');
}

// Attach event listeners to open buttons
document.querySelector('#pomodoro-btn').addEventListener('click', () => openPanel('#pomodoro-window'));
document.querySelector('#terms-btn').addEventListener('click', () => openPanel('#terms-window'));
document.querySelector('#to-study-btn').addEventListener('click', () => openPanel('#to-study-window'));

// Attach event listeners to close buttons
document.querySelectorAll('.close-panel-btn').forEach(button => {
    button.addEventListener('click', closePanel);
});