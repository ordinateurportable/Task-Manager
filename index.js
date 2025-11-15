const body = document.querySelector('body');
const wrapper = document.querySelector('#wrapper');


document.addEventListener("DOMContentLoaded", () => {
    const mainMarkup = `<div id="main-content">
        <div id="header" class="flex justify-between items-center max-[490px]:w-full w-[490px]">
            <h2 class="text-lg font-semibold">Привет, ${authFormName.value}!</h2>
            <button id="exit-button" class="bg-gray-300 font-bold py-2 px-5 cursor-pointer rounded-xl">Выйти</button>
        </div>
    </div>
        <div class="">
        <form class="flex gap-2 max-[490px]:w-full w-[490px]">
        <input id="task-text" type="text" placeholder="Введите задачу..." class="border-1 border-gray-300 rounded-lg p-2 px-3 w-5/12">
        <select id="priority-level" class="border-1 border-gray-300 bg-gray-100 rounded-lg p-2 px-3 w-4/12">
            <option>Низкий</option>
            <option>Средний</option>
            <option>Высокий</option>
        </select>
        <input id="add-task" type="submit" value="Добавить" class="bg-sky-600 text-white py-2 px-5 rounded-xl font-bold w-3/12"> 
        </form>
    </div>
    <p>Нет задач</p>`

    wrapper.insertAdjacentHTML("afterbegin", authFormMarkup)
    const authForm = document.querySelector('#authForm');
    let userAuthorised = false;


    if(userAuthorised) {
        wrapper.innerHTML = "";
        wrapper.insertAdjacentHTML("afterbegin", mainMarkup)
    }

    authForm.addEventListener("submit", (e) => {
    e.preventDefault;
    const authFormName = document.querySelector('#authFormName');
    
    wrapper.insertAdjacentHTML("afterbegin", authFormMarkup)
    const authForm = document.querySelector('#authForm');
    userAuthorised = true;

    })
    
})

const authFormMarkup = `
        <h1 class="text-3xl font-bold">
            Task Manager
        </h1>
        <p class="text-gray-500">Войдите, чтобы управлять своими задачами</p>
        <form id="authForm" class="flex flex-col items-center gap-4 w-full">
            <input type="text" id="authFormName" placeholder="Ваше имя" class="border-1 border-gray-300 rounded-lg p-2 px-3 w-full">
            <input type="submit" value="Войти" class="bg-sky-600 text-white w-fit py-2 px-5 rounded-xl font-bold">
        </form>`



