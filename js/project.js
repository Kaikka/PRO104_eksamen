window.onload = function () {
    renderProfileInfo();
    setProjectInfo();
    createPopup("add-status-btn", ".popup-status");
    renderStatus();
};

// Getting current project id and assigning it to variable
const queryString = window.location.search;
const projectString = new URLSearchParams(queryString);
const currentProjectId = parseInt(projectString.get("project"));

// Dynamically setting document title to project title
document.title = projects[currentProjectId].name;

function setProjectInfo() {
    var title = document.getElementById("project-title");
    var description = document.getElementById("project-desc");

    description.value = projects[currentProjectId].description;
    title.value = projects[currentProjectId].name;

    // Apply update to localStorage when releasing a key in one of the input fields
    document.querySelectorAll(".projectinfo").forEach((selectElement) => {
        selectElement.addEventListener("keyup", () => {
            var project = {
                name: title.value,
                description: description.value,
                team: projects[currentProjectId].team,
                privacy: projects[currentProjectId].privacy,
                status: projects[currentProjectId].status,
            };
            projects[currentProjectId] = project;
            saveProjectChanges();
        });
    });
}

// Render board for current project
function renderStatus() {
    var content = document.querySelector(".status-bars");
    content.innerHTML = "";

    for (var i = 0; i < projects[currentProjectId].status.length; i++) {
        var sName = projects[currentProjectId].status[i].category;
        var statusDiv = document.createElement("div");
        statusDiv.className = "subcontent";
        // statusDiv.innerHTML = `<input type="text" class="status-title" value="${sName}"/>`;
        var statusInput = document.createElement("input");
        statusDiv.appendChild(statusInput);
        statusInput.setAttribute("type", "text");
        statusInput.setAttribute("class", "status-title");
        statusInput.setAttribute("value", sName);
        statusInput.setAttribute("id", i);

        var deleteBtn = document.createElement("img");
        deleteBtn.className = "delete-status";
        deleteBtn.src = "../img/delete.png";
        deleteBtn.setAttribute("onclick", `deleteStatus(${i})`);
        statusDiv.appendChild(deleteBtn);

        for (var j = 0; j < projects[currentProjectId].status[i].tasks.length; j++) {
            statusDiv.appendChild(createTaskWrapper(i, j));
        }

        statusDiv.id = "StatusDiv-" + i;
        prepareStatusForDragDrop(statusDiv, i);
        content.appendChild(statusDiv);
    }

    document.querySelectorAll(".status-title").forEach((selectElement) => {
        selectElement.addEventListener("keyup", () => {
            projects[currentProjectId].status[selectElement.id].category = selectElement.value;
            saveProjectChanges();
        });
    });
}

function createTaskWrapper(statusInx, taskInx) {
    var taskWrap = document.createElement("div");
    taskWrap.className = "task-wrap";
    var taskDiv = document.createElement("div");
    taskDiv.className = "task-box grabable";
    prepareTaskForDragDrop(taskDiv, statusInx, taskInx);
    taskDiv.id = statusInx + "-" + taskInx;
    taskDiv.innerHTML = `
        <h2>${projects[currentProjectId].status[statusInx].tasks[taskInx].name}</h2>
        <hr>
        <p class="description">${projects[currentProjectId].status[statusInx].tasks[taskInx].description}</p>
        `;
    taskDiv.setAttribute("onclick", `taskPopUp(${statusInx}, ${taskInx})`);

    var complete = document.createElement("div");
    complete.className = "task-complete";
    if (projects[currentProjectId].status[statusInx].tasks[taskInx].isComplete) {
        complete.style.backgroundColor = "green";
    } else {
        complete.style.backgroundColor = "red";
    }
    taskDiv.appendChild(complete);

    var deleteWrap = document.createElement("div");
    deleteWrap.className = "delete-task-wrap";
    var deleteBtn = document.createElement("img");
    deleteBtn.className = "delete-task";
    deleteBtn.src = "../img/delete.png";
    deleteWrap.setAttribute("onclick", `deleteTask(${statusInx}, ${taskInx})`);
    deleteWrap.appendChild(deleteBtn);
    taskWrap.appendChild(deleteWrap);
    taskWrap.appendChild(taskDiv);
    return taskWrap;
}

function deleteStatus(statusInx) {
    if (confirm("Are you sure you want to delete this status?")) {
        projects[currentProjectId].status.splice(statusInx, 1);
    }
    saveProjectChanges();
    renderStatus();
}

function deleteTask(statusInx, taskInx) {
    if (confirm("Are you sure you want to delete this task?")) {
        projects[currentProjectId].status[statusInx].tasks.splice(taskInx, 1);
    }
    saveProjectChanges();
    renderStatus();
}

// Create new statusbar
function addNewStatus() {
    var inputTitle = document.getElementById("new-status-title");

    var status = {
        category: inputTitle.value,
        tasks: [],
    };
    projects[currentProjectId].status.push(status);
    saveProjectChanges();
    closePopup(".popup-status");
    renderStatus();
    inputTitle.value = "";
}

// Create popup to add new task
function prepareNewTask() {
    var popup = document.querySelector(".popup-task");
    popup.querySelector(".assignment-menu").style.display = "none";

    var assignmentDiv = popup.querySelector(".popup-assignments");
    assignmentDiv.innerHTML = "";
    var addBtn = createAddAssignmentBtn();
    addBtn.setAttribute("onclick", "selectNewAssignee()");
    assignmentDiv.appendChild(addBtn);

    popup.style.display = "block";
    blurContent(true);

    var select = document.getElementById("add-task-to-status");
    for (var i = 0; i < projects[currentProjectId].status.length; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.innerHTML = projects[currentProjectId].status[i].category;
        select.appendChild(option);
    }
}

// Create popup to update/modify clicked task
function taskPopUp(statusIndex, taskIndex) {
    var popup = document.querySelector(".popup-selected-task");
    popup.querySelector(".assignment-menu").style.display = "none";
    popup.style.display = "block";
    blurContent(true);
    document.getElementById("update-task-title").value = projects[currentProjectId].status[statusIndex].tasks[taskIndex].name;
    document.getElementById("update-task-desc").value = projects[currentProjectId].status[statusIndex].tasks[taskIndex].description;
    document.getElementById("update-task-status").checked = projects[currentProjectId].status[statusIndex].tasks[taskIndex].isComplete;

    // Deletes eventlistener if exists and creates new
    var updateBtn = document.getElementById("update-task");
    if (updateBtn) {
        updateBtn.parentElement.removeChild(updateBtn);
    }
    updateBtn = document.createElement("button");
    updateBtn.innerHTML = "Update Task";
    updateBtn.className = "popup-btn pointer";
    updateBtn.id = "update-task";
    updateBtn.addEventListener("click", function () {
        updateTask(projects[currentProjectId].status[statusIndex].tasks[taskIndex]);
    });
    var popupDiv = popup.querySelector(".popup-div");
    popupDiv.appendChild(updateBtn);

    var assignmentDiv = popup.querySelector(".popup-assignments");
    assignmentDiv.innerHTML = "";
    var addBtn = createAddAssignmentBtn();
    addBtn.setAttribute("onclick", "selectUpdateAssignee()");
    assignmentDiv.appendChild(addBtn);

    var brLine = document.createElement("br");
    assignmentDiv.appendChild(brLine);

    var assignmentDiv = popup.querySelector(".popup-assignments");
    for (var i = 0; i < projects[currentProjectId].status[statusIndex].tasks[taskIndex].assigned.length; i++) {
        renderAssignedUser(projects[currentProjectId].status[statusIndex].tasks[taskIndex].assigned[i], assignmentDiv, "update-task");
    }
}

// Create button for assigning members on task-popup
function createAddAssignmentBtn() {
    var addBtn = document.createElement("div");
    addBtn.innerHTML = "+ Assign";
    addBtn.className = "add-new-assignee pointer";
    addBtn.style.display = "inline";

    return addBtn;
}

// Render users assigned to task
function renderAssignedUser(userId, div, boundingDiv) {
    var user = getUserFromUserId(userId);
    var img = user.img;
    if (img == null) {
        img = "../img/default.jpg";
    }
    div.innerHTML += `<img src="${img}" style="height:40px" class="pointer" userId="${user.id}" onclick="removeUpdateUser(${user.id})"/>`;
}

// These two next functions should be one with the popup div as parameter
// Adds list of members not already assigned to task to a menulist
function selectUpdateAssignee() {
    var element = document.querySelector(".popup-selected-task");
    var assignmentMenu = element.querySelector(".assignment-menu");
    if (assignmentMenu.style.display == "none") {
        var teams = projects[currentProjectId].team;
        var assignmentDiv = element.querySelector(".popup-assignments");
        var display = "";

        for (var i = 0; i < teams.length; i++) {
            // Check if user already assigned to task
            var imgAssigned = assignmentDiv.querySelector(`[userId='${teams[i]}']`);

            // If user not already assigned to task ==> add user to menu
            if (imgAssigned == null) {
                assignmentMenu.style.display = "block";

                var img = getUserFromUserId(teams[i]).img;
                if (img == null) {
                    img = "../img/default.jpg";
                }
                display += `
                <div onclick="assignUpdateUser(${teams[i]})">
                <img src="${img}" style="height:40px" class="pointer" userId="${teams[i]}"/>
                <p>${getUserFromUserId(teams[i]).firstName}</p>
                </div>
                `;
            }
        }
        assignmentMenu.innerHTML = display;
    } else {
        assignmentMenu.style.display = "none";
    }
}

// Adds list of members not already assigned to task to a menulist
function selectNewAssignee() {
    var element = document.querySelector(".popup-task");
    var assignmentMenu = element.querySelector(".assignment-menu");
    if (assignmentMenu.style.display == "none") {
        var teams = projects[currentProjectId].team;
        var assignmentDiv = element.querySelector(".popup-assignments");
        var display = "";

        for (var i = 0; i < teams.length; i++) {
            var imgAssigned = assignmentDiv.querySelector(`[userId='${teams[i]}']`);

            if (imgAssigned == null) {
                assignmentMenu.style.display = "block";

                var img = getUserFromUserId(teams[i]).img;
                if (img == null) {
                    img = "../img/default.jpg";
                }
                display += `
                <div onclick="assignNewTaskUser(${teams[i]})">
                <img src="${img}" style="height:40px" userId="${teams[i]}"/>
                <p>${getUserFromUserId(teams[i]).firstName}</p>
                </div>
                `;
            }
        }
        assignmentMenu.innerHTML = display;
    } else {
        assignmentMenu.style.display = "none";
    }
}
// These two next functions should be one with the popup div as parameter
// Assigning user to task
function assignUpdateUser(userId) {
    var element = document.querySelector(".popup-selected-task");
    var assignmentDiv = element.querySelector(".popup-assignments");
    var user = getUserFromUserId(userId);
    var img = user.img;
    if (img == null) {
        img = "../img/default.jpg";
    }
    assignmentDiv.innerHTML += `<img src="${img}" style="height:40px" class="pointer" userId="${user.id}" onclick="removeUpdateUser(${user.id})"/>`;

    var menu = element.querySelector(".assignment-menu");
    var assignments = menu.querySelectorAll(`img[userId="${userId}"]`);
    for (var i = 0; i < assignments.length; i++) {
        assignments[i].parentElement.parentElement.removeChild(assignments[i].parentElement);
    }
    assignments = menu.querySelectorAll('img[userId]:not([userId=""])');
    if (assignments.length == 0) {
        menu.style.display = "none";
    }
}

