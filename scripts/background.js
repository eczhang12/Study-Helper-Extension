let timerInterval;
let totalTime;
let isWorkPhase = true;
let cycleCount = 0;

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'pomodoro') {
        chrome.storage.local.get(['isWorkPhase', 'cycleCount'], result => {
            isWorkPhase = result.isWorkPhase ?? true;
            cycleCount = result.cycleCount ?? 0;

            // Notify user
            chrome.notifications.create('pomodoro-notification', {
                type: 'basic',
                iconUrl: 'icon128.png',
                title: 'Pomodoro Timer',
                message: isWorkPhase ? 'Time’s up! Take a break!' : 'Break time is over! Back to work!',
                buttons: [{ title: 'Dismiss' }]
            });

            // Increment cycle count if work phase is over
            if (isWorkPhase) {
                cycleCount++;
                chrome.storage.local.set({ cycleCount });
            }

            // Toggle phase
            isWorkPhase = !isWorkPhase;
            chrome.storage.local.set({ isWorkPhase });

            // Set next phase duration
            setPhaseDuration();
            chrome.alarms.create('pomodoro', { when: Date.now() + totalTime * 1000 });
        });
    }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId === 'pomodoro-notification') {
        chrome.notifications.clear('pomodoro-notification');
    }
});

function setPhaseDuration() {
    chrome.storage.local.get(['workTime', 'breakTime', 'isWorkPhase'], result => {
        const workTime = result.workTime ?? 25;
        const breakTime = result.breakTime ?? 5;
        totalTime = (isWorkPhase ? workTime : breakTime) * 60;
    });
}

function startTimer(duration) {
    totalTime = duration;
    setPhaseDuration();
    chrome.alarms.create('pomodoro', { when: Date.now() + totalTime * 1000 });
}

function resetTimer() {
    chrome.alarms.clear('pomodoro');
    totalTime = 0;
    isWorkPhase = true;
    cycleCount = 0;
    chrome.storage.local.set({ cycleCount, isWorkPhase });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startTimer') {
        startTimer(message.duration);
    } else if (message.action === 'resetTimer') {
        resetTimer();
    }
});