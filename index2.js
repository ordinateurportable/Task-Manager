const wrapper = document.querySelector('#wrapper');
const authSection = document.querySelector('#auth-section');
const authForm = document.querySelector('#auth-form');
const authFormName = document.querySelector('#auth-form-name');

const priorityTranslations = {
    'low': 'Низкий',
    'medium': 'Средний',
    'high': 'Высокий'
};

function displayTasks(tasks) {
    const tasksContainer = document.getElementById('tasks-container');

    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = '<p>Нет задач</p>';
        return;
    }
    
    const tasksMarkup = tasks.map((task) => `
        <div class="task-item flex justify-between items-center p-3 w-full bg-gray-50 rounded-lg mb-2 shadow-sm" id="${task.id}">
            <span class="priority-${task.taskPriority.toLowerCase()} ${task.checked}">${task.taskName}</span>
            <div class="flex gap-2 items-center text-lg">
                <span class="text-xs">
                ${priorityTranslations[task.taskPriority.toLowerCase()] || task.taskPriority} приоритет
                </span>
                <input type="checkbox" class="is-done cursor-pointer" id="is-done-checkbox" ${task.checked}>
                <button class="edit-button cursor-pointer">✏️</button>
                <button class="delete-button cursor-pointer">🗑️</button>
            </div>
        </div>
    `).join('');
    
    tasksContainer.innerHTML = tasksMarkup;

}

function showMainInterface(userName) {
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
    
    document.getElementById('task-form').addEventListener('submit', addTask);
    
    document.getElementById('exit-button').addEventListener('click', logout);

    const users = JSON.parse(localStorage.getItem("users"));
    const user = users.find(u => u.userName === userName);
    if (user) {
        displayTasks(user.tasks);
    }
}

authForm.addEventListener("submit", (e) => {
    e.preventDefault(); 
    
    const userName = authFormName.value.trim();

    if(userName === "") {
        // authFormName.classList.add("border-red-500")
        alert("Введите имя пользователя.")
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
        
        console.log(userName); 
        
        showMainInterface(userName);
    }
});


function addTask(e) {
    e.preventDefault();
    
    const taskText = document.querySelector('#task-text').value.trim();
    const priorityLevel = document.querySelector('#priority-level').value;
    const currentUser = localStorage.getItem("currentUser");
    
    if (taskText && currentUser) {
        const users = JSON.parse(localStorage.getItem("users"));
        const userIndex = users.findIndex(user => user.userName === currentUser);
        
        function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        
        if (userIndex !== -1) {
            const newTask = {
                id: generateUniqueId(),
                taskName: taskText,
                taskPriority: priorityLevel,
                checked: "notChecked",
            };
            
            users[userIndex].tasks.push(newTask);
            localStorage.setItem("users", JSON.stringify(users));
            
            document.getElementById('task-text').value = '';
            
            displayTasks(users[userIndex].tasks);
        }
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    location.reload(); 
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem("currentUser");
    
    if (currentUser) {
        showMainInterface(currentUser);

        const users = JSON.parse(localStorage.getItem("users"));
        const user = users.find(u => u.userName === currentUser);
        if (user) {
            const tasksContainer = document.getElementById('tasks-container');


            tasksContainer.addEventListener("click", (e) => {
                if(e.target.matches(".delete-button")) {

                    console.log("clicked")
                    console.log("Task id:", e.target.parentElement.id)
                    console.log("Tasks array before deletion:",user.tasks)

                    const taskId = e.target.parentElement.parentElement.id;

                    const taskInd = user.tasks.findIndex(task => task.id === taskId);
                    console.log("TaskInd:", taskInd)

                    user.tasks.splice(taskInd, 1) 

                    console.log("Tasks array after deletion:", user.tasks)
                    localStorage.setItem("users", JSON.stringify(users));
                    displayTasks(user.tasks);
                    
                    console.log(localStorage.getItem("users"))

                    e.target.parentElement.parentElement.remove();


                }
            })

            tasksContainer.addEventListener("click", (e) => {
                if(e.target.matches(".edit-button")) {

                    console.log("clicked")
                    console.log("Parent element:", e.target.parentElement.parentElement)
                    console.log("Task id:", e.target.parentElement.parentElement.id)

                    const taskId = e.target.parentElement.parentElement.id;

                    const task = user.tasks.find(task => task.id === taskId)
                    console.log(task)

                    const newName = prompt("Введите новый текст задачи:", task.taskName)

                    if(newName !== null && newName.trim() !== '') {
                        task.taskName = newName.trim();
                        console.log(task.taskName);
                        console.log(users);
                        localStorage.setItem("users", JSON.stringify(users));
                        // location.reload();
                        displayTasks(user.tasks); 
                    }
                    
                    console.log(localStorage.getItem("users"))


                }
            })

            tasksContainer.addEventListener("click", (e) => {
                if(e.target.matches(".is-done")) {

                    console.log("clicked")
                    console.log("Parent element:", e.target.parentElement.parentElement)
                    console.log("Task id:", e.target.parentElement.parentElement.id)

                    const taskId = e.target.parentElement.parentElement.id;

                    const task = user.tasks.find(task => task.id === taskId)
                    console.log(task)

                   if(task.checked === "notChecked") {
                    task.checked = "checked"; 

                    localStorage.setItem("users", JSON.stringify(users));
                    // location.reload();
                    displayTasks(user.tasks); 
                   } else {
                    task.checked = "notChecked"; 

                    localStorage.setItem("users", JSON.stringify(users));
                    // location.reload();
                    displayTasks(user.tasks);
                    
                   }

                    // if(newName !== null && newName.trim() !== '') {
                    //     task.taskName = newName.trim();
                    //     console.log(task.taskName);
                    //     console.log(users);
                    //     localStorage.setItem("users", JSON.stringify(users));
                    //     location.reload();
                    // }
                    
                    console.log(localStorage.getItem("users"))
                }
            })

        }
    }
});