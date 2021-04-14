// Sets the statusDiv draggable and adds eventhandlers for drag and drop
function prepareStatusForDragDrop(statusDiv, statusInx) {
    statusDiv.setAttribute("dragtype", "status");
    statusDiv.addEventListener(
        "dragover",
        function () {
            allowDrop(event);
        },
        false
    );
    statusDiv.addEventListener(
        "drop",
        function () {
            drop(event);
        },
        false
    );
    statusDiv.setAttribute("status", statusInx);
    statusDiv.draggable = true;
    statusDiv.addEventListener(
        "dragstart",
        function () {
            drag(event);
        },
        false
    );
}

// Sets the taskDiv draggable and adds eventhandlers for drag and drop
function prepareTaskForDragDrop(taskDiv, statusInx, taskInx) {
    taskDiv.setAttribute("status", statusInx);
    taskDiv.setAttribute("task", taskInx);
    taskDiv.setAttribute("dragtype", "task");
    taskDiv.draggable = true;
    taskDiv.addEventListener(
        "dragstart",
        function () {
            drag(event);
        },
        false
    );
}

// Stores the id of element to be dragged
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// Override standard behavior to allow for dropping
function allowDrop(ev) {
    ev.preventDefault();
}

// Handle the drop on either status or task
function drop(ev) {
    ev.preventDefault();

    var data = ev.dataTransfer.getData("text");
    var sourceElement = document.getElementById(data);
    var targetElement = ev.target;

    var sourceDragType = sourceElement.getAttribute("dragtype");
    var targetDragType = targetElement.getAttribute("dragtype");

    // If the droptarget is not status or task we need to check if its a child of status or task
    while (targetElement && targetElement.parentElement && targetDragType == null) {
        targetElement = targetElement.parentElement;
        targetDragType = targetElement.getAttribute("dragtype");
    }

    if (sourceDragType == "task" && targetDragType == "status") {
        // We are now dropping a task directly on a status
        // Place task at the end of the target tasklist
        var currentStatus = sourceElement.getAttribute("status");
        var currentTask = sourceElement.getAttribute("task");
        var newStatus = targetElement.getAttribute("status");
        moveTask(currentStatus, currentTask, newStatus, -1);
    } else if (sourceDragType == "task" && targetDragType == "task") {
        // We are now dropping a task on another task
        // Move the source task in front of the target task
        var currentStatus = sourceElement.getAttribute("status");
        var currentTask = sourceElement.getAttribute("task");
        var newStatus = targetElement.getAttribute("status");
        var newTask = targetElement.getAttribute("task");
        moveTask(currentStatus, currentTask, newStatus, newTask);
    } else if (sourceDragType == "status" && (targetDragType == "status" || targetDragType == "task")) {
        // We are now dropping a status on a status or a task
        // Move status to the position of the target status or the status containing the target task
        var sourceIndex = parseInt(sourceElement.getAttribute("status"));
        var targetIndex = parseInt(targetElement.getAttribute("status"));
        moveStatus(sourceIndex, targetIndex);
    }
}

// Move task from a specific position within a status to another position within the same or another status
function moveTask(fromStatusInx, fromTaskInx, toStatusInx, toTaskInx) {
    var task = projects[currentProjectId].status[fromStatusInx].tasks[fromTaskInx];
    projects[currentProjectId].status[fromStatusInx].tasks.splice(fromTaskInx, 1);
    if (toTaskInx == -1) {
        // toTaskInx == -1 means place task at the end
        projects[currentProjectId].status[toStatusInx].tasks.push(task);
    } else {
        if (fromStatusInx == toStatusInx && fromStatusInx < toStatusInx) {
            projects[currentProjectId].status[toStatusInx].tasks.splice(toTaskInx - 1, 0, task);
        } else {
            projects[currentProjectId].status[toStatusInx].tasks.splice(toTaskInx, 0, task);
        }
    }
    saveProjectChanges();
    renderStatus();
}

// Move status from sourceIndex to targetIndex
function moveStatus(sourceIndex, targetIndex) {
    if (sourceIndex != targetIndex) {
        var sourceStatus = projects[currentProjectId].status[sourceIndex];
        if (sourceIndex > targetIndex) {
            for (var i = sourceIndex; i > targetIndex; i--) {
                projects[currentProjectId].status[i] = projects[currentProjectId].status[i - 1];
            }
        } else {
            for (var i = sourceIndex; i < targetIndex; i++) {
                projects[currentProjectId].status[i] = projects[currentProjectId].status[i + 1];
            }
        }
        projects[currentProjectId].status[targetIndex] = sourceStatus;
        saveProjectChanges();
        renderStatus();
    }
}
