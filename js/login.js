window.onload = onclicks;

// Assign onclick with addEventListener rather than as an attribute in .html, to use getElementById values as parameters and not have to set them in the function itself
function onclicks() {
    //login() with parameters from input fields
    document.getElementById("login-btn").addEventListener("click", function() {
        login(document.getElementById("uname").value, document.getElementById("pwd").value)
    });
    document.getElementById("signupbtn").addEventListener("click", function() {
        //signUp() with parameters from input fields
        signUp(document.getElementById("fname").value, 
        document.getElementById("lname").value, document.getElementById("username").value, document.getElementById("newpwd").value)
    });
};


// Switch between login and signUp forms
function swapForm(par) {
    var loginContainer = document.getElementById("login-box");
    var signUpContainer = document.getElementById("signup-box");
    
    if (par == "signUp") {
        // Hide login form
        loginContainer.style.display = "none";

        // Show sign up form
        signUpContainer.style.display = "block";
    } else if (par == "login") {
        // Show login form
        loginContainer.style.display = "block";

        // Hide sign up form
        signUpContainer.style.display = "none";
    }
}


