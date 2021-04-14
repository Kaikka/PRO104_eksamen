// Get info from value fields, then assign them to the project[] array, update localStorage and re-render the list of projects
function newProject() {
    var pTitle = document.getElementById("project-title").value;
    var pDesc = document.getElementById("project-description").value;
    var pPrivacy = document.getElementById("project-privacy").value;

    // Assign default name and description if none is given
    if (pTitle == "") {
        pTitle = "New project";
    }
    if (pDesc == "") {
        pDesc = "New project description";
    } 
    var project = {
        name: pTitle,
        description: pDesc,
        team: [currentUser.id],
        privacy: pPrivacy,
        status: [
            {
                category: "To do",
                tasks: [
                    {
                        name: "Example task",
                        description: "Example task description",
                        priority: 2,
                        isComplete: false,
                        assigned: [],
                    },
                ],
            },
            {
                category: "In Progress",
                tasks: [],
            },
            {
                category: "Complete",
                tasks: [],
            },
        ],
    };
    projects.push(project);
    saveProjectChanges();
    blurContent(false);
    document.querySelector(".popup").style.display = "none";
    renderProjects();
}
