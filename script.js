/* =========================
   DOM ELEMENTS
========================= */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");

const clearAllBtn = document.getElementById("clearAllBtn");
const themeToggle = document.getElementById("themeToggle");

const taskTemplate = document.getElementById("taskTemplate");

/* =========================
   STORAGE KEYS
========================= */

const TASKS_KEY = "todo_tasks";
const THEME_KEY = "todo_theme";

/* =========================
   APP STATE
========================= */

let tasks = [];

/* =========================
   INITIALIZATION
========================= */

document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    loadTasks();
    renderTasks();
});

/* =========================
   ADD TASK
========================= */

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text,
        completed: false
    };

    tasks.unshift(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

/* =========================
   SEARCH TASKS
========================= */

searchInput.addEventListener("input", renderTasks);

/* =========================
   CLEAR ALL TASKS
========================= */

clearAllBtn.addEventListener("click", () => {
    if (tasks.length === 0) return;

    const confirmed = confirm(
        "Are you sure you want to delete all tasks?"
    );

    if (!confirmed) return;

    tasks = [];

    saveTasks();
    renderTasks();
});

/* =========================
   THEME TOGGLE
========================= */

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        THEME_KEY,
        isDark ? "dark" : "light"
    );

    updateThemeIcon();
});

/* =========================
   LOAD THEME
========================= */

function loadTheme() {
    const savedTheme =
        localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark =
        document.body.classList.contains("dark");

    themeToggle.textContent = isDark
        ? "☀️"
        : "🌙";
}

/* =========================
   TASK RENDERING
========================= */

function renderTasks() {

    taskList.innerHTML = "";

    const searchTerm =
        searchInput.value.toLowerCase().trim();

    const filteredTasks = tasks.filter(task =>
        task.text
            .toLowerCase()
            .includes(searchTerm)
    );

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const template =
            taskTemplate.content.cloneNode(true);

        const taskItem =
            template.querySelector(".task-item");

        const checkbox =
            template.querySelector(".task-checkbox");

        const taskText =
            template.querySelector(".task-text");

        const completeBtn =
            template.querySelector(".complete-btn");

        const deleteBtn =
            template.querySelector(".delete-btn");

        taskText.textContent = task.text;

        checkbox.checked = task.completed;

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        /* Checkbox Toggle */

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        /* Complete Button Toggle */

        completeBtn.addEventListener("click", () => {
            toggleTask(task.id);
        });

        /* Delete Button */

        deleteBtn.addEventListener("click", () => {

            const confirmed = confirm(
                "Delete this task?"
            );

            if (!confirmed) return;

            deleteTask(task.id);
        });

        taskList.appendChild(template);
    });

    updateCounters();
}

/* =========================
   TOGGLE TASK
========================= */

function toggleTask(id) {

    tasks = tasks.map(task => {

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

/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();
    renderTasks();
}

/* =========================
   COUNTERS
========================= */

function updateCounters() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed)
             .length;

    const pending =
        total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

/* =========================
   LOCAL STORAGE
========================= */

function saveTasks() {

    localStorage.setItem(
        TASKS_KEY,
        JSON.stringify(tasks)
    );
}

function loadTasks() {

    const savedTasks =
        localStorage.getItem(TASKS_KEY);

    if (!savedTasks) return;

    try {
        tasks = JSON.parse(savedTasks);
    } catch (error) {
        console.error(
            "Error loading tasks:",
            error
        );

        tasks = [];
    }
}