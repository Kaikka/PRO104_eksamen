document.addEventListener("DOMContentLoaded", function(event) {
	document.querySelector(".mobile-menu").addEventListener("click", function () { 
        document.querySelector('#sidebar').classList.toggle('active');
    });
});

function renderProfileInfo() {
    var container = document.querySelector(".img-container");
    container.innerHTML = "";

    // In case of not being logged in, get redirected to login page
    if (!currentUser) {
        console.log("Did you manually delete from localStorage? Redirecting you to login-page.");
        location.href = "../index.html";
    }

    var a = document.createElement("a");
    a.setAttribute("href", "../html/settings.html");
    var img = currentUser.img;
    if (img == null) {
        img = "../img/default.jpg";
    }
    var imgTag = document.createElement("img");

    imgTag.setAttribute("src", img);
    imgTag.className = "avatar pointer";

    var pName = document.querySelector(".menu-name");
    pName.innerHTML = currentUser.firstName + " " + currentUser.lastName;

    a.appendChild(imgTag);
    container.appendChild(a);
}

// Remove info of current logged in user and redirect to login page
function logout() {
    localStorage.removeItem("currentUser");
    location.href = "../index.html";
}

// Blur everything else than popup
function blurContent(status) {
    var content = document.querySelector(".wrapper");
    if (status) {
        content.style.filter = "blur(5px)";
    } else {
        content.style.filter = "blur(0px)";
    }
}

// Open sent in div as popup
function createPopup(id, popup) {
    document.getElementById(id).addEventListener("click", function () {
        document.querySelector(popup).style.display = "block";
        blurContent(true);
    });
}

// Close div
function closePopup(id) {
    document.querySelector(id).style.display = "none";
    blurContent(false);
}
