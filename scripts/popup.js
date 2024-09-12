// Sliding panel functionality
document.querySelectorAll('.open-panel-btn').forEach(button => {
    button.addEventListener('click', () => {
        const panelId = `#${button.id.replace('-btn', '-window')}`;
        document.querySelector(panelId).classList.add('active');
    });
});

document.querySelectorAll('.close-panel-btn').forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.sliding-panel').classList.remove('active');
    });
});


const resetTimerBtn = document.getElementById("reset-timer-btn")
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
        isBreakRunning: false
    }, () => {
        startTimerBtn.textContent = "Start Timer"
        updateTime();
    })
})

const startTimerBtn = document.getElementById("start-timer-btn")
startTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
        })
    })
    
})

const time = document.getElementById("time")
const whichPhase = document.getElementById("phase")
function updateTime() {
  chrome.storage.local.get(["timer", "breakTimer", "timeOption", "breakTimeOption", "isBreakRunning", "isRunning"], (res) => {
      const time = document.getElementById("time");

      let minutes;
      let seconds = "00";

      // Work timer running or paused, default to work time if both are false
      if (res.isRunning || (!res.isRunning && !res.isBreakRunning)) {
          minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
          if (res.timer % 60 !== 0) {
              seconds = `${60 - res.timer % 60}`.padStart(2, "0");
          }
          whichPhase.textContent = res.isRunning ? "Work" : "Paused";  // Show "Work" or "Paused"
      }
      // Break timer running
      else if (res.isBreakRunning) {
          minutes = `${res.breakTimeOption - Math.ceil(res.breakTimer / 60)}`.padStart(2, "0");
          if (res.breakTimer % 60 !== 0) {
              seconds = `${60 - res.breakTimer % 60}`.padStart(2, "0");
          }
          whichPhase.textContent = "Break";
      }

      time.textContent = `${minutes}:${seconds}`;
  });
}


updateTime()
setInterval(updateTime, 1000)

const timeOption = document.getElementById("work-time-option")
timeOption.addEventListener("change", (event) => {
    const val = event.target.value
    if (val < 1 || val > 60) {
        timeOption.value = 25
    }
})

const breakTimeOption = document.getElementById("break-time-option")
timeOption.addEventListener("change", (event) => {
    const val = event.target.value
    if (val < 1 || val > 60) {
        breakTimeOption.value = 5
    }
})

const saveBtn = document.getElementById("save-btn")
saveBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        breakTimer: 0,
        timeOption: timeOption.value,
        breakTimeOption: breakTimeOption.value,
        isRunning: false,
        isBreakRunning: false
    })
})

chrome.storage.local.get(["timeOption", "breakTimeOption"], (res) => {
    timeOption.value = res.timeOption
    breakTimeOption.value = res.breakTimeOption
})



// ANKI WORD LIST

document.addEventListener("DOMContentLoaded", () => {
    const wordListElement = document.getElementById("wordList");
    const createAnkiButton = document.getElementById("createAnkiCards");
  
    // Load the stored word list
    chrome.storage.local.get(["wordList"], (result) => {
      const wordList = result.wordList || [];
      wordList.forEach((word) => {
        addWordToUI(word);
      });
    });
  
    // Create Anki flashcards
    createAnkiButton.addEventListener("click", () => {
      chrome.storage.local.get(["wordList"], (result) => {
        const wordList = result.wordList || [];
  
        // Prepare notes for AnkiConnect
        const notes = wordList.map((word) => ({
          deckName: "Default",
          modelName: "Basic",
          fields: {
            Front: word,
            Back: `Definition of ${word}`
          },
          options: {
            allowDuplicate: false
          },
          tags: ["generated"]
        }));
  
        // Send the notes to AnkiConnect
        fetch("http://localhost:8765", {
          method: "POST",
          body: JSON.stringify({
            action: "addNotes",
            version: 6,
            params: { notes: notes }
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error("Error adding notes:", data.error);
          } else {
            alert("Flashcards created successfully in Anki!");
          }
        })
        .catch(error => console.error("Failed to connect to Anki:", error));
      });
    });
  
    // Function to add word to the UI
    function addWordToUI(word) {
      const li = document.createElement("li");
      li.textContent = word;
  
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", () => {
        deleteWord(word, li);
      });
  
      li.appendChild(deleteButton);
      wordListElement.appendChild(li);
    }
  
    // Function to delete a word
    function deleteWord(word, listItem) {
      chrome.storage.local.get(["wordList"], (result) => {
        let wordList = result.wordList || [];
        wordList = wordList.filter((w) => w !== word);
        chrome.storage.local.set({ wordList: wordList }, () => {
          wordListElement.removeChild(listItem);
        });
      });
    }
  });
  











// TO DO LIST

let tasks = []

const addTaskBtn = document.getElementById("add-task-btn")
const saveTaskBtn = document.getElementById("save-task-btn")
addTaskBtn.addEventListener("click", () => addTask())
saveTaskBtn.addEventListener("click", () => saveTasks())

chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : []
    renderTasks()
})

function saveTasks() {
    chrome.storage.sync.set({
        tasks,
    })
}

function renderTask(taskNum) {
    
    const taskRow = document.createElement("div")

    const text = document.createElement("input")
    text.type = "text"
    text.placeholder = "Enter a task..."
    text.value = tasks[taskNum]
    text.className = "task-input"
    text.addEventListener("change", () => {
        tasks[taskNum] = text.value
        console.log(tasks)
    })

    const deleteBtn = document.createElement("input")
    deleteBtn.type = "button"
    deleteBtn.value = "X"
    deleteBtn.className = "task-delete"
    deleteBtn.addEventListener("click", () => {
        deleteTask(taskNum)
    })

    taskRow.appendChild(text);
    taskRow.appendChild(deleteBtn)

    const taskContainer = document.getElementById("task-container")
    taskContainer.appendChild(taskRow)
    saveTasks()
}

function addTask() {
    const taskNum = tasks.length
    tasks.push("")
    renderTask(taskNum)
    saveTasks()
}

function deleteTask(taskNum) {
    tasks.splice(taskNum, 1)
    renderTasks()
    saveTasks()
}

function renderTasks() {
    const taskContainer = document.getElementById("task-container")
    taskContainer.textContent = ""
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum)
    })
}