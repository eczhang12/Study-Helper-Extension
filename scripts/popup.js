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

function updateTime() {
    chrome.storage.local.get(["timer", "timeOption", "isBreakRunning", "isRunning"], (res) => {
        const time = document.getElementById("time")
        const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0")
        let seconds = "00"
        if (res.timer % 60 != 0) {
            seconds = `${60 - res.timer % 60}`.padStart(2, "0")
        }
        time.textContent = `${minutes}:${seconds}`
        const whichPhase = document.getElementById("phase")
        if (isBreakRunning) {
            whichPhase.textContent = "Break"
        }
        else if (isRunning) {
            whichPhase.textContent = "Work"
        }
    })
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
        isRunning: false,
        isBreakRunning: false
    })
})

chrome.storage.local.get(["timeOption"], (res) => {
    timeOption.value = res.timeOption
    breakTimeOption.value = res.breakTimeOption
})







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
    text.addEventListener("change", () => {
        tasks[taskNum] = text.value
        console.log(tasks)
    })

    const deleteBtn = document.createElement("input")
    deleteBtn.type = "button"
    deleteBtn.value = "X"
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