// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = nextId;
    nextId++;
    //update the nextId in local storage to reflect the new value
    localStorage.setItem("nextId", JSON.stringify(nextId));
    //return the current id for the task
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
   //this will color code the tasks depending on their due dates
    let today = new Date();
    let dueDate = new Date(task.dueDate);

    let timeDifference = dueDate.getTime() - today.getTime();
    let daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    let cardColorClass = '';
    if (daysDifference < 0) {
        cardColorClass = 'text-late'; //task is overdue
    } else if (daysDifference <= 7) {
        cardColorClass = 'text-warning'; //nearing deadline
    }

    //returns a string with HTML for the task card
    return `
    <div class="task-card card mb-3 ${cardColorClass}" data-id="${task.id}">
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text">${task.dueDate}</p>
                <button class="btn btn-danger delete-task" onclick="handleDeleteTask(event)">Delete</button>
            </div>
         </div>
    `;
}
//added another function to apply and remove color-coding
function applyColorCoding() {
    taskList.forEach(task => {
        let taskCard = $(`[data-id="${task.id}"]`);
        if (task.status === 'done') {
            //removes color-coded classes for tasks in "done" array
            taskCard.removeClass('text-late text-warning');
        } else {
            let today = new Date();
            let dueDate = new Date(task.dueDate);
            let timeDifference = dueDate.getTime() - today.getTime();
            let daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); //this will actively track the task in real time! so cool
            if (daysDifference < 0) {
                taskCard.removeClass('text-warning').addClass('text-late'); //overdue
            } else if (daysDifference <= 7) {
                taskCard.removeClass('text-late').addClass('text-warning'); //nearing the deadline
            } else {
                taskCard.removeClass('text-late text-warning'); //plenty of time
            }
        }
    });
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //these select the containers for tasks in their respective status
    let todoContainer = $('#todo-cards');
    let inProgressContainer = $('#in-progress-cards');
    let doneContainer = $('#done-cards');
    
    todoContainer.empty();
    inProgressContainer.empty();
    doneContainer.empty();
    //updates the status of the dropped task in the tasklist array
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

    applyColorCoding();
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    //grabs task title and due date from the html form inputs
    let title = $('#task-title').val();
    let description = $('#task-description').val();
    let dueDate = $('#task-due-date').val();
    
    //checks if either of them are empty
    if (!title || !dueDate) {
        //if empty, then display this
        alert("Please provide a task title and due date.");
        return;
    }

    //creates a new task
    let newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: 'todo'
    };
    //adds the new task to the tasklist array
    taskList.push(newTask);
    //allows the tasks to be stored in local storage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $('#formModal').modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
   //this will find the closest task card element
    let taskCard = $(event.target).closest('.task-card');
    //this will get the task ID from the data-ID attribute
    let taskId = parseInt(taskCard.data('id'));
    //filters the task with its matching ID
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    //extracts the task id from the dropped task card
    let taskId = parseInt(ui.draggable.data('id'));
    //determines new status based on the lane where you drop the task
    let newStatus = $(event.target).closest('.lane').attr('id').replace('-cards', '');
    
    //updates the status of the now dropped task in the array
    taskList = taskList.map(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
        return task;
    });

    //updates tasklist in the local storage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    //makes lanes droppable
    $('.lane').droppable({
        accept: '.task-card',
        drop: function(event, ui) {
            handleDrop(event, ui);
        }
    });

    //initializes date picker for due date field
    $('#task-due-date').datepicker();

    //adds event listener for adding a new task
    $('#add-task-form').submit(handleAddTask);
});
