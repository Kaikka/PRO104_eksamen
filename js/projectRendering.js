// window.onload = renderProjects;

// Loop through and render out all projects
function renderProjects() {
    var projectsDiv = document.getElementById("projects");
    projectsDiv.innerHTML = "";

    for (var i = 0; i < projects.length; i++) {
        if (currentUserIsMemberOfProject(projects[i])) {
            var pName = projects[i].name;
            var pDescription = projects[i].description;

            var div = document.createElement("div");
            div.className = "project-box pointer";
            div.setAttribute("onclick", `location.href='project.html?project=${i}'`);
            div.innerHTML = `
            <h2>${pName}</h2>
            <hr>
            <p class="description">${pDescription}</p>
            `;
            projectsDiv.appendChild(div);
        }
    }
}

function currentUserIsMemberOfProject(project) {
    for (var i = 0; i < project.team.length; i++) {
        if (currentUser.id == project.team[i]) {
            return true;
        }
    }
    return false;
}
