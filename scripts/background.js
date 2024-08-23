chrome.alarms.create("pomodoroTimer",  {
    periodInMinutes: 1/60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroTimer") {
        chrome.storage.local.get(["timer", "isRunning", "isBreakRunning", "timeOption", "breakTimeOption"], (res) => {
            if (res.isRunning) {
                let timer = res.timer + 1;
                let isRunning = true;
                if (timer === 60 * res.timeOption) {
                    this.registration.showNotification("Pomodoro Timer", {
                        body: "Work time is over! Starting break.",
                        icon: "icon.png",
                    });
                    timer = 0;
                    isRunning = false;

                    // Start break timer automatically
                    chrome.storage.local.set({
                        isBreakRunning: true,
                    });
                }
                chrome.storage.local.set({
                    timer,
                    isRunning,
                });
            } else if (res.isBreakRunning) {
                let timer = res.timer + 1;
                let isBreakRunning = true;
                if (timer === 60 * res.breakTimeOption) {
                    this.registration.showNotification("Pomodoro Timer", {
                        body: "Break time is over! You can start another work session.",
                        icon: "icon.png",
                    });
                    timer = 0;
                    isBreakRunning = false;
                }
                chrome.storage.local.set({
                    timer,
                    isBreakRunning,
                });
            }
        });
    }
});

// Initialize storage values on first run or when extension is reloaded
chrome.storage.local.get(["timer", "isRunning", "isBreakRunning", "timeOption", "breakTimeOption"], (res) => {
    chrome.storage.local.set({
        timer: "timer" in res ? res.timer : 0,
        timeOption: "timeOption" in res ? res.timeOption : 25,
        breakTimeOption: "breakTimeOption" in res ? res.breakTimeOption : 5,
        isRunning: "isRunning" in res ? res.isRunning : false,
        isBreakRunning: "isBreakRunning" in res ? res.isBreakRunning : false,
    });
});