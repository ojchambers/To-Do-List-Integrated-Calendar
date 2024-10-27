document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const addTaskBtn = document.getElementById('add-task-btn');
    const nonRecurringTasks = document.getElementById('non-recurring-tasks');
    const dailyTasks = document.getElementById('daily-tasks');
    const weeklyTasks = document.getElementById('weekly-tasks');
    const monthlyTasks = document.getElementById('monthly-tasks');
    const completedTaskList = document.getElementById('completed-task-list');

    let selectedTaskType = "non-recurring";

    // Load counters from localStorage or initialize them with unique key names
    let tasksCompletedToday = parseInt(localStorage.getItem("testModel_tasksCompletedToday")) || 0;
    let tasksCompletedTotal = parseInt(localStorage.getItem("testModel_tasksCompletedTotal")) || 0;

    // Load tasks and update task counters
    loadTasks();
    updateTaskCounters();

    // Task type selector change event
    document.querySelectorAll('input[name="task-type"]').forEach((radio) => {
        radio.addEventListener("change", (event) => {
            selectedTaskType = event.target.value;
        });
    });

    addTaskBtn.addEventListener("click", handleAddTask);

    function handleAddTask() {
        const taskText = taskInput.value.trim();
        const taskDueDate = taskDate.value;

        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        const taskItem = createTaskItem(taskText, taskDueDate, false);

        switch (selectedTaskType) {
            case "non-recurring":
                nonRecurringTasks.appendChild(taskItem);
                break;
            case "daily":
                dailyTasks.appendChild(taskItem);
                break;
            case "weekly":
                weeklyTasks.appendChild(taskItem);
                break;
            case "monthly":
                monthlyTasks.appendChild(taskItem);
                break;
        }

        saveTask(selectedTaskType, taskText, taskDueDate, false);

        taskInput.value = "";
        taskDate.value = "";
    }

    function createTaskItem(taskText, taskDueDate, completed) {
        const taskItem = document.createElement("li");
        const taskInfo = document.createElement("span");

        taskInfo.textContent = `${taskText}${taskDueDate ? " (Due: " + taskDueDate + ")" : ""}`;
        taskItem.appendChild(taskInfo);

        const completeButton = document.createElement("button");
        completeButton.textContent = "Complete";
        if (!completed) taskItem.appendChild(completeButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        taskItem.appendChild(deleteButton);

        if (completed) {
            taskItem.classList.add("completed-task");
            completedTaskList.appendChild(taskItem);
        }

        completeButton.addEventListener("click", () => {
            taskItem.classList.add("completed-task");
            completedTaskList.appendChild(taskItem);
            completeButton.remove();

            updateTaskCompletionStatus(taskText, taskDueDate, true);
            tasksCompletedTotal++;
            tasksCompletedToday++;
            updateTaskCounters();
            saveCounters();  // Save updated counters to localStorage
        });

        deleteButton.addEventListener("click", () => {
            taskItem.remove();
            removeTask(taskText, taskDueDate);
        });

        return taskItem;
    }

    function saveTask(type, text, date, completed) {
        const tasks = JSON.parse(localStorage.getItem("testModel_tasks")) || [];
        tasks.push({ type, text, date, completed });
        localStorage.setItem("testModel_tasks", JSON.stringify(tasks));
    }

    function updateTaskCompletionStatus(text, date, completed) {
        const tasks = JSON.parse(localStorage.getItem("testModel_tasks")) || [];
        const updatedTasks = tasks.map(task => {
            if (task.text === text && task.date === date) {
                return { ...task, completed };
            }
            return task;
        });
        localStorage.setItem("testModel_tasks", JSON.stringify(updatedTasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("testModel_tasks")) || [];
        
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text, task.date, task.completed);

            if (task.completed) {
                completedTaskList.appendChild(taskItem);
            } else {
                switch (task.type) {
                    case "non-recurring":
                        nonRecurringTasks.appendChild(taskItem);
                        break;
                    case "daily":
                        dailyTasks.appendChild(taskItem);
                        break;
                    case "weekly":
                        weeklyTasks.appendChild(taskItem);
                        break;
                    case "monthly":
                        monthlyTasks.appendChild(taskItem);
                        break;
                }
            }
        });
        updateTaskCounters();
    }

    function removeTask(text, date) {
        const tasks = JSON.parse(localStorage.getItem("testModel_tasks")) || [];
        const updatedTasks = tasks.filter(task => task.text !== text || task.date !== date);
        localStorage.setItem("testModel_tasks", JSON.stringify(updatedTasks));
    }

    function updateTaskCounters() {
        document.querySelector('h3#tasks-completed-today').textContent = `Number of Tasks Completed Today: ${tasksCompletedToday}`;
        document.querySelector('h3#tasks-completed-total').textContent = `Number of Tasks Completed Total: ${tasksCompletedTotal}`;
    }

    // Save counters to localStorage
    function saveCounters() {
        localStorage.setItem("testModel_tasksCompletedToday", tasksCompletedToday);
        localStorage.setItem("testModel_tasksCompletedTotal", tasksCompletedTotal);
    }

    // Reset today's completed task count
    document.getElementById('reset-today-completed').addEventListener('click', () => {
        tasksCompletedToday = 0;
        saveCounters();
        updateTaskCounters();
    });

    // Reset total tasks completed
    document.getElementById('reset-total-completed').addEventListener('click', () => {
        tasksCompletedTotal = 0;
        saveCounters();
        updateTaskCounters();
    });

    function resetRecurringTasks() {
        const tasks = JSON.parse(localStorage.getItem("testModel_tasks")) || [];
        tasks.forEach(task => {
            if (task.completed) {
                switch (task.type) {
                    case "daily":
                        task.completed = false;
                        dailyTasks.appendChild(createTaskItem(task.text, task.date, false));
                        break;
                    case "weekly":
                        task.completed = false;
                        weeklyTasks.appendChild(createTaskItem(task.text, task.date, false));
                        break;
                    case "monthly":
                        task.completed = false;
                        monthlyTasks.appendChild(createTaskItem(task.text, task.date, false));
                        break;
                }
            }
        });
        localStorage.setItem("testModel_tasks", JSON.stringify(tasks));
    }

    function scheduleMidnightReset() {
        const now = new Date();
        const nextMidnight = new Date();
        nextMidnight.setHours(24, 0, 0, 0);

        const timeUntilMidnight = nextMidnight - now;
        setTimeout(() => {
            resetRecurringTasks();
            scheduleMidnightReset();
        }, timeUntilMidnight);
    }

    scheduleMidnightReset();
});
