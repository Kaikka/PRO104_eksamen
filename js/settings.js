window.onload = function () {
    renderProfileInfo();
    renderProfileFields();
};

function renderProfileFields() {
    // Print userinfo to fields
    var firstName = document.getElementById("first-name");
    var lastName = document.getElementById("last-name");
    var username = document.getElementById("username");

    firstName.value = currentUser.firstName;
    lastName.value = currentUser.lastName;
    username.value = currentUser.userName;
}

function changeProfileSettings() {
    var firstName = document.getElementById("first-name");
    var lastName = document.getElementById("last-name");
    var userName = document.getElementById("username");
    var image = document.querySelector("[name='image']").dataset.image;
    if (image == null) {
        image = currentUser.img;
    }

    var user = {
        id: currentUser.id,
        firstName: firstName.value,
        lastName: lastName.value,
        userName: userName.value,
        password: currentUser.password,
        img: image,
        background: currentUser.background,
    };

    users[currentUser.id - 1] = user;
    saveUserChanges();
    renderProfileInfo();

    // Finne ut hvordan rendre info øverst til venstre ved endring av bilde

    /*var container = document.querySelector(".img-container");
    container.innerHTML = "";*/
    // render profile info so new image will display
}

function changePassword() {
    var password1 = document.getElementById("password");
    var password2 = document.getElementById("password-confirm");
    var passwordError = document.getElementById("password-error");

    if (password1.value != password2.value) {
        passwordError.innerHTML = "Make sure you write the same password";
    } else if (password1.value.length == 0 || password2.value.length == 0) {
        passwordError.innerHTML = "Make sure you fill in the fields";
    } else {
        if (confirm("Are you sure you want to change your password?")) {
            var user = {
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                userName: currentUser.userName,
                password: password2.value,
                img: currentUser.img,
                background: currentUser.background,
            };
            users[currentUser.id - 1] = user;
            saveUserChanges();
        }
        passwordError.innerHTML = "";
    }
    password1.value = "";
    password2.value = "";
}

//Handleimg function to retrieve files form user
function handleImgSelect(event) {
    function handleImgLoad(event) {
        const previewImg = document.getElementById("imagePreview");
        previewImg.innerHTML = "<img src='" + event.target.result + "' height='150px' />";
        document.querySelector("[name='image']").dataset.image = event.target.result;
        // console.log(event.target.result);
    }

    const reader = new FileReader();
    reader.onload = handleImgLoad;
    reader.readAsDataURL(event.target.files[0]);
}
