let timer;
let isBreak = false;
let cyclesCompleted = 0;

// Function to start the timer
function startTimer(duration) {
    const endTime = Date.now() + duration;
    chrome.storage.local.set({ endTime: endTime, isBreak: isBreak });

    timer = setInterval(() => {
        chrome.storage.local.get(['endTime', 'isBreak'], (result) => {
            const endTime = result.endTime || Date.now();
            const isBreak = result.isBreak || false;
            const remainingTime = endTime - Date.now();

            if (remainingTime <= 0) {
                clearInterval(timer);
                if (isBreak) {
                    cyclesCompleted++;
                    chrome.storage.local.set({ cyclesCompleted });
                    startBreakTimer();
                } else {
                    startBreakTimer();
                }
                isBreak = !isBreak;
                chrome.storage.local.set({ isBreak });
                updateTimerDisplay();
                return;
            }
            chrome.storage.local.set({ savedTime: remainingTime });
            updateTimerDisplay();
        });
    }, 1000);
}

// Function to start the break timer
function startBreakTimer() {
    // Example: Set break duration to 5 minutes (300000 ms)
    const breakDuration = 300000;
    const endTime = Date.now() + breakDuration;
    chrome.storage.local.set({ endTime: endTime, isBreak: true });

    timer = setInterval(() => {
        chrome.storage.local.get(['endTime'], (result) => {
            const endTime = result.endTime || Date.now();
            const remainingTime = endTime - Date.now();

            if (remainingTime <= 0) {
                clearInterval(timer);
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon.png',
                    title: 'Pomodoro Timer',
                    message: 'Break is over! Time to get back to work!',
                });
                return;
            }
            chrome.storage.local.set({ savedTime: remainingTime });
        });
    }, 1000);
}

// Function to update the timer display with notifications
function updateTimerDisplay() {
    chrome.storage.local.get(['savedTime', 'isBreak'], (result) => {
        const savedTime = result.savedTime || 0;
        const isBreak = result.isBreak || false;
        const minutes = Math.floor(savedTime / 60000);
        const seconds = Math.floor((savedTime % 60000) / 1000);
        const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        const message = isBreak ? `Break Time! ${timeString}` : `Work Time! ${timeString}`;

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon.png',
            title: 'Pomodoro Timer',
            message: message,
        });
    });
}

// Handle extension installation or update
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['savedTime', 'isBreak', 'cyclesCompleted'], (result) => {
        if (result.savedTime > 0) {
            startTimer(result.savedTime);
        }
        cyclesCompleted = result.cyclesCompleted || 0;
    });
});

// Handle messages from popup to start the timer
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'startTimer') {
        startTimer(message.duration);
    }
});