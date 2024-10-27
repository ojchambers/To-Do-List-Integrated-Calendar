document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const tooltipEl = document.getElementById('tooltip');
    let currentTooltipTaskId = null;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: loadTasksFromLocalStorage(),
        eventContent: function(arg) {
            return { html: `<div>${arg.event.title}</div>` };
        },
        eventMouseEnter: function(info) {
            const taskDetails = `
                <strong>${info.event.title}</strong><br>
                <em>Due: ${info.event.start.toISOString().split('T')[0]}</em><br>
                <button class="complete-button" data-id="${info.event.id}">Complete</button>
                <button class="delete-button" data-id="${info.event.id}">Delete</button>
            `;
            tooltipEl.innerHTML = taskDetails;
            tooltipEl.style.display = 'block';
            tooltipEl.style.left = `${info.jsEvent.clientX}px`;
            tooltipEl.style.top = `${info.jsEvent.clientY + 10}px`;
            currentTooltipTaskId = info.event.id;

            tooltipEl.addEventListener('mouseenter', () => {
                tooltipEl.style.display = 'block';
            });
        },
        eventMouseLeave: function() {
            if (!currentTooltipTaskId) {
                tooltipEl.style.display = 'none';
            }
        }
    });

    calendar.render();

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("testModel_tasks")) || [];
        return tasks
            .filter(task => task.date && !task.completed)
            .map((task, index) => ({
                title: task.text,
                start: task.date,
                id: index // Ensure this matches the to-do list's unique ID for each task
            }));
    }

    tooltipEl.addEventListener('click', function(event) {
        const target = event.target;
        const taskId = target.dataset.id;

        if (target.classList.contains('complete-button')) {
            completeTask(taskId);
        } else if (target.classList.contains('delete-button')) {
            deleteTask(taskId);
        }
    });

    function completeTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem("testModel_tasks")) || [];
        if (tasks[taskId]) {
            tasks[taskId].completed = true;
            localStorage.setItem("testModel_tasks", JSON.stringify(tasks));

            // Remove the event from the calendar
            calendar.getEventById(taskId).remove();
            hideTooltip();

            // Update the To-Do list to reflect the completion
            updateToDoList(tasks);
            console.log(`Task "${tasks[taskId].text}" completed!`);
        }
    }

    function deleteTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem("testModel_tasks")) || [];
        tasks.splice(taskId, 1);
        localStorage.setItem("testModel_tasks", JSON.stringify(tasks));

        // Remove the event from the calendar
        calendar.getEventById(taskId).remove();
        hideTooltip();

        // Update the To-Do list to reflect the deletion
        updateToDoList(tasks);
        console.log(`Task deleted!`);
    }

    function hideTooltip() {
        tooltipEl.style.display = 'none';
        currentTooltipTaskId = null;
    }

    function updateToDoList(tasks) {
        // Logic to refresh the to-do list
        // Example: Assume you have a function refreshToDoList that takes care of updating the UI
        refreshToDoList(tasks);
    }

    // You will need to implement the refreshToDoList function as per your to-do list structure
});
