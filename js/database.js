// Default users
var users = [
    {
        id: 1,
        firstName: "Kai",
        lastName: "Rimeid Amundsen",
        userName: "Kaikka",
        password: "kaiten",
        img: "../img/Kai.jpg",
        background: "rgb(30, 30, 30)",
    },
    {
        id: 2,
        firstName: "Tina",
        lastName: "Eilertsen",
        userName: "Tinaeile",
        password: "eile",
        img: "../img/Tina.jpg",
        background: "rgb(30, 30, 30)",
    },
    {
        id: 3,
        firstName: "Magnus",
        lastName: "Enholm",
        userName: "Jagsy",
        password: "music",
        img: "../img/Magnus.jpg",
        background: "#141414",
    },
    {
        id: 4,
        firstName: "Thomas",
        lastName: "Gladsø",
        userName: "Thomas",
        password: "Thomz",
        img: "../img/default.jpg",
        background: "rgb(30, 30, 30)",
    },
    {
        id: 5,
        firstName: "Kristian",
        lastName: "Stoa Mathisen",
        userName: "Kristian",
        password: "kristoball",
        img: "../img/Kris.jpg",
        background: "rgb(30, 30, 30)",
    },
];

// Default project
var projects = [
    {
        name: "PRO-104 Exam",
        description: "Develop a to-do tool. Maybe something we've missed in other to-do tools? It has to be something we could find usefil while doing this project.",
        team: [1, 2, 3, 4, 5],
        privacy: "private",
        status: [
            {
                category: "To do",
                tasks: [
                    {
                        name: "Fix CSS for login page",
                        description: "Both login and create user needs styling. Colors, larger font and maybe some animation?",
                        priority: 2,
                        isComplete: false,
                        assigned: [1, 2, 3, 4, 5],
                    },
                    {
                        name: "Implement fingerprint reader",
                        description: "Not everyone can remember their password. Make a fingerprint reader as alternative for password.",
                        priority: 1,
                        isComplete: false,
                        assigned: [1, 2, 3, 4, 5],
                    },
                    {
                        name: "Project titles too long does not look good.",
                        description: "Both in home.html and in project.html, the title name gets cut off (scrollable horizontally) when being too long.",
                        priority: 3,
                        isComplete: false,
                        assigned: [1, 2, 3, 4, 5],
                    },
                    {
                        name: "Get drunk",
                        description: "Semester is over when this project is done. Let's get drunk!",
                        priority: 3,
                        isComplete: false,
                        assigned: [1, 2, 3, 4, 5],
                    },
                ],
            },
            {
                category: "In progress",
                tasks: [
                    {
                        name: "JS functionality in profile page.",
                        description: "Being able to delete your user. Also make own confirm button when uploading a profilepicture, and being able to assign picture from URL also.",
                        priority: 1,
                        isComplete: false,
                        assigned: [1, 2, 3, 4, 5],
                    },
                    {
                        name: "Drag and drop",
                        description: "Drag and drop for several objects: statusbars, tasks and users.",
                        priority: 3,
                        isComplete: false,
                        assigned: [1, 2, 3, 4, 5],
                    },
                    {
                        name: "About us",
                        description: "A nice small site displaying who we are and something about this app.",
                        priority: 2,
                        isComplete: false,
                        assigned: [5],
                    },
                ],
            },
            {
                category: "Complete",
                tasks: [
                    {
                        name: "Create a user and login",
                        description: "Login.html, being able create a new user and log in while both write to localStorage.",
                        priority: 3,
                        isComplete: true,
                        assigned: [1, 3],
                    },
                    {
                        name: "Prototype",
                        description: "Make a prototype in XD.",
                        priority: 3,
                        isComplete: true,
                        assigned: [2],
                    },
                    {
                        name: "Theme",
                        description: "Make a theme function to edit the theme, including colors that are good for people that are colorblind.",
                        priority: 2,
                        isComplete: true,
                        assigned: [4],
                    },
                ],
            },
        ],
    },
];
