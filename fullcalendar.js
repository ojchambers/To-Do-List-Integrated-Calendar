document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'dayGrid' ],
        defaultView: 'dayGridMonth',
        events: [
            {
                title: 'Event 1',
                start: '2023-10-01'
            },
            {
                title: 'Event 2',
                start: '2023-10-05',
                end: '2023-10-07'
            }
        ]
    });
    calendar.render();
    calendar.on('eventClick', function(info) {
        const taskId = info.event.id; // Get the unique task ID from the event
        const taskText = info.event.title;
        const taskDueDate = info.event.start; // Assuming you're storing the start date
    
        // Complete task
        if (confirm(`Complete task: ${taskText}?`)) {
            // Mark as completed in the to-do list
            markTaskAsCompleted(taskText, taskDueDate); // Create this function
            
            // Remove the event from the calendar
            info.event.remove();
        }
    });
    
    // Function to mark the task as completed in the to-do list
    function markTaskAsCompleted(text, dueDate) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const updatedTasks = tasks.map(task => {
            if (task.text === text && task.date === dueDate) {
                task.completed = true; // Update completion status
            }
            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        loadTasks(); // Reload tasks to update the list
    }
    
    // Deleting the event from the calendar
    calendar.on('eventClick', function(info) {
        const taskId = info.event.id; // Get the unique task ID from the event
    
        // Delete task
        if (confirm(`Delete task: ${info.event.title}?`)) {
            removeTaskFromTodoList(taskId); // Call to remove from the to-do list
            info.event.remove(); // Remove the event from the calendar
        }
    });
    
    // Function to remove a task from the to-do list
    function removeTaskFromTodoList(taskId) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId); // Filter out the deleted task
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        loadTasks(); // Reload tasks to update the list
    }
    
});