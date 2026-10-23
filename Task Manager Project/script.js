
/* Get HTML Elements */
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const errorMessage = document.getElementById("errorMessage");
const clearCompletedButton = document.getElementById("clearCompleted");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");

/* Store Tasks */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* Save Tasks in Local Storage */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Add a New Task */
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Validate Input
    if (taskText === "") {
        errorMessage.textContent = "Please enter a task!";
        taskInput.focus();
        return;
    }

    // Create Task Object
    const task = {
        id: Date.now() + Math.random(),
        text: taskText,
        completed: false
    };

    // Add Task to Array
    tasks.push(task);

    // Save and Update Page
    saveTasks();
    renderTasks();

    // Clear Input
    taskInput.value = "";
    errorMessage.textContent = "";
    taskInput.focus();
});

/* Render Tasks on the Page */
function renderTasks() {
    taskList.innerHTML = "";

    // Filter Tasks
    let filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Display Each Task
    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = "list-group-item task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        // Task Content
        const content = document.createElement("div");
        content.className = "task-content";

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        // Task Text
        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        content.appendChild(checkbox);
        content.appendChild(span);

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-sm btn-danger delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete " + task.text);

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        // Add Elements to List
        li.appendChild(content);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });

    // Update Incomplete Task Counter
    const activeCount = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCounter.textContent =
        activeCount + (activeCount === 1 ? " task left" : " tasks left");

    // Show Message if Current Filter Has No Tasks
    if (filteredTasks.length === 0) {
        emptyMessage.classList.remove("d-none");

        if (tasks.length === 0) {
            emptyMessage.textContent =
                "No tasks yet. Add your first task!";
        } else if (currentFilter === "active") {
            emptyMessage.textContent = "No active tasks!";
        } else if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks!";
        } else {
            emptyMessage.textContent = "No tasks to display!";
        }
    } else {
        emptyMessage.classList.add("d-none");
    }

    // Disable Clear Button if Nothing Is Completed
    const hasCompletedTasks = tasks.some(function (task) {
        return task.completed;
    });

    clearCompletedButton.disabled = !hasCompletedTasks;
}

/* Mark Task as Completed or Active */
function toggleTask(id) {
    tasks = tasks.map(function (task) {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

/* Delete a Selected Task */
function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

/* Filter Tasks */
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        // Update Active Filter Button
        filterButtons.forEach(function (btn) {
            btn.classList.remove("btn-primary");
            btn.classList.add("btn-outline-primary");
        });

        button.classList.remove("btn-outline-primary");
        button.classList.add("btn-primary");

        renderTasks();
    });
});

/* Clear All Completed Tasks */
clearCompletedButton.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});

/* Clear Validation Message When Typing */
taskInput.addEventListener("input", function () {
    errorMessage.textContent = "";
});

/* Display Saved Tasks on Page Load */
renderTasks();
