//window.onload = taskProjects;

// Loop through and render out tasks
function renderTasks() {
    var taskDiv = document.getElementById("tasks");
    taskDiv.innerHTML = "";

    for (var i = 0; i < projects.length; i++) {
        for (var j = 0; j < projects[i].status.length; j++) {
            for (var n = 0; n < projects[i].status[j].tasks.length; n++) {
                var task = projects[i].status[j].tasks[n];
                // If logged in user assigned to task and task is not complete ==> render task
                if (currentUserIsAssignedToTask(task) && !task.isComplete) {
                    var tName = projects[i].status[j].tasks[n].name;
                    var tDescription = projects[i].status[j].tasks[n].description;

                    var div = document.createElement("div");
                    div.setAttribute("onclick", `location.href='project.html?project=${i}'`);
                    div.className = "task-box pointer";
                    div.innerHTML = `
                    <h2>${tName}</h2>
                    <hr>
                    <p class="description">${tDescription}</p>
                    `;
                    taskDiv.appendChild(div);
                }
            }
        }
    }
}

// Check if logged in user is assigned to task
function currentUserIsAssignedToTask(task) {
    for (var i = 0; i < task.assigned.length; i++) {
        if (currentUser.id == task.assigned[i]) {
            return true;
        }
    }
    return false;
}
