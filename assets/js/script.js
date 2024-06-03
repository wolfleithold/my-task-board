// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    return `
    <div class="task-card card mb-3" data-id="${task.id}">
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.dueDate}</p>
            <button class="btn btn-danger delete-task" onclick="handleDeleteTask(event)">Delete</button>
        </div>
    </div>
`;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let todoContainer = $('#todo-cards');
    let inProgressContainer = $('#in-progress-cards');
    let doneContainer = $('#done-cards');
    
    todoContainer.empty();
    inProgressContainer.empty();
    doneContainer.empty();
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
