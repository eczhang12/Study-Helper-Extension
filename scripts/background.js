let timerId;
let totalTime;
let isWorkPhase = true;
let cycleCount = 0;

// Function to start the timer
function startTimer() {
    if (timerId) return; // Prevent multiple timers

    setPhaseDuration(); // Set initial phase duration

    timerId = setInterval(() => {
        totalTime--;
        updateStorage();

        if (totalTime <= 0) {
            handlePhaseTransition();
        }
    }, 1000);
}

// Function to set the duration of the current phase
function setPhaseDuration() {
    chrome.storage.local.get(['workTime', 'breakTime'], data => {
        totalTime = parseInt(isWorkPhase ? data.workTime : data.breakTime) * 60;
        updateStorage();
    });
}

// Function to handle the transition between work and break phases
function handlePhaseTransition() {
    if (isWorkPhase) {
        isWorkPhase = false;
    } else {
        cycleCount++;
        isWorkPhase = true;
    }
    setPhaseDuration();
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkPhase = true;
    cycleCount = 0;
    updateStorage();
}

// Function to update the stored timer and cycle count
function updateStorage() {
    chrome.storage.local.set({ totalTime, isWorkPhase, cycleCount });
}

// Initialize storage with default values if not already set
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['workTime', 'breakTime'], data => {
        if (data.workTime === undefined || data.breakTime === undefined) {
            chrome.storage.local.set({ workTime: 25, breakTime: 5 });
        }
    });
});

// Listen for messages from the popup to start or reset the timer
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        startTimer();
    } else if (message.action === 'reset') {
        resetTimer();
    }
});
