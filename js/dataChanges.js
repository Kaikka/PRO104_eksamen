// File to contain some premade users/projects to put in localdb,
// and other data-editing functions

// Assign the default users and projects if localStorage is empty
if (!getStorage("userdb")) {
    setStorage("userdb", users);
} else {
    users = getStorage("userdb");
}

if (!getStorage("projectdb")) {
    setStorage("projectdb", projects);
} else {
    projects = getStorage("projectdb");
}

// Array info of current user logged in, useful for currentUser.id, .firstName and so on
var currentUser = users[getStorage("currentUser") - 1];

// Sign up with required login. If accepted, run login() with given parameters
function signUp(firstName, lastName, username, password) {

    if (firstName.length === 0 || lastName.length === 0 || username.length === 0 || password.length === 0) {

    } else {
        var user = {
            id: users.length + 1,
            firstName: firstName,
            lastName: lastName,
            userName: username,
            password: password,
            img: null,
            background: "#141414",
        };

        users.push(user);
        saveUserChanges();

        // Sign in with the user created
        login(username, password);
    }
}

function updateBg(bg) {
    if (currentUser) {
        users[getStorage("currentUser") - 1].background = bg;
        saveUserChanges();
    }
}

// Login the user, login(username, password)
function login(user, pwd) {
    var login = false;

    // Display errormessage if blank fields, else log the user in and update its ID to localStorage
    if (user.length === 0 || pwd.length === 0) {
        document.getElementById("failedLogin").style.display = "block";
    } else {
        for (var i = 0, j = users.length; i < j; i++) {
            if (users[i].userName === user && users[i].password === pwd) {
                setStorage("currentUser", users[i].id);
                login = true;
                location.href = "html/home.html";
                console.log("Logged in as " + users[i].userName + ". Welcome, " + users[i].firstName + " " + users[i].lastName + ".");
            }
        }
        if (!login) {
            document.getElementById("failedLogin").style.display = "block";
            console.log("Failed login!");
        }
    }
}

// Set localStorage info for pre-made userdb and projectdb.
function saveUserChanges() {
    setStorage("userdb", users);
}

function saveProjectChanges() {
    setStorage("projectdb", projects);
}

// Base functions to set or get info from localStorage. Allows for easy expanding by either making functions with hardcoded values like above
function setStorage(keyName, keyValue) {   
    return localStorage.setItem(keyName, JSON.stringify(keyValue));
}

function getStorage(keyName) {
    return JSON.parse(localStorage.getItem(keyName));
}
