const wrapper = document.querySelector('#wrapper');
const authSection = document.querySelector('#auth-section');
const authForm = document.querySelector('#auth-form');
const authFormName = document.querySelector('#auth-form-name');

const priorityTranslations = {
    'low': 'Низкий',
    'medium': 'Средний',
    'high': 'Высокий'
};

// Глобальные функции-обработчики
function handleTaskActions(e) {
    if (!e.target.matches(".is-done, .delete-button, .edit-button")) return;
    
    const taskElement = e.target.closest(".task-item");
    if (!taskElement) return;
    
    const taskId = taskElement.id;
    
    //получение данных
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = localStorage.getItem("currentUser");
    const user = users.find(u => u.userName === currentUser);
    
    if (!user || !user.tasks) {
        console.error("User or tasks not found");
        return;
    }
    
    const task = user.tasks.find(t => t.id === taskId);
    if (!task) {
        console.error("Task not found");
        return;
    }

    if (e.target.matches(".is-done")) {
        task.checked = task.checked === "notChecked" ? "checked" : "notChecked";
        localStorage.setItem("users", JSON.stringify(users));
        displayTasks(user.tasks);
        
    } else if (e.target.matches(".delete-button")) {
        user.tasks = user.tasks.filter(t => t.id !== taskId);
        localStorage.setItem("users", JSON.stringify(users));
        displayTasks(user.tasks);
        
    } else if (e.target.matches(".edit-button")) {
        const newName = prompt("Введите новый текст задачи:", task.taskName);
        if (newName && newName.trim() !== '') {
            task.taskName = newName.trim();
            localStorage.setItem("users", JSON.stringify(users));
            displayTasks(user.tasks);
        }
    }
}

function handleLogout() {
    localStorage.removeItem("currentUser");
    location.reload(); 
}

function handleAddTask(e) {
    e.preventDefault();
    
    const taskInput = document.querySelector('#task-text');
    const taskText = taskInput.value.trim();
    const priorityLevel = document.querySelector('#priority-level').value;
    const currentUser = localStorage.getItem("currentUser");
    
    if (!taskText || !currentUser) {
        if (!taskText) {
            taskInput.focus();
            alert("Введите текст задачи");
        }
        return;
    }
    
    const users = JSON.parse(localStorage.getItem("users"));
    const userIndex = users.findIndex(user => user.userName === currentUser);
    
    if (userIndex !== -1) {
        const newTask = {
            id: generateUniqueId(),
            taskName: taskText,
            taskPriority: priorityLevel,
            checked: "notChecked",
        };
        
        //проверка на наличие tasks и создание если нет
        if (!users[userIndex].tasks) {
            users[userIndex].tasks = [];
        }
        
        users[userIndex].tasks.push(newTask);
        localStorage.setItem("users", JSON.stringify(users));
        
        taskInput.value = '';
        displayTasks(users[userIndex].tasks);
    }
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function displayTasks(tasks) {
    const tasksContainer = document.getElementById('tasks-container');
    if (!tasksContainer) {
        console.error('tasks-container not found');
        return;
    }
        const safeTasks = Array.isArray(tasks) ? tasks : [];
    
    if (safeTasks.length === 0) {
        tasksContainer.innerHTML = '<p>Нет задач</p>';
        return;
    }
    
    const tasksMarkup = safeTasks.map((task) => `
        <div class="task-item flex justify-between items-center p-3 w-full bg-gray-50 rounded-lg mb-2 shadow-sm" id="${task.id}">
            <span class="priority-${task.taskPriority.toLowerCase()} ${task.checked}">${task.taskName}</span>
            <div class="flex gap-2 items-center text-lg">
                <span class="text-xs">
                ${priorityTranslations[task.taskPriority.toLowerCase()] || task.taskPriority} приоритет
                </span>
                <input type="checkbox" class="is-done cursor-pointer" ${task.checked === "checked" ? 'checked' : ''}>
                <button class="edit-button cursor-pointer">✏️</button>
                <button class="delete-button cursor-pointer">🗑️</button>
            </div>
        </div>
    `).join('');
    
    tasksContainer.innerHTML = tasksMarkup;
}

function showMainInterface(userName) {
    const oldMainContent = document.getElementById('main-content');
    if (oldMainContent) {
        oldMainContent.remove();
    }
    
    const mainMarkup = `<div id="main-content">
        <div id="header" class="flex justify-between items-center max-[490px]:w-full w-[490px]">
            <h2 class="text-lg font-semibold">Привет, ${userName}!</h2>
            <button id="exit-button" class="bg-gray-300 font-bold py-2 px-5 cursor-pointer rounded-xl">Выйти</button>
        </div>
        </div>
        <div class="mb-">
        <form id="task-form" class="flex gap-2 max-[490px]:w-full w-[490px] mb-2">
            <input id="task-text" type="text" placeholder="Введите задачу..." class="border border-gray-300 rounded-lg p-2 px-3 w-5/12">
            <select id="priority-level" class="border border-gray-300 bg-gray-100 rounded-lg p-2 px-3 w-4/12">
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
            </select>
            <input id="add-task" type="submit" value="Добавить" class="bg-sky-600 text-white py-2 px-5 rounded-xl font-bold w-3/12"> 
        </form>
            <div id="tasks-container" class="w-full">
            <p>Нет задач</p>
            </div>
        </div>
    `;
    
    authSection.classList.add("hidden");
    wrapper.insertAdjacentHTML("afterbegin", mainMarkup);
    
    document.getElementById('task-form').addEventListener('submit', handleAddTask);
    document.getElementById('exit-button').addEventListener('click', handleLogout);
    document.getElementById('tasks-container').addEventListener('click', handleTaskActions);

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.userName === userName);
    if (user) {
        user.tasks = user.tasks || [];
        displayTasks(user.tasks);
    }
}

// Обработчик формы авторизации
authForm.addEventListener("submit", (e) => {
    e.preventDefault(); 
    
    const userName = authFormName.value.trim();

    if(userName === "") {
        alert("Введите имя пользователя.");
        return;
    }
    
    if (userName) {
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        
        const existingUserIndex = existingUsers.findIndex(user => user.userName === userName);

        if (existingUserIndex === -1) {
            const newUser = {
                userName: userName,
                tasks: [] 
            };
            existingUsers.push(newUser);
        }
        localStorage.setItem("users", JSON.stringify(existingUsers));
        localStorage.setItem("currentUser", userName);
        
        showMainInterface(userName);
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem("currentUser");
    
    if (currentUser) {
        showMainInterface(currentUser);
    }
});