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


// TIMER FUNCTIONALITY

document.getElementById('start-button').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'start' });
    console.log('Starting timer...');
});

document.getElementById('reset-button').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'reset' });
});

// Update UI with stored values
chrome.storage.local.get(['totalTime', 'isWorkPhase', 'cycleCount'], data => {
    if (data.totalTime !== undefined) {
        updateUI(data.totalTime, data.isWorkPhase, data.cycleCount);
    }
});

function updateUI(totalTime, isWorkPhase, cycleCount) {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    document.getElementById('phase-label').textContent = isWorkPhase ? 'Work' : 'Break';
    document.getElementById('cycle-count').textContent = cycleCount;
}


// To-Do List functionality
const addButton = document.getElementById('add-todo-btn');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Load saved todos from storage
function loadTodos() {
    chrome.storage.local.get('todos', data => {
        if (data.todos) {
            todoList.innerHTML = '';
            data.todos.forEach(todo => {
                addTodoToDOM(todo);
            });
        }
    });
}

// Save todos to storage
function saveTodos() {
    const todos = [];
    todoList.querySelectorAll('li').forEach(item => {
        todos.push(item.textContent.replace('Delete', '').trim());
    });
    chrome.storage.local.set({ todos });
}

// Add a new todo item to the DOM
function addTodoToDOM(todoText) {
    const li = document.createElement('li');
    li.innerHTML = `
        ${todoText}
        <button class="delete-btn">Delete</button>
    `;
    todoList.appendChild(li);
}

// Handle adding new todo items
addButton.addEventListener('click', () => {
    const taskText = todoInput.value.trim();
    if (taskText) {
        addTodoToDOM(taskText);
        todoInput.value = '';
        saveTodos();
    }
});

// Handle deleting todo items
todoList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveTodos();
    }
});

// Load todos when the popup is opened
loadTodos();