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
    
    taskList.forEach(task => {
        let taskCard = createTaskCard(task);
        if (task.status === 'todo') {
            todoContainer.append(taskCard);
        } else if (task.status === 'in-progress') {
            inProgressContainer.append(taskCard);
        } else if (task.status === 'done') {
            doneContainer.append(taskCard);
        }
    });
    //this will make them draggable
    $('.task-card').draggable({
         revert: "invalid",
         start: function(event, ui) {
             $(this).addClass('dragging');
         },
         stop: function(event, ui) {
             $(this).removeClass('dragging');
         }
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let title = $('#task-title').val();
    let dueDate = $('#task-due-date').val();
    if (!title || !dueDate) {
        alert("Please provide a task title and due date.");
        return;
    }

    let newTask = {
        id: generateTaskId(),
        title: title,
        dueDate: dueDate,
        status: 'todo'
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskCard = $(event.target).closest('.task-card');
    let taskId = parseInt(taskCard.data('id'));
    
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = parseInt(ui.draggable.data('id'));
    let newStatus = $(event.target).closest('.lane').attr('id').replace('-cards', '');
    
    taskList = taskList.map(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
        return task;
    });
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    // Make lanes droppable
    $('.lane').droppable({
        accept: '.task-card',
        drop: function(event, ui) {
            handleDrop(event, ui);
        }
    });

    // Initialize date picker for due date field
    $('#task-due-date').datepicker();

    // Add event listener for adding a new task
    $('#add-task-form').submit(handleAddTask);
});