// Assigning user to task
function assignNewTaskUser(userId) {
    var element = document.querySelector(".popup-task");
    var assignmentDiv = element.querySelector(".popup-assignments");
    var user = getUserFromUserId(userId);
    var img = user.img;
    if (img == null) {
        img = "../img/default.jpg";
    }
    assignmentDiv.innerHTML += `<img src="${img}" style="height:40px" userId="${user.id}" onclick="removeNewTaskUser(${user.id})"/>`;

    var menu = element.querySelector(".assignment-menu");
    var assignments = menu.querySelectorAll(`img[userId="${userId}"]`);
    for (var i = 0; i < assignments.length; i++) {
        assignments[i].parentElement.parentElement.removeChild(assignments[i].parentElement);
    }
    assignments = menu.querySelectorAll('img[userId]:not([userId=""])');
    if (assignments.length == 0) {
        menu.style.display = "none";
    }
}

// These two next functions should be one with the popup div as parameter
// Removing user from task (from update popup)
function removeUpdateUser(id) {
    var element = document.querySelector(".popup-selected-task");
    var assignmentDiv = element.querySelector(".popup-assignments");
    var menu = element.querySelector(".assignment-menu");
    menu.style.display = "none";

    var img = assignmentDiv.querySelector(`[userId='${id}']`);
    img.parentElement.removeChild(img);
}
// Removing user from task (from new task popup)
function removeNewTaskUser(id) {
    var element = document.querySelector(".popup-task");
    var assignmentDiv = element.querySelector(".popup-assignments");
    var menu = element.querySelector(".assignment-menu");
    menu.style.display = "none";

    var img = assignmentDiv.querySelector(`[userId='${id}']`);
    img.parentElement.removeChild(img);
}

// Function to return which user it is from userId
function getUserFromUserId(id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            return users[i];
        }
    }
    return undefined;
}

// Function to update the selected task with new data and render board
function updateTask(task) {
    var tTitle = document.getElementById("update-task-title").value;
    var tDesc = document.getElementById("update-task-desc").value;
    var tStatus = document.getElementById("update-task-status").checked;
    task.name = tTitle;
    task.description = tDesc;
    task.isComplete = tStatus;
    task.assigned = [];
    var popup = document.querySelector(".popup-selected-task");
    var popupAssignments = popup.querySelector(".popup-assignments");
    var assignments = popupAssignments.querySelectorAll('img[userId]:not([userId=""])');
    for (var i = 0; i < assignments.length; i++) {
        task.assigned.push(parseInt(assignments[i].getAttribute("userId")));
    }

    saveProjectChanges();
    closePopup(".popup-selected-task");
    renderStatus();
}

// Function to add new task with input data and render board
function addNewTask() {
    var tTitle = document.getElementById("new-task-title");
    var tDesc = document.getElementById("new-task-desc");

    if (tTitle.value == "") {
        tTitle.value = "New task";
    }
    if (tDesc.value == "") {
        tDesc.value = "New task description";
    }

    var task = {
        name: tTitle.value,
        description: tDesc.value,
        priority: 3,
        isComplete: false,
        assigned: [],
    };

    var popup = document.querySelector(".popup-task");
    var popupAssignments = popup.querySelector(".popup-assignments");
    var assignments = popupAssignments.querySelectorAll('img[userId]:not([userId=""])');
    for (var i = 0; i < assignments.length; i++) {
        task.assigned.push(parseInt(assignments[i].getAttribute("userId")));
    }

    // Pushes task to selected status
    var selectedStatus = document.getElementById("add-task-to-status");
    projects[currentProjectId].status[selectedStatus.value].tasks.push(task);

    saveProjectChanges();
    closePopup(".popup-task");
    renderStatus();
    tTitle.value = "";
    tDesc.value = "";
}

