// jQuery code
$(document).ready(() => {
    // Display log out modal when clicked on log out button
    $("#logoutButton").click(() => {
        $("#logoutModal").modal("toggle");
    });

    // Display info modal when clicked on avatar
    $("#displayInfo").click(() => {
        $("#infoModal").modal("toggle");
    });

    // Fetch request for user to log out
    $("#modalLogoutButton").click(() => {
        fetch("/logout")
            .then((response) => {
                if (response.status === 200) {
                    window.location.href = "/";
                }
            })
            .catch((error) => console.error(error));
    });

    // Select workplace handler
    $("#workplace").val($("#workplaceHidden").val());

    // Select permission handler
    let permission = $("#permissionHidden").val();

    if (permission) {
        $.each(
            permission
                .split("[")[1]
                .split("]")[0]
                .split('"')
                .join("")
                .split(","),
            (index, element) => {
                $("#permission option[value='" + element + "']").prop(
                    "selected",
                    true
                );
            }
        );
    }

    // Edit info form field handler
    $("label[for='name']").click(() => {
        $("#name").attr("disabled", false);
    });

    $("label[for='phone']").click(() => {
        $("#phone").attr("disabled", false);
    });

    $("label[for='new-password']").click(() => {
        $("#new-password").attr("disabled", false);
    });

    $("label[for='class']").click(() => {
        $("#class").attr("disabled", false);
    });

    $("label[for='faculty']").click(() => {
        $("#faculty").attr("disabled", false);
    });
});

// JavaScript code
// Google Auth handler
function onGoogleSignIn(googleUser) {
    let googleIdToken = googleUser.getAuthResponse().id_token;
    let xhr = new XMLHttpRequest();

    // Send AJAX POST Google sign in request to server,
    // if receive successful message then redirect back to home page
    // if it's not type of Student TDTU email then display error
    xhr.open("POST", "/auth/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
        if (xhr.responseText === "Sign in successful with Google") {
            onGoogleSignOut();
            window.location.href = "/dashboard";
        } else if (xhr.responseText === "Your email is not for TDTU Student") {
            onGoogleSignOut();
            document.getElementById("signInErrorMessage").innerHTML =
                xhr.responseText;
        }
    };
    xhr.send(JSON.stringify({ googleIdToken: googleIdToken }));
}

function onGoogleSignOut() {
    let authentication2 = gapi.auth2.getAuthInstance();
    authentication2.signOut();
}

// Edit info form avatar handler
function displayAvatarHandler(avatar) {
    if (avatar.files && avatar.files[0]) {
        let fileReader = new FileReader();

        fileReader.onload = (event) => {
            $("#avatarInfo").attr("src", event.target.result);
        };
        fileReader.readAsDataURL(avatar.files[0]);
    }
}
