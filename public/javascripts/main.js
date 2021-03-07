// Socket.io setup for client
const socket = io("/");

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

    // Display post modal handler
    $("#textThinking").click(() => {
        $("#postModal").modal("toggle");
    });

    $("#postModal").on("shown.bs.modal", () => {
        $("#content").trigger("focus");
    });

    // Post handler
    $("#modalPostButton").click((event) => {
        let profileAvatar = $("#profileAvatar").attr("src");
        let name = $("#owner").text();
        let content = $("#content");
        let image = $("#image").val();
        let video = $("#video").val();
        let timestamp =
            new Date().toLocaleDateString() +
            ", " +
            new Date().toLocaleTimeString();

        event.preventDefault();

        // Check if content is not empty
        if (content.val() !== "") {
            // Emitting an message to announce server about the post information
            socket.emit("Add new post", {
                profileAvatar,
                name,
                content: content.val(),
                timestamp,
                image,
                video,
            });

            // Clear content textarea and close modal
            content.val("");
            $("#postModal").modal("hide");
        }
    });

    // Client listen to the rendering message from server to render new post
    socket.on("Rendering new post", (post) => {
        $("#postArea").append(`
            <div class="dashboard__contentCommunication mb-4 bg-white p-3 col-md-12">
                <div class="form-group row">
                    <div class="col-md-1 col-sm-2 col-3">
                        <img src=${post.profileAvatar} alt="user avatar" width="45" height="45"/>
                    </div>
                    <div class="col-md-11 col-sm-9 col-8">
                        <strong>${post.name}</strong>
                        <p>${post.timestamp}</p>
                    </div>
                </div>
                <p>${post.content}</p>
                <!-- <img src="/uploads/Ducati.jpg" width="100%" max-height="100%"/> -->
                <hr/>
                <div class="m-3">
                    <div class="btn-postStatus form-group row">
                        <div class="col-md-4 col-sm-4 col-4 text-center p-2" onclick="alert('Clicked Like')">
                            <img src="/images/like_icon.png" alt="pic-icon" width="35" height="35"/>
                            <span>Like</span>
                        </div>
                        <div class="col-md-4 col-sm-4 col-4 text-center p-2" onclick="alert('Clicked Comment')">
                            <img src="/images/comment_icon.png" alt="pic-icon" width="35" height="35"/>
                            <span>Comment</span>
                        </div>
                        <div class="col-md-4 col-sm-4 col-4 text-center p-2" onclick="alert('Clicked Share')">
                            <img src="/images/share_icon.png" alt="pic-icon" width="35" height="35"/>
                            <span>Share</span>
                        </div>
                    </div>
                </div>
            </div>
        `);
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
