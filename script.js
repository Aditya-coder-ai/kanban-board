const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
let dragElement = null;

console.log(todo,progress,done);

const tasks = document.querySelectorAll('.task');

function makeDraggable(task) {
    task.addEventListener("dragstart",(e) =>{
        dragElement = task;
        console.log(" started dragging:", dragElement);
    })
}

tasks.forEach(task => {
    makeDraggable(task);
});

function addDeleteListener(deleteBtn) {
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const parentColumn = deleteBtn.closest('.task-column');
        deleteBtn.closest('.task').remove();
        updateCount(parentColumn);
    });
}

document.querySelectorAll('.task .delete-btn').forEach(deleteBtn => {
    addDeleteListener(deleteBtn);
});

function updateDeleteBtnColor(task) {
    const deleteBtn = task.querySelector('.delete-btn');
    const parentColumn = task.closest('.task-column');
    
    if (parentColumn && parentColumn.id === 'done') {
        deleteBtn.style.backgroundColor = '#27ae60';
        deleteBtn.style.color = 'white';
    } else if (parentColumn && parentColumn.id === 'progress') {
        deleteBtn.style.backgroundColor = '#2737ae';
        deleteBtn.style.color = 'white';
    } else {
        deleteBtn.style.backgroundColor = '';
        deleteBtn.style.color = '';
    }
}
function addEventListenerOnColumn(column){
    column.addEventListener("dragenter",(e)=>{
        e.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave",(e)=>{
        e.preventDefault();
        column.classList.remove("hover-over");
    })
    column.addEventListener("dragover",(e)=>{
        e.preventDefault();
    })
    column.addEventListener("drop",(e)=>{
        e.preventDefault();
        console.log("dragged", dragElement, column);
        
        column.appendChild(dragElement);
        column.classList.remove("hover-over");
        updateDeleteBtnColor(dragElement);
    })
};
addEventListenerOnColumn(todo);
addEventListenerOnColumn(progress);
addEventListenerOnColumn(done);


const toggleModalBtn = document.querySelector("#toggle-modal");
const modalbg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");

if (toggleModalBtn) {
    toggleModalBtn.addEventListener("click", () => {
        modal.classList.toggle("active");
    });
}

if (modalbg) {
    modalbg.addEventListener("click", (e) => {
        e.stopPropagation();
        modal.classList.remove("active");
    });
}
const addTaskBtn = document.getElementById("add-new-task");
const titleInput = document.getElementById("task-title-input");
const descInput = document.getElementById("task-desc");
const todoColumn = document.getElementById("todo");
const columns = document.querySelectorAll(".task-column");

let draggedTask = null;

function updateCount(column) {
    const count = column.querySelectorAll(":scope > .task").length;
    column.querySelector(".heading .right").textContent = count;
}

function updateAllCounts() {
    columns.forEach(col => updateCount(col));
}

document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("task")) {
        draggedTask = e.target;
        setTimeout(() => draggedTask.classList.add("hide"), 0);
    }
});

document.addEventListener("dragend", () => {
    if (draggedTask) {
        draggedTask.classList.remove("hide");
        draggedTask = null;
    }
});

columns.forEach(column => {
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", () => {
        if (draggedTask) {
            column.appendChild(draggedTask);
            updateAllCounts();
            updateDeleteBtnColor(draggedTask);
        }
    });
});

addTaskBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    if (!title || !desc) return;

    const task = document.createElement("div");
    task.className = "task";
    task.draggable = true;

    task.innerHTML = `
        <div class="task-tittle">
            <h2>${title}</h2>
            <p>${desc}</p>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    todoColumn.appendChild(task);

    task.querySelector(".delete-btn").addEventListener("click", () => {
        const parentColumn = task.closest(".task-column");
        task.remove();
        updateCount(parentColumn);
    });

    titleInput.value = "";
    descInput.value = "";

    updateAllCounts();
});
updateAllCounts();