// Open popup to mange project-team
function manageTeam() {
    document.querySelector(".popup-team").style.display = "block";
    blurContent(true);

    var tOutput = document.querySelector(".team-output");
    var ntOutput = document.querySelector(".nteam-output");
    tOutput.innerHTML = "";
    ntOutput.innerHTML = "";
    for (var i = 0; i < users.length; i++) {
        // Check if user is already in team
        if (projects[currentProjectId].team.includes(users[i].id)) {
            // If user in team ==> render to team div
            var pDiv = renderUsers(i);
            tOutput.appendChild(pDiv);
        } else if (!projects[currentProjectId].team.includes(users[i].id)) {
            // If user not in team ==> render to not-team div
            var pDiv = renderUsers(i);
            ntOutput.appendChild(pDiv);
        }
    }

    // If not-team div is empty ==> dont display it
    if (ntOutput.innerHTML == "") {
        ntOutput.style.display = "none";
    } else {
        ntOutput.style.display = "block";
    }

    saveProjectChanges();
}

// Create HTML-Elements and return user-image and name
function renderUsers(usr) {
    var pDiv = document.createElement("div");
    pDiv.setAttribute("onclick", `editTeam(${usr})`);
    pDiv.setAttribute("class", "pointer");
    var pP = document.createElement("p");
    pP.innerHTML = users[usr].firstName + " " + users[usr].lastName;
    var pImg = document.createElement("img");
    var img = users[usr].img;
    if (users[usr].img == null) {
        img = "../img/default.jpg";
    }
    pImg.setAttribute("src", img);
    pImg.style.height = "50px";
    pImg.style.borderRadius = "50%";
    pDiv.appendChild(pImg);
    pDiv.appendChild(pP);

    return pDiv;
}

// Moving selected user into or out of project-team
function editTeam(uid) {
    if (!projects[currentProjectId].team.includes(users[uid].id)) {
        // Add selected user to project-team
        projects[currentProjectId].team.push(users[uid].id);
    } else {
        // Remove selected user from project-team
        // Make sure that a team is never empty by preventing deletion of last member
        if (projects[currentProjectId].team.length < 2) {
            alert("Not allowed with zero team members!");
            return;
        }

        // Check if the member to be deleted have any assignments
        var hasAssignment = false;
        for (var i = 0; !hasAssignment && i < projects[currentProjectId].status.length; i++) {
            for (var j = 0; !hasAssignment && j < projects[currentProjectId].status[i].tasks.length; j++) {
                if (projects[currentProjectId].status[i].tasks[j].assigned.includes(users[uid].id)) {
                    hasAssignment = true;
                }
            }
        }

        // If the memeber has assignments, ask for removal-confirmation
        if (!hasAssignment || confirm("Assignments for selected user will be removed from tasks!")) {
            var str = projects[currentProjectId].team;
            var n = str.indexOf(users[uid].id);
            projects[currentProjectId].team.splice(n, 1);
            if (hasAssignment) {
                // Loop through all tasks and remove member from assignments
                for (var i = 0; i < projects[currentProjectId].status.length; i++) {
                    for (var j = 0; j < projects[currentProjectId].status[i].tasks.length; j++) {
                        // Looping backwards to avoid index-problem when removing item from list
                        for (var k = projects[currentProjectId].status[i].tasks[j].assigned.length - 1; k >= 0; k--) {
                            if (projects[currentProjectId].status[i].tasks[j].assigned[k] == users[uid].id) {
                                projects[currentProjectId].status[i].tasks[j].assigned.splice(k, 1);
                            }
                        }
                    }
                }
            }
        }
    }
    manageTeam();
}

// Delete project and redirect to home-page
function deleteProject() {
    if (confirm("Are you sure you want to delete this project?")) {
        projects.splice(currentProjectId, 1);
        console.log("Attempting to delete " + currentProjectId);
        saveProjectChanges();
        location.href = "../html/home.html";
    }
}
