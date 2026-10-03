const API_URL = "/api/tasks";

let tasks = [];
let employees = [];
let editingTaskId = null;

const $ = id => document.querySelector(id);


async function checkLogin() {
    try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
            location.href = "/login.html";
            return;
        }

        const employee = await response.json();
        $("#welcomeMessage").textContent = `Welcome, ${employee.name}`;

        loadEmployees();
        getTasks();

    } catch (error) {
        location.href = "/login.html";
    }
}

async function loadEmployees() {
    try {
        const response = await fetch("/api/employees");
        employees = await response.json();

        const select = $("#assignedTo");

        select.innerHTML = `<option value="">Select Employee</option>`;

        employees.forEach(employee => {
            const option = document.createElement("option");
            option.value = employee.name;
            option.textContent = employee.name;
            select.appendChild(option);
        });

    } catch (error) {
        console.log(error);
    }
}

async function getTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            location.href = "/login.html";
            return;
        }

        tasks = await response.json();

        displayTasks(tasks);
        updateDashboard(tasks);

    } catch (error) {
        console.log(error);
    }
}

function displayTasks(list) {

    const table = $("#taskTableBody");

    table.innerHTML = "";

    if (list.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No tasks found
                </td>
            </tr>
        `;
        return;
    }

    list.forEach(task => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.priority}</td>

            <td>
                <select onchange="changeStatus(${task.id}, this.value)">
                    <option value="Pending"
                        ${task.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="In Progress"
                        ${task.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Completed"
                        ${task.status === "Completed" ? "selected" : ""}>
                        Completed
                    </option>
                </select>
            </td>

            <td>${task.dueDate}</td>

            <td>${task.assignedTo || "Not Assigned"}</td>

            <td>
                <button class="edit-btn"
                    onclick="editTask(${task.id})">
                    Edit
                </button>

                <button class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}

$("#taskForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const task = {
        title: $("#title").value.trim(),
        description: $("#description").value.trim(),
        priority: $("#priority").value,
        status: $("#status").value,
        dueDate: $("#dueDate").value,
        assignedTo: $("#assignedTo").value
    };

    const message = $("#message");

    if (!task.title ||
        !task.description ||
        !task.priority ||
        !task.status ||
        !task.dueDate ||
        !task.assignedTo) {

        message.style.color = "red";
        message.textContent = "All fields are required.";
        return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (task.dueDate < today) {
        message.style.color = "red";
        message.textContent = "Due date cannot be in the past.";
        return;
    }

    try {

        const url = editingTaskId
            ? `${API_URL}/${editingTaskId}`
            : API_URL;

        const method = editingTaskId ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            throw new Error("Request failed");
        }

        message.style.color = "green";

        message.textContent = editingTaskId
            ? "Task updated successfully."
            : "Task added successfully.";

        resetForm();
        getTasks();

    } catch (error) {

        message.style.color = "red";
        message.textContent = "Something went wrong.";

        console.log(error);
    }
});

function editTask(id) {

    const task = tasks.find(item => item.id === id);

    if (!task) return;

    editingTaskId = id;

    $("#formTitle").textContent = "Edit Task";
    $("#submitBtn").textContent = "Update Task";
    $("#cancelBtn").style.display = "inline-block";

    $("#title").value = task.title;
    $("#description").value = task.description;
    $("#priority").value = task.priority;
    $("#status").value = task.status;
    $("#dueDate").value = task.dueDate;
    $("#assignedTo").value = task.assignedTo;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function resetForm() {

    editingTaskId = null;

    $("#taskForm").reset();

    $("#formTitle").textContent = "Add Task";
    $("#submitBtn").textContent = "Add Task";
    $("#cancelBtn").style.display = "none";
    $("#message").textContent = "";
}

$("#cancelBtn").addEventListener("click", resetForm);

async function deleteTask(id) {

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        getTasks();

    } catch (error) {
        console.log(error);
    }
}
async function changeStatus(id, newStatus) {

    const task = tasks.find(item => item.id === id);

    if (!task) return;

    const updatedTask = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo
    };

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) {
            throw new Error("Status update failed");
        }

        getTasks();

    } catch (error) {
        console.log(error);
    }
}

function updateDashboard(list) {

    $("#totalTasks").textContent = list.length;

    $("#pendingTasks").textContent =
        list.filter(task => task.status === "Pending").length;

    $("#progressTasks").textContent =
        list.filter(task => task.status === "In Progress").length;

    $("#completedTasks").textContent =
        list.filter(task => task.status === "Completed").length;
}

$("#search").addEventListener("input", filterTasks);
$("#statusFilter").addEventListener("change", filterTasks);
$("#priorityFilter").addEventListener("change", filterTasks);

function filterTasks() {

    const search = $("#search").value.toLowerCase();
    const status = $("#statusFilter").value;
    const priority = $("#priorityFilter").value;

    const filtered = tasks.filter(task => {

        const searchMatch =
            task.title.toLowerCase().includes(search);

        const statusMatch =
            status === "All" || task.status === status;

        const priorityMatch =
            priority === "All" || task.priority === priority;

        return searchMatch &&
               statusMatch &&
               priorityMatch;
    });

    displayTasks(filtered);
}

$("#logoutBtn").addEventListener("click", async function() {

    try {

        await fetch("/api/auth/logout", {
            method: "POST"
        });

        location.href = "/login.html";

    } catch (error) {
        console.log(error);
    }
});

checkLogin();