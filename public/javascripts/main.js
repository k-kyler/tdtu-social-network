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
    $("label[for='userName']").click(() => {
        $("#userName").attr("disabled", false);
        $("#btnUpdate").attr("disabled", false);
    });

    $("label[for='userPhone']").click(() => {
        $("#userPhone").attr("disabled", false);
        $("#btnUpdate").attr("disabled", false);
    });

    $("label[for='newPassword']").click(() => {
        $("#newPassword").attr("disabled", false);
        $("#btnUpdate").attr("disabled", false);
    });

    $("label[for='class']").click(() => {
        $("#class").attr("disabled", false);
    });

    $("label[for='faculty']").click(() => {
        $("#faculty").attr("disabled", false);
    });

    // Edit notification form field handler
    $("label[for='editTittle']").click(() => {
        $("#editTittle").attr("disabled", false);
        $("#btnUpdateNotif").attr("disabled", false);
    });

    $("label[for='editContent']").click(() => {
        $("#editContent").attr("disabled", false);
        $("#btnUpdateNotif").attr("disabled", false);
    });

    $("label[for='editType']").click(() => {
        $("#editType").attr("disabled", false);
        $("#btnUpdateNotif").attr("disabled", false);
    });

    $("label[for='editAttachment']").click(() => {
        $("#editAttachment").attr("disabled", false);
    });

    // Edit management user form field handler
    $("label[for='editPassword']").click(() => {
        $("#editPassword").attr("disabled", false);
        $("#btnUpdateManagement").attr("disabled", false);
    });
    $("label[for='editWorkplace']").click(() => {
        $("#editWorkplace").attr("disabled", false);
        $("#btnUpdateManagement").attr("disabled", false);
    });
    $("label[for='editPermission']").click(() => {
        $("#editPermission").attr("disabled", false);
        $("#btnUpdateManagement").attr("disabled", false);
    });

    // Display post modal handler
    $("#textThinking").click(() => {
        $("#postModal").modal("toggle");
    });

    $("#postModal").on("shown.bs.modal", () => {
        $("#content").trigger("focus");
    });

    // Display notification details modal
    $(".NotifDetails").click(() => {
        $("#NotifDetailsModal").modal("toggle");
    });

    // Display editNotif modal
    $(".EditNotif").click(() => {
        $("#EditNotifModal").modal("toggle");
    });

    // Display editManagement user modal
    $(".EditManagement").click(() => {
        $("#EditManagementModal").modal("toggle");
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

        // Check if video is a youtube URL
        if (video && !video.includes("https://www.youtube.com")) {
            $("#errorPost").html("Not youtube URL");
        } else if (!video) {
            // Check if content is not empty
            if (content.val() !== "") {
                $("#errorPost").html("");

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
            } else {
                $("#errorPost").html("Missing content");
            }
        }
    });

    // display post handler modal
    $("body").on("click", ".postHandler", (event) => {
        let postUniqueId = event.target.dataset.postuniqueid;

        event.preventDefault();
        $("#editPostButton").attr("data-postUniqueId", postUniqueId);
        $("#deletePostButton").attr("data-postUniqueId", postUniqueId);
        fetch(`/dashboard/post/${postUniqueId}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    $("#editPostContent").val(result.data.content);
                    $("#editImage").val(result.data.image);
                    $("#editVideo").val(result.data.video);
                }
            })
            .catch((error) => console.log(error));
        $("#postHandlerModal").modal("toggle");
    });

    // Edit post handler
    // $("body").on("click", "#editPostButton", (event) => {
    //     let postUniqueId = event.target.dataset.postuniqueid;

    //     event.preventDefault();
    //     fetch(`/dashboard/post/edit`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         method: "PUT",
    //         body: JSON.stringify({}),
    //     });
    //     $("#postHandlerModal").modal("hide");
    // });

    // Client listen to the rendering message from server to render new post
    socket.on("Rendering new post", (post, postUniqueId) => {
        if (post.image && !post.video) {
            $("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 bg-white p-3 col-md-12" id=${postUniqueId}>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <img src=${post.profileAvatar} alt="user avatar" width="40" height="40"/>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>${post.name}</strong>
                                    <p>${post.timestamp}</p>
                                </div>
                                <button class="btn btn-link text-dark posthandler" data-postUniqueId=${postUniqueId}>
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p>${post.content}</p>
                    <div class="row">
                        <div class="px-0 col-md-12>
                            <img src=${post.image} class="w-100" />
                        </div>
                    </div>
                    <hr/>
                    <div class="m-3">
                        <div class="btn-postStatus form-group row">
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/like_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Like</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/comment_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Comment</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/share_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Share</span>
                            </div>
                        </div>

                        <!-- Comment -->
                        <div class="dashboard__contentCommunicationComment" id="comment-${postUniqueId}">
                            <div id="commentSection" data-postUniqueId=${postUniqueId}></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 d-flex">
                                <input type="text" placeholder="Write your comment..." class="form-control" data-inputComment=${postUniqueId} onkeypress="emitComment(event)" />
                                <button class="ml-1 btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${postUniqueId}>
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        } else if (post.video && !post.image) {
            $("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 bg-white p-3 col-md-12" id=${postUniqueId}>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <img src=${post.profileAvatar} alt="user avatar" width="40" height="40"/>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>${post.name}</strong>
                                    <p>${post.timestamp}</p>
                                </div>
                                <button class="btn btn-link text-dark postHandler" data-postUniqueId=${postUniqueId}>
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p>${post.content}</p>
                    <div class="row">
                        <div class="px-0 col-md-12 embed-responsive">
                            <iframe class="embed-responsive-item" src=${post.video} allowfullscreen></iframe>
                        </div>
                    </div>
                    <hr/>
                    <div class="m-3">
                        <div class="btn-postStatus form-group row">
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/like_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Like</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/comment_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Comment</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/share_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Share</span>
                            </div>
                        </div>

                        <!-- Comment -->
                        <div class="dashboard__contentCommunicationComment" id="comment-${postUniqueId}">
                            <div id="commentSection" data-postUniqueId=${postUniqueId}></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 d-flex">
                                <input type="text" placeholder="Write your comment..." class="form-control" data-inputComment=${postUniqueId} onkeypress="emitComment(event)" />
                                <button class="ml-1 btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${postUniqueId}>
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        } else if (post.video && post.image) {
            $("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 bg-white p-3 col-md-12" id=${postUniqueId}>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <img src=${post.profileAvatar} alt="user avatar" width="40" height="40"/>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>${post.name}</strong>
                                    <p>${post.timestamp}</p>
                                </div>
                                <button class="btn btn-link text-dark postHandler" data-postUniqueId=${postUniqueId}>
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p>${post.content}</p>
                    <div class="row">
                        <div class="px-0 col-md-6>
                            <img src=${post.image} class="w-100" />
                        </div>
                        <div class="px-0 col-md-6 embed-responsive">
                            <iframe class="embed-responsive-item" src=${post.video} allowfullscreen></iframe>
                        </div>
                    </div>
                    <hr/>
                    <div class="m-3">
                        <div class="btn-postStatus form-group row">
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/like_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Like</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/comment_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Comment</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/share_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Share</span>
                            </div>
                        </div>

                        <!-- Comment -->
                        <div class="dashboard__contentCommunicationComment" id="comment-${postUniqueId}">
                            <div id="commentSection" data-postUniqueId=${postUniqueId}></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 d-flex">
                                <input type="text" placeholder="Write your comment..." class="form-control" data-inputComment=${postUniqueId} onkeypress="emitComment(event)" />
                                <button class="ml-1 btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${postUniqueId}>
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        } else if (!post.video && !post.image) {
            $("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 bg-white p-3 col-md-12" id=${postUniqueId}>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <img src=${post.profileAvatar} alt="user avatar" width="40" height="40"/>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>${post.name}</strong>
                                    <p>${post.timestamp}</p>
                                </div>
                                <button class="btn btn-link text-dark postHandler" data-postUniqueId=${postUniqueId}>
                                    <i class="fas fa-ellipsis-h"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p>${post.content}</p>
                    <hr/>
                    <div class="m-3">
                        <div class="btn-postStatus form-group row">
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/like_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Like</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/comment_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Comment</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 text-center p-2">
                                <img src="/images/share_icon.png" alt="pic-icon" width="35" height="35"/>
                                <span>Share</span>
                            </div>
                        </div>

                        <!-- Comment -->
                        <div class="dashboard__contentCommunicationComment" id="comment-${postUniqueId}">
                            <div id="commentSection" data-postUniqueId=${postUniqueId}></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 d-flex">
                                <input type="text" placeholder="Write your comment..." class="form-control" data-inputComment=${postUniqueId} onkeypress="emitComment(event)" />
                                <button class="ml-1 btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${postUniqueId}>
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }

        // Send request to store post to db
        fetch("/dashboard/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postUniqueId,
                profileAvatar: post.profileAvatar,
                name: post.name,
                timestamp: post.timestamp,
                content: post.content,
                video: post.video,
            }),
        }).catch((error) => console.error(error));
    });

    // Client listen to the rendering message from server to render new comment
    socket.on("Rendering new comment", (comment, commentUniqueId) => {
        $("div[data-postUniqueId=" + comment.postUniqueId + "]").append(`
            <div class="form-group row" id=${commentUniqueId}>
                <div class="col-md-1 col-sm-2 col-3">
                    <img class="comment-ProfilePic" src=${comment.guestAvatar} alt="user avatar" width="40" height="40"/>
                </div>
                <div class="col-md-11 col-sm-9 col-8">
                    <strong>${comment.guestName}</strong><span> - ${comment.commentTimeStamp}</span>
                    <p>${comment.guestComment}</p>
                </div>
            </div>
        `);
        document.getElementById(
            "comment-" + comment.postUniqueId
        ).scrollTop = document.getElementById(
            "comment-" + comment.postUniqueId
        ).scrollHeight;

        // Send request to store comment of post to db
        fetch(`/dashboard/post`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postUniqueId: comment.postUniqueId,
                commentUniqueId,
                guestAvatar: comment.guestAvatar,
                guestName: comment.guestName,
                guestComment: comment.guestComment,
                commentTimeStamp: comment.commentTimeStamp,
            }),
        }).catch((error) => console.error(error));
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

// Update info form handler
document.getElementById("infoForm").addEventListener("submit", (event) => {
    event.preventDefault();

    let userEmail = document.getElementById("userEmail").value;
    let userName = document.getElementById("userName").value;
    let userPhone = document.getElementById("userPhone");
    let newPassword = document.getElementById("newPassword");
    let studentClass = document.getElementById("class");
    let studentFaculty = document.getElementById("faculty");

    if (!studentClass) {
        studentClass = "";
    } else {
        studentClass = studentClass.value;
    }

    if (!studentFaculty) {
        studentFaculty = "";
    } else {
        studentFaculty = studentFaculty.value;
    }

    if (!newPassword) {
        newPassword = "";
    } else {
        newPassword = newPassword.value;
    }

    if (!userPhone) {
        userPhone = "";
    } else {
        userPhone = userPhone.value;
    }

    fetch("/dashboard/info", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userEmail: userEmail,
            userName: userName,
            userPhone: userPhone,
            newPassword: newPassword,
            studentClass: studentClass,
            studentFaculty: studentFaculty,
        }),
    })
        .then((res) => res.json())
        .then((result) => {
            let userName = document.getElementById("userName");
            let userPhone = document.getElementById("userPhone");
            let newPassword = document.getElementById("newPassword");
            let btnUpdate = document.getElementById("btnUpdate");

            let messageError = document.getElementById("updateInfoError");
            let messageSuccess = document.getElementById("updateInfoSuccess");

            if (result.success) {
                messageError.innerHTML = "";
                messageSuccess.innerHTML = result.success;
                userName.setAttribute("disabled", "disabled");
                userPhone.setAttribute("disabled", "disabled");
                newPassword.setAttribute("disabled", "disabled");
                btnUpdate.setAttribute("disabled", "disabled");

                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 2000);
            } else if (result.error) {
                messageSuccess.innerHTML = "";
                messageError.innerHTML = result.error;
            } else {
                messageError.innerHTML = "";
            }
        })
        .catch((error) => console.error(error));
});

// Update notification form handler
// HERE

// Update staff management form handler
// HERE

// Comment handler
const emitComment = (event) => {
    if (event.keyCode === 13) {
        let sidebarUsername = document.getElementById("sidebarUsername")
            .innerHTML;
        let displayInfo = document
            .getElementById("displayInfo")
            .getAttribute("src");
        let postUniqueId = event.target.getAttribute("data-inputComment");
        let inputComment = event.target.value;

        if (inputComment !== "") {
            socket.emit("Add new comment", {
                postUniqueId: postUniqueId,
                guestAvatar: displayInfo,
                guestComment: inputComment,
                guestName: sidebarUsername,
                commentTimeStamp:
                    new Date().toLocaleDateString() +
                    ", " +
                    new Date().toLocaleTimeString(),
            });
            event.target.value = "";
        }
    }
};

const emitCommentOnButton = (event) => {
    let sidebarUsername = document.getElementById("sidebarUsername").innerHTML;
    let displayInfo = document
        .getElementById("displayInfo")
        .getAttribute("src");
    let postUniqueId = event.target.dataset.postuniqueid;

    if (
        document.body.querySelector(
            `input[data-inputComment="${postUniqueId}"]`
        ) &&
        document.body.querySelector(
            `input[data-inputComment="${postUniqueId}"]`
        ).value !== ""
    ) {
        socket.emit("Add new comment", {
            postUniqueId: postUniqueId,
            guestAvatar: displayInfo,
            guestComment: document.body.querySelector(
                `input[data-inputComment="${postUniqueId}"]`
            ).value,
            guestName: sidebarUsername,
            commentTimeStamp:
                new Date().toLocaleDateString() +
                ", " +
                new Date().toLocaleTimeString(),
        });
        document.body.querySelector(
            `input[data-inputComment="${postUniqueId}"]`
        ).value = "";
    }
};
