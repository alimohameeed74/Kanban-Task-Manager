// 1) Define Main Variables
// ===============================
let toDoTasks = [];
let inProgressTasks = [];
let completedTasks = [];
let toDoCounter = 0;
// ===============================
// ===============================
// Variables for Add Operation
let taskTitle = document.querySelector('#taskTitle');
let priority = document.querySelector('#priority');
let dueDate = document.querySelector('#dueDate');
let description = document.querySelector('#Description');
let addBtn = document.querySelector('#addButton');
let cancelBtn = document.querySelector('#cancelButton');
let closeModal1Button = document.querySelector('#closeModalButton');
// ===============================
// ===============================
// Variables for Get Operation
let toDoTasksList = document.querySelector('#to-do-tasks-list');
let numOfToDoTasks = document.getElementById('num-of-to-do-tasks');
let emptyToDoTasks = document.querySelector('#empty-to-do-tasks');
let inProgressTasksList = document.querySelector('#in-progress-tasks-list');
let numOfInProgressTasks = document.getElementById('num-of-in-progress-tasks');
let emptyInProgressTasks = document.querySelector('#empty-in-progress-tasks');
let completedTasksList = document.querySelector('#completed-tasks-list');
let numOfcompletedTasks = document.getElementById('num-of-completed-tasks');
let emptyCompletedTasks = document.querySelector('#empty-completed-tasks');
// ===============================
// ===============================
// Variables for Update Operation
// ===============================
// ===============================
// Variables for Delete Operation
// ===============================
// 2) Define Main Functions
// ===============================
function init() {
    window.addTask = addTask;
    window.undoTask = undoTask;
    const obj1fromLS = localStorage.getItem('todoTasks');
    const obj2fromLS = localStorage.getItem('inprogressTasks');
    const obj3fromLS = localStorage.getItem('completedTasks');
    const obj4fromLS = localStorage.getItem('todoCounter');
    if (obj1fromLS) {
        toDoTasks = JSON.parse(obj1fromLS);
    }
    if (obj2fromLS) {
        inProgressTasks = JSON.parse(obj2fromLS);
    }
    if (obj3fromLS) {
        completedTasks = JSON.parse(obj3fromLS);
    }
    if (obj4fromLS) {
        toDoCounter = JSON.parse(obj4fromLS);
    }
    dueDate.setAttribute('min', formatDateForInput(new Date()));
    dueDate.value = formatDateForInput(new Date());
    clearForm();
    displayTasks(toDoTasks, 1);
    displayTasks(inProgressTasks, 2);
    displayTasks(completedTasks, 3);
}
function clearForm() {
    taskTitle.value = '';
    priority.value = 'Medium';
    dueDate.value = '';
    description.value = '';
    dueDate.value = formatDateForInput(new Date());
}
function formatDateShort(dateInput) {
    let date;
    if (dateInput === '') {
        date = new Date();
    }
    else {
        date = new Date(dateInput);
    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${month} ${day}`;
}
function timeAgo(createdAt) {
    const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
    const diffMs = Date.now() - date.getTime();
    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60)
        return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
        return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
function fireswal() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: "Task added successfully!"
    });
}
// ===============================
// ===============================
// Functions for Add Operation
function addTask(whichList = 1, index = 0) {
    if (whichList === 1) {
        toDoCounter++;
        localStorage.setItem("todoCounter", JSON.stringify(toDoCounter));
        let newTaskObj = {
            id: toDoCounter,
            title: taskTitle.value,
            priority: priority.value,
            date: dueDate.value,
            desc: description.value,
            lastCreate: new Date()
        };
        toDoTasks.push(newTaskObj);
        fireswal();
    }
    else if (whichList === 2) { // in progress
        inProgressTasks.push(toDoTasks[index]);
        toDoTasks.splice(index, 1);
        inProgressTasks.sort((a, b) => a.id - b.id);
        localStorage.setItem('inprogressTasks', JSON.stringify(inProgressTasks));
        displayTasks(inProgressTasks, 2);
    }
    else if (whichList === 3) { // completed
        completedTasks.push(toDoTasks[index]);
        toDoTasks.splice(index, 1);
        completedTasks.sort((a, b) => a.id - b.id);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        displayTasks(completedTasks, 3);
    }
    clearForm();
    localStorage.setItem('todoTasks', JSON.stringify(toDoTasks));
    displayTasks(toDoTasks, 1);
}
function undoTask(whichList = 1, index = 0) {
    if (whichList === 2) { // in progress
        toDoTasks.push(inProgressTasks[index]);
        inProgressTasks.splice(index, 1);
        toDoTasks.sort((a, b) => a.id - b.id);
        localStorage.setItem('todoTasks', JSON.stringify(toDoTasks));
        displayTasks(toDoTasks, 1);
    }
    else if (whichList === 3) { // completed
        completedTasks.push(inProgressTasks[index]);
        inProgressTasks.splice(index, 1);
        completedTasks.sort((a, b) => a.id - b.id);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        displayTasks(completedTasks, 3);
    }
    clearForm();
    localStorage.setItem('inprogressTasks', JSON.stringify(inProgressTasks));
    displayTasks(inProgressTasks, 2);
}
// ===============================
// ===============================
// Functions for Get Operation
function displayTasks2(list, id) {
    let toDoContainer = '';
    let inProgressContainer = '';
    let completedContainer = '';
    if (id === 1) {
        for (let i = 0; i < list.length; i++) {
            toDoContainer += `
                 <div class="rounded-3 p-3 to-do-item">
                    <div
                      class="mb-3 d-flex justify-content-between align-items-center"
                    >
                      <div
                        style="
                          font-weight: 500;
                          font-size: 10px;
                          color: oklch(0.704 0.04 256.788);
                        "
                        class="d-flex justify-content-start align-items-center"
                      >
                        <i class="fa-solid fa-circle me-2"></i>
                        <span>#<span>${(i >= 10) ? (i >= 100) ? i + 1 : `0${i + 1}` : `00${i + 1}`}</span></span>
                      </div>
                      <div
                        class="d-flex justify-content-center align-items-center"
                      >
                        <button id="editBtn" class="rounded-2 me-2">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button id="deleteBtn" class="rounded-2">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                    <h3 id="task-title">${(list[i]?.title) ? list[i]?.title : 'New task'}</h3>
                    <p id="task-desc">${(list[i]?.desc) ? list[i]?.desc : 'Adding new task'}</p>
                    <div
                      class="d-flex mb-2 justify-content-start align-items-center"
                    >
                      
                      <div
                        class="d-inline-flex p-2 align-items-center rounded-5 task-priority-con-${list[i]?.priority}"
                      >
                        <i
                          style="font-size: 6px"
                          class="fa-solid fa-circle ${list[i]?.priority} me-2"
                        ></i>
                        <span id="task-priority" class="${list[i]?.priority}">${list[i]?.priority}</span>
                      </div>
                    </div>
                    <p>
                        <div
                        class="d-inline-flex p-2 align-items-center rounded-5 task-priority-con-${list[i]?.priority}"
                        >
                        <i
                          style="font-size: 10px"
                          class="fa-regular fa-calendar ${list[i]?.priority} me-2"
                        ></i>
                        <span id="task-date" class="${list[i]?.priority}">${formatDateShort(list[i].date)}</span>
                      </div>

                      <i
                        style="
                          font-size: 12px;
                          color: oklch(0.704 0.04 256.788);
                        "
                        class="fa-regular fa-clock me-1"
                      ></i>
                      <span id="task-last-time">${timeAgo(list[i].lastCreate)}</span>
                    </p>
                    <div
                      class="task-footer pt-3 d-flex justify-content-start align-items-center"
                    >
                      <button
                        id="startBtn"
                        style="font-size: 11px"
                        class="btn btn-warning rounded-3 me-2"
                        onclick="addTask(2,${i});"
                      >
                        <i class="fa-solid fa-play"></i>
                        Start
                      </button>
                      <button
                        style="font-size: 11px"
                        class="btn btn-success rounded-3 me-2"
                        onclick="addTask(3,${i});"
                      >
                        <i class="fa-solid fa-check"></i>
                        Completed
                      </button>
                    </div>
                  </div>
            `;
        }
        toDoTasksList.innerHTML = toDoContainer;
    }
    if (id === 2) {
        for (let i = 0; i < list.length; i++) {
            inProgressContainer += `
                 <div class="rounded-3 p-3 to-do-item">
                    <div
                      class="mb-3 d-flex justify-content-between align-items-center"
                    >
                      <div
                        style="
                          font-weight: 500;
                          font-size: 10px;
                          color: oklch(0.704 0.04 256.788);
                        "
                        class="d-flex justify-content-start align-items-center"
                      >
                        <i style="color: #FFB900;" class="fa-solid fa-circle me-2"></i>
                        <span>#<span>${(i >= 10) ? (i >= 100) ? i + 1 : `0${i + 1}` : `00${i + 1}`}</span></span>
                      </div>
                      <div
                        class="d-flex justify-content-center align-items-center"
                      >
                        <button id="editBtn1" class="rounded-2 me-2">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button id="deleteBtn1" class="rounded-2">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                    <h3 id="task-title1">${(list[i]?.title) ? list[i]?.title : 'New task'}</h3>
                    <p id="task-desc1">${(list[i]?.desc) ? list[i]?.desc : 'Adding new task'}</p>
                    <div
                      class="d-flex mb-2 justify-content-start align-items-center"
                    >
                      
                      <div
                        class="d-inline-flex p-2 align-items-center rounded-5 task-priority-con-${list[i]?.priority}"
                      >
                        <i
                          style="font-size: 6px"
                          class="fa-solid fa-circle ${list[i]?.priority} me-2"
                        ></i>
                        <span id="task-priority1" class="${list[i]?.priority}">${list[i]?.priority}</span>
                      </div>
                    </div>
                    <p>
                        <div
                        class="d-inline-flex p-2 align-items-center rounded-5 task-priority-con-${list[i]?.priority}"
                        >
                        <i
                          style="font-size: 10px"
                          class="fa-regular fa-calendar ${list[i]?.priority} me-2"
                        ></i>
                        <span id="task-date1" class="${list[i]?.priority}">${formatDateShort(list[i].date)}</span>
                      </div>

                      <i
                        style="
                          font-size: 12px;
                          color: oklch(0.704 0.04 256.788);
                        "
                        class="fa-regular fa-clock me-1"
                      ></i>
                      <span id="task-last-time1">${timeAgo(list[i].lastCreate)}</span>
                    </p>
                    <div
                      class="task-footer pt-3 d-flex justify-content-start align-items-center"
                    >
                      <button
                        style="font-size: 11px"
                        class="btn btn-info rounded-3 me-2"
                        onclick="undoTask(2,${i})"
                      >
                        <i class="fa-solid fa-arrow-rotate-left"></i>
                        To Do
                      </button>
                      <button
                        style="font-size: 11px"
                        class="btn btn-success rounded-3 me-2"
                        onclick="undoTask(3,${i})"
                      >
                        <i class="fa-solid fa-check"></i>
                        Completed
                      </button>
                    </div>
                  </div>
            `;
        }
        inProgressTasksList.innerHTML = inProgressContainer;
    }
    if (id === 3) {
        for (let i = 0; i < list.length; i++) {
            completedContainer += `
                 <div class="rounded-3 p-3 to-do-item">
                    <div
                      class="mb-3 d-flex justify-content-between align-items-center"
                    >
                      <div
                        style="
                          font-weight: 500;
                          font-size: 10px;
                          color: oklch(0.704 0.04 256.788);
                        "
                        class="d-flex justify-content-start align-items-center"
                      >
                        <i style="color:#3FCC9E" class="fa-solid fa-circle me-2"></i>
                        <span>#<span>${(i >= 10) ? (i >= 100) ? i + 1 : `0${i + 1}` : `00${i + 1}`}</span></span>
                      </div>
                      <div
                        class="d-flex justify-content-center align-items-center"
                      >
                        <button id="editBtn2" class="rounded-2 me-2">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button id="deleteBtn2" class="rounded-2">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                    <h3 class="text-decoration-line-through" id="task-title2">${(list[i]?.title) ? list[i]?.title : 'New task'}</h3>
                    <p id="task-desc2">${(list[i]?.desc) ? list[i]?.desc : 'Adding new task'}</p>
                    <div
                      class="d-flex mb-2 justify-content-start align-items-center"
                    >
                      
                      <div
                        class="d-inline-flex p-2 align-items-center rounded-5 task-priority-con-${list[i]?.priority} me-3"
                      >
                        <i
                          style="font-size: 6px"
                          class="fa-solid fa-circle ${list[i]?.priority} me-2"
                        ></i>
                        <span id="task-priority2" class="${list[i]?.priority}">${list[i]?.priority}</span>
                        
                      </div>
                      <div>
                      <i
                          style="font-size: 10px"
                          class="fa-regular fa-circle-check"
                        ></i>
                        <span  id="Done">Done</span></div>

                    </div>
                    <p>
                        <div
                        class="d-inline-flex p-2 align-items-center rounded-5 task-priority-con-${list[i]?.priority}"
                        >
                        <i
                          style="font-size: 10px"
                          class="fa-regular fa-calendar ${list[i]?.priority} me-2"
                        ></i>
                        <span id="task-date2" class="${list[i]?.priority}">${formatDateShort(list[i].date)}</span>
                      </div>

                      <i
                        style="
                          font-size: 12px;
                          color: oklch(0.704 0.04 256.788);
                        "
                        class="fa-regular fa-clock me-1"
                      ></i>
                      <span id="task-last-time2">${timeAgo(list[i].lastCreate)}</span>
                    </p>
                    <div
                      class="task-footer pt-3 d-flex justify-content-start align-items-center"
                    >
                      <button
                        disabled
                        style="font-size: 11px"
                        class="btn btn-warning rounded-3 me-2"
                      >
                        <i class="fa-solid fa-play"></i>
                        Start
                      </button>
                      <button
                      disabled
                        style="font-size: 11px"
                        class="btn btn-success rounded-3 me-2"
                      >
                        <i class="fa-solid fa-check"></i>
                        Completed
                      </button>
                    </div>
                  </div>
            `;
        }
        completedTasksList.innerHTML = completedContainer;
    }
}
function displayTasks(list, id) {
    if (id === 1) {
        if (list.length === 0) {
            emptyToDoTasks.classList.replace('d-none', 'd-flex');
            toDoTasksList.classList.add('d-none');
        }
        else {
            emptyToDoTasks.classList.replace('d-flex', 'd-none');
            toDoTasksList.classList.remove('d-none');
        }
        numOfToDoTasks.innerHTML = `${list.length} tasks`;
    }
    if (id === 2) {
        if (list.length === 0) {
            emptyInProgressTasks.classList.replace('d-none', 'd-flex');
            inProgressTasksList.classList.add('d-none');
        }
        else {
            emptyInProgressTasks.classList.replace('d-flex', 'd-none');
            inProgressTasksList.classList.remove('d-none');
        }
        numOfInProgressTasks.innerHTML = `${list.length} tasks`;
    }
    if (id === 3) {
        if (list.length === 0) {
            emptyCompletedTasks.classList.replace('d-none', 'd-flex');
            completedTasksList.classList.add('d-none');
        }
        else {
            emptyCompletedTasks.classList.replace('d-flex', 'd-none');
            completedTasksList.classList.remove('d-none');
        }
        numOfcompletedTasks.innerHTML = `${list.length} tasks`;
    }
    displayTasks2(list, id);
}
// ===============================
// ===============================
// Functions for Update Operation
// ===============================
// ===============================
// Functions for Delete Operation
// ===============================
// 3) Define Main logic
// ===============================
init();
// ===============================
// ===============================
// Logic for Add Operation
cancelBtn.addEventListener('click', clearForm);
closeModal1Button.addEventListener('click', clearForm);
addBtn.addEventListener("click", function () {
    addTask(1);
});
export {};
// ===============================
// ===============================
// Logic for Get Operation
// ===============================
// ===============================
// Logic for Update Operation
// ===============================
// ===============================
// Logic for Delete Operation
// ===============================
//# sourceMappingURL=main.js.map