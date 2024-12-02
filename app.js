let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentEditIndex = null;

document.getElementById("add-task").addEventListener("click", () => {
    const text = document.getElementById("task-input").value.trim();
    const date = document.getElementById("task-date").value;
    const time = document.getElementById("task-time").value;

    if (text && date && time) {
        tasks.push({ text, date, time, notified: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        clearInputFields();
    }
});

function clearInputFields() {
    document.getElementById("task-input").value = "";
    document.getElementById("task-date").value = "";
    document.getElementById("task-time").value = "";
}

function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${task.text} - ${task.date} ${task.time}</span>
            <div>
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

window.editTask = function (index) {
    const task = tasks[index];
    currentEditIndex = index;
    document.getElementById("edit-task-input").value = task.text;
    document.getElementById("edit-task-date").value = task.date;
    document.getElementById("edit-task-time").value = task.time;
    document.getElementById("edit-modal").style.display = "flex";
}

window.deleteTask = function (index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

document.getElementById("save-task").addEventListener("click", () => {
    const updatedText = document.getElementById("edit-task-input").value.trim();
    const updatedDate = document.getElementById("edit-task-date").value;
    const updatedTime = document.getElementById("edit-task-time").value;

    if (updatedText && updatedDate && updatedTime) {
        tasks[currentEditIndex] = { text: updatedText, date: updatedDate, time: updatedTime, notified: false };
        localStorage.setItem("tasks", JSON.stringify(tasks));
        closeModal();
        renderTasks();
    }
});

function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

document.getElementById("close-modal").addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("edit-modal")) closeModal();
});

function checkReminders() {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    tasks.forEach((task, index) => {
        if (task.date === currentDate && task.time === currentTime && !task.notified) {
            showNotification(task.text);
            tasks[index].notified = true;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    });
}

function showNotification(message) {
    if (Notification.permission === "granted") {
        console.log("Notification permission granted");
        new Notification("Task Reminder", { body: message });
    } else {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("Task Reminder", { body: message });
            } else {
                alert("Task Reminder: " + message);
            }
        });
    }
}

if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    renderTasks();
    setInterval(checkReminders, 1000); // Check every second for reminders
});
