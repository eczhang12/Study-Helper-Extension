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


// Timer functionality
let timerInterval;
let totalTime;
let isWorkPhase = true;
let cycleCount = 0;
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const phaseLabel = document.getElementById('phase-label');
const workTimeInput = document.getElementById('work-time-input');
const breakTimeInput = document.getElementById('break-time-input');
const cycleCountSpan = document.getElementById('cycle-count');

function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals

    setPhaseDuration(); // Set initial phase duration

    timerInterval = setInterval(() => {
        totalTime--;
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        minutesSpan.textContent = String(minutes).padStart(2, '0');
        secondsSpan.textContent = String(seconds).padStart(2, '0');

        if (totalTime <= 0) {
            if (isWorkPhase) {
                // Switch to break phase
                isWorkPhase = false;
                setPhaseDuration();
            } else {
                // Increment cycle count after completing a break
                cycleCount++;
                cycleCountSpan.textContent = cycleCount;
                // Reset to work phase for the next cycle
                isWorkPhase = true;
                setPhaseDuration();
            }
        }
    }, 1000);
}

function setPhaseDuration() {
    totalTime = parseInt(isWorkPhase ? workTimeInput.value : breakTimeInput.value) * 60;
    phaseLabel.textContent = isWorkPhase ? 'Work' : 'Break';
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    minutesSpan.textContent = String(minutes).padStart(2, '0');
    secondsSpan.textContent = String(seconds).padStart(2, '0');
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isWorkPhase = true; // Reset to work phase
    cycleCount = 0; // Reset cycle count
    cycleCountSpan.textContent = cycleCount;
    setPhaseDuration(); // Reset timer to initial work duration
}

document.getElementById('start-timer-btn').addEventListener('click', startTimer);
document.getElementById('reset-timer-btn').addEventListener('click', resetTimer);