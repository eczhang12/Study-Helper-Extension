// Sliding panel functionality
document.querySelectorAll('.open-panel-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelector(`#${this.id.replace('-btn', '-window')}`).classList.add('active');
    });
});

document.querySelectorAll('.close-panel-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.sliding-panel').classList.remove('active');
    });
});

// Timer functionality (as before)
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

// To-Do List functionality
document.getElementById('add-todo-btn').addEventListener('click', () => {
    const input = document.getElementById('todo-input');
    const taskText = input.value.trim();

    if (taskText) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${taskText}
            <button class="delete-btn">Delete</button>
        `;
        document.getElementById('todo-list').appendChild(li);
        input.value = ''; // Clear input field
    }
});

document.getElementById('todo-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
    }
});

// popup.js

document.addEventListener('DOMContentLoaded', function() {
    const wordsListElement = document.getElementById('words-list');

    chrome.storage.local.get('wordsList', (result) => {
        const wordsList = result.wordsList || [];
        wordsListElement.innerHTML = wordsList.map(word => `<li>${word}</li>`).join('');
    });
});

document.getElementById('start-timer-btn').addEventListener('click', startTimer);
document.getElementById('reset-timer-btn').addEventListener('click', resetTimer);