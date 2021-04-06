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
        event.preventDefault();

        let profileAvatar = $("#profileAvatar").attr("src");
        let name = $("#owner").text();
        let content = $("#content");
        let video = $("#video").val();
        let ownerId = $("#userObjectId").val();
        let timestamp =
            new Date().toLocaleDateString() +
            ", " +
            new Date().toLocaleTimeString();

        // Check if video is a youtube URL then emitting it
        if (video && !video.includes("https://www.youtube.com")) {
            $("#errorPost").html("Not youtube URL");
        } else if (!video) {
            // Check if content is not empty
            if (content.val() !== "") {
                $("#errorPost").html("");

                // Emitting an message to announce server about the post information
                socket.emit("Add new post", {
                    ownerId,
                    profileAvatar,
                    name,
                    content: content.val(),
                    timestamp,
                    image: $("#hiddenImageURL").val(),
                    video,
                });

                // Clear old and close modal
                content.val("");
                $("#postImageReview").removeAttr("src");
                $("#postImageReview").removeAttr("class");
                $("#postImageName").html("Add to post");
                $("#postImage").val("");
                $("#postModal").modal("hide");
            } else {
                $("#errorPost").html("Missing content");
            }
        } else if (video && video.includes("https://www.youtube.com")) {
            // Check if content is not empty
            if (content.val() !== "") {
                $("#errorPost").html("");

                // Emitting an message to announce server about the post information
                socket.emit("Add new post", {
                    ownerId,
                    profileAvatar,
                    name,
                    content: content.val(),
                    timestamp,
                    image: $("#hiddenImageURL").val(),
                    video:
                        video.split("watch?v=")[0] +
                        "embed/" +
                        video.split("watch?v=")[1],
                });

                // Clear old and close modal
                content.val("");
                $("#postImageReview").removeAttr("src");
                $("#postImageReview").removeAttr("class");
                $("#postImageName").html("Add to post");
                $("#postImage").val("");
                $("#postModal").modal("hide");
            } else {
                $("#errorPost").html("Missing content");
            }
        }
    });

    // Display edit post modal
    $("body").on("click", ".editPost", (event) => {
        let postUniqueId = event.target.dataset.postuniqueid;

        event.preventDefault();

        $("#editPostButton").attr("data-postUniqueId", postUniqueId);

        fetch(`/dashboard/post/${postUniqueId}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    $("#editPostContent").val(result.data.content);

                    if (result.data.image) {
                        $("#editPostImageReview").attr(
                            "src",
                            result.data.image
                        );
                        $("#editPostImageReview").attr("class", "mr-3");
                        $("#editPostImageName").html(
                            result.data.image.split("/uploads/")[1]
                        );
                    }

                    if (result.data.video) {
                        $("#editPostVideo").val(
                            result.data.video.split("embed/")[0] +
                                "watch?v=" +
                                result.data.video.split("embed/")[1]
                        );
                    } else if (!result.data.video) {
                        $("#editPostVideo").val("");
                    }
                }
            })
            .catch((error) => console.log(error));

        $("#editPostModal").modal("toggle");
    });

    // Edit post handler
    $("body").on("click", "#editPostButton", (event) => {
        let postUniqueId = event.target.dataset.postuniqueid;
        let timestamp =
            "Modified - " +
            new Date().toLocaleDateString() +
            ", " +
            new Date().toLocaleTimeString();
        let video = $("#editPostVideo").val();
        let content = $("#editPostContent");

        event.preventDefault();

        // Check if video is a youtube URL then emitting it
        if (video && !video.includes("https://www.youtube.com")) {
            $("#errorEditPost").html("Not youtube URL");
        } else if (!video) {
            // Check if content is not empty
            if (content.val() !== "") {
                $("#errorEditPost").html("");

                // Emitting an message to announce server to update post
                socket.emit("Update post", {
                    content: content.val(),
                    timestamp,
                    image: $("#editHiddenImageURL").val()
                        ? $("#editHiddenImageURL").val()
                        : $("#editPostImageReview").attr("src"),
                    video,
                    postUniqueId,
                });

                // Send request to update post in db
                fetch(`/dashboard/post/edit`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                    body: JSON.stringify({
                        postUniqueId,
                        content: content.val(),
                        timestamp,
                        image: $("#editHiddenImageURL").val(),
                    }),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        if (result.code === 1) {
                            if (
                                result.ownerId ==
                                document.getElementById("userObjectId").value
                            ) {
                                $("#alertContainer").prepend(`
                                    <div class="alert alert-primary alert-dismissible fade show ${result.alertId}" role="alert">
                                        <i class="far fa-bell h5 mr-2"></i>
                                        <span>${result.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `);
                                setTimeout(() => {
                                    $(`.${result.alertId}`).alert("close");
                                }, 4000);

                                $(`#${postUniqueId} .post-image`).attr(
                                    "src",
                                    result.imageURL
                                );
                            }
                        } else {
                            $("#errorEditPost").html(result.message);
                        }
                    })
                    .catch((error) => console.log(error));

                // Clear old and close modal
                content.val("");
                $("#editPostImageReview").removeAttr("src");
                $("#editPostImageReview").removeAttr("class");
                $("#editPostImageName").html("Add to post");
                $("#editPostImage").val("");
                $("#editPostModal").modal("hide");
            } else {
                $("#errorEditPost").html("Missing content");
            }
        } else if (video && video.includes("https://www.youtube.com")) {
            // Check if content is not empty
            if (content.val() !== "") {
                $("#errorEditPost").html("");

                // Emitting an message to announce server to update post
                socket.emit("Update post", {
                    postUniqueId,
                    content: content.val(),
                    timestamp,
                    image: $("#editHiddenImageURL").val()
                        ? $("#editHiddenImageURL").val()
                        : $("#editPostImageReview").attr("src"),
                    video:
                        video.split("watch?v=")[0] +
                        "embed/" +
                        video.split("watch?v=")[1],
                });

                // Send request to update post in db
                fetch(`/dashboard/post/edit`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                    body: JSON.stringify({
                        postUniqueId,
                        content: content.val(),
                        timestamp,
                        image: $("#editHiddenImageURL").val(),
                        video:
                            video.split("watch?v=")[0] +
                            "embed/" +
                            video.split("watch?v=")[1],
                    }),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        if (result.code === 1) {
                            if (
                                result.ownerId ==
                                document.getElementById("userObjectId").value
                            ) {
                                $("#alertContainer").prepend(`
                                    <div class="alert alert-primary alert-dismissible fade show ${result.alertId}" role="alert">
                                        <i class="far fa-bell h5 mr-2"></i>
                                        <span>${result.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `);
                                setTimeout(() => {
                                    $(`.${result.alertId}`).alert("close");
                                }, 4000);

                                $(`#${postUniqueId} .post-image`).attr(
                                    "src",
                                    result.imageURL
                                );
                            }
                        } else {
                            $("#errorEditPost").html(result.message);
                        }
                    })
                    .catch((error) => console.log(error));

                // Clear old and close modal
                content.val("");
                $("#editPostImageReview").removeAttr("class");
                $("#editPostImageName").html("Add to post");
                $("#editPostImage").val("");
                $("#editPostModal").modal("hide");
            } else {
                $("#errorEditPost").html("Missing content");
            }
        }
    });

    // Display delete post modal
    $("body").on("click", ".deletePost", (event) => {
        let postUniqueId = event.target.dataset.postuniqueid;

        event.preventDefault();

        $("#deletePostButton").attr("data-postUniqueId", postUniqueId);

        $("#deletePostModal").modal("toggle");
    });

    // Delete post handler
    $("body").on("click", "#deletePostButton", (event) => {
        let postUniqueId = event.target.dataset.postuniqueid;

        event.preventDefault();

        fetch(`/dashboard/post/delete/${postUniqueId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    if (
                        result.ownerId ==
                        document.getElementById("userObjectId").value
                    ) {
                        $("#alertContainer").prepend(`
                            <div class="alert alert-primary alert-dismissible fade show ${result.alertId}" role="alert">
                                <i class="far fa-bell h5 mr-2"></i>
                                <span>${result.message}</span>                                                                   
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        `);
                        setTimeout(() => {
                            $(`.${result.alertId}`).alert("close");
                        }, 4000);

                        $("#deletePostModal").modal("hide");

                        // Emitting an message to announce server to delete post
                        socket.emit("Delete post", postUniqueId);
                    }
                }
            })
            .catch((error) => console.log(error));
    });

    // Display view bigger post image modal
    $("body").on("click", ".post-image", (event) => {
        let postImageSrc = event.target.getAttribute("src");

        event.preventDefault();

        $("#viewBiggerPostImage").attr("src", postImageSrc);
        $("#viewBiggerPostImageModal").modal("toggle");
    });

    // Display edit comment modal
    $("body").on("click", ".editComment", (event) => {
        let postUniqueId = event.target.dataset.postuniqueid;

        event.preventDefault();

        $("#editCommentModal").modal("toggle");
    });

    // Client listen to the rendering message from server to render new post
    socket.on("Rendering new post", (post, postUniqueId) => {
        if (post.ownerId == document.getElementById("userObjectId").value) {
            $("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 bg-white p-3 col-md-12" id=${postUniqueId}>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <img src=${
                                post.profileAvatar
                            } alt="user avatar" width="40" height="40"/>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>${post.name}</strong>
                                    <p class="mb-0 text-secondary timestamp-post">
                                        ${post.timestamp}
                                    </p>
                                </div>
                                <div class="dropdown show">
                                    <a class="btn btn-link text-dark dropdown-toggle" role="button" id="postHandlerDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </a>
                                    
                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="postHandlerDropdown">
                                        <button class="dropdown-item btn btn-link editPost" data-postUniqueId=${postUniqueId}>Edit</button>
                                        <button class="dropdown-item btn btn-link deletePost" data-postUniqueId=${postUniqueId}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="post-content">${post.content}</p>
                    <div id="imageAndVideoContainer">
                        ${
                            post.image && post.video
                                ? `
                                <div class="row">
                                    <div class="px-0 col-md-6">
                                        <img src="/images/imageLoading.gif" class="post-image" />
                                    </div>
                                    <div class="px-0 col-md-6 embed-responsive embed-responsive-16by9">
                                        <iframe class="embed-responsive-item" src=${post.video} allowfullscreen></iframe>
                                    </div>
                                </div>   
                            `
                                : !post.image && post.video
                                ? `
                                <div class="row">
                                    <div class="px-0 col-md-12 embed-responsive embed-responsive-16by9">
                                        <iframe class="embed-responsive-item" src=${post.video} allowfullscreen></iframe>
                                    </div>
                                </div>
                            `
                                : post.image && !post.video
                                ? `
                                <div class="row">
                                    <div class="px-0 col-md-12">
                                        <img src="/images/imageLoading.gif" class="post-image" />
                                    </div>
                                </div>
                            `
                                : `
                                
                            `
                        }
                    </div>
                    <div class="m-3">
                        <hr class="my-0" />
                        <div class="btn-postStatus form-group row mb-0">
                            <div class="col-md-4 col-sm-4 col-4 p-2 d-flex align-items-center justify-content-center">
                                <i class="far fa-thumbs-up"></i>
                                <span class="ml-2">Like</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 p-2">
                                <label class="mb-0 d-flex align-items-center justify-content-center" for="commentInput-${postUniqueId}">
                                    <i class="far fa-comment-dots"></i>
                                    <span class="ml-2">Comment</span>
                                </label>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 p-2 d-flex align-items-center justify-content-center">
                                <i class="fas fa-share-square"></i>
                                <span class="ml-2">Share</span>
                            </div>
                        </div>
                        <hr class="mt-0 mb-4" />

                        <!-- Comment -->
                        <div class="dashboard__contentCommunicationComment" id="comment-${postUniqueId}">
                            <div id="commentSection" data-postUniqueId=${postUniqueId}></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 input-group commentInputStyles">
                                <input type="text" placeholder="Write your comment..." id="commentInput-${postUniqueId}" class="form-control commentInput" data-inputComment=${postUniqueId} onkeypress="emitComment(event)" />
                                <div class="input-group-append">
                                    <button class="btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${postUniqueId}>
                                        <i class="fas fa-paper-plane" data-postUniqueId=${postUniqueId}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        } else {
            $("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 bg-white p-3 col-md-12" id=${postUniqueId}>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <img src=${
                                post.profileAvatar
                            } alt="user avatar" width="40" height="40"/>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>${post.name}</strong>
                                    <p class="mb-0 text-secondary timestamp-post">
                                        ${post.timestamp}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="post-content">${post.content}</p>
                    <div id="imageAndVideoContainer">
                        ${
                            post.image && post.video
                                ? `
                                <div class="row">
                                    <div class="px-0 col-md-6">
                                        <img src="/images/imageLoading.gif" class="post-image" />
                                    </div>
                                    <div class="px-0 col-md-6 embed-responsive embed-responsive-16by9">
                                        <iframe class="embed-responsive-item" src=${post.video} allowfullscreen></iframe>
                                    </div>
                                </div>   
                            `
                                : !post.image && post.video
                                ? `
                                <div class="row">
                                    <div class="px-0 col-md-12 embed-responsive embed-responsive-16by9">
                                        <iframe class="embed-responsive-item" src=${post.video} allowfullscreen></iframe>
                                    </div>
                                </div>
                            `
                                : post.image && !post.video
                                ? `
                                <div class="row">
                                    <div class="px-0 col-md-12">
                                        <img src="/images/imageLoading.gif" class="post-image" />
                                    </div>
                                </div>
                            `
                                : `
                                
                            `
                        }
                    </div>
                    <div class="m-3">
                        <hr class="my-0" />
                        <div class="btn-postStatus form-group row mb-0">
                            <div class="col-md-4 col-sm-4 col-4 p-2 d-flex align-items-center justify-content-center">
                                <i class="far fa-thumbs-up"></i>
                                <span class="ml-2">Like</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 p-2">
                                <label class="mb-0 d-flex align-items-center justify-content-center" for="commentInput-${postUniqueId}">
                                    <i class="far fa-comment-dots"></i>
                                    <span class="ml-2">Comment</span>
                                </label>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 p-2 d-flex align-items-center justify-content-center">
                                <i class="fas fa-share-square"></i>
                                <span class="ml-2">Share</span>
                            </div>
                        </div>
                        <hr class="mt-0 mb-4" />

                        <!-- Comment -->
                        <div class="dashboard__contentCommunicationComment" id="comment-${postUniqueId}">
                            <div id="commentSection" data-postUniqueId=${postUniqueId}></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 input-group commentInputStyles">
                                <input type="text" placeholder="Write your comment..." id="commentInput-${postUniqueId}" class="form-control commentInput" data-inputComment=${postUniqueId} onkeypress="emitComment(event)" />
                                <div class="input-group-append">
                                    <button class="btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${postUniqueId}>
                                        <i class="fas fa-paper-plane" data-postUniqueId=${postUniqueId}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }

        // Send request to store post to db
        fetch("/dashboard/post", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                ownerId: post.ownerId,
                postUniqueId,
                profileAvatar: post.profileAvatar,
                name: post.name,
                timestamp: post.timestamp,
                content: post.content,
                video: post.video,
                image: post.image,
            }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    if (
                        post.ownerId ==
                        document.getElementById("userObjectId").value
                    ) {
                        $("#alertContainer").prepend(`
                            <div class="alert alert-primary alert-dismissible fade show ${result.alertId}" role="alert">
                                <i class="far fa-bell h5 mr-2"></i>
                                <span>${result.message}</span>
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        `);
                        setTimeout(() => {
                            $(`.${result.alertId}`).alert("close");
                        }, 4000);

                        $(`#${postUniqueId} .post-image`).attr(
                            "src",
                            result.imageURL
                        );
                    }
                }
            })
            .catch((error) => console.error(error));
    });

    // Client listen to the rendering message from server to render update post
    socket.on("Rendering update post", (updatePost) => {
        if (updatePost.video || updatePost.image) {
            $(`#${updatePost.postUniqueId} .timestamp-post`).html(
                updatePost.timestamp
            );
            $(`#${updatePost.postUniqueId} .post-content`).html(
                updatePost.content
            );
            $(`#${updatePost.postUniqueId} #imageAndVideoContainer`).html("");
            $(`#${updatePost.postUniqueId} #imageAndVideoContainer`).append(`
                ${
                    updatePost.image && updatePost.video
                        ? `
                        <div class="row">
                            <div class="px-0 col-md-6">
                                <img src="/images/imageLoading.gif" class="post-image" />
                            </div>
                            <div class="px-0 col-md-6 embed-responsive embed-responsive-16by9">
                                <iframe class="embed-responsive-item" src=${updatePost.video} allowfullscreen></iframe>
                            </div>
                        </div>   
                    `
                        : !updatePost.image && updatePost.video
                        ? `
                        <div class="row">
                            <div class="px-0 col-md-12 embed-responsive embed-responsive-16by9">
                                <iframe class="embed-responsive-item" src=${updatePost.video} allowfullscreen></iframe>
                            </div>
                        </div>
                    `
                        : updatePost.image && !updatePost.video
                        ? `
                        <div class="row">
                            <div class="px-0 col-md-12">
                                <img src="/images/imageLoading.gif" class="post-image" />
                            </div>
                        </div>
                    `
                        : `
                        
                    `
                }
            `);
        } else if (!updatePost.video && !updatePost.image) {
            $(`#${updatePost.postUniqueId} .timestamp-post`).html(
                updatePost.timestamp
            );
            $(`#${updatePost.postUniqueId} .post-content`).html(
                updatePost.content
            );
        }
    });

    // Client listen to the deleting message from server to delete post
    socket.on("Deleting post", (postUniqueId) => {
        $(`#${postUniqueId}`).remove();
    });

    // Client listen to the rendering message from server to render new comment
    socket.on("Rendering new comment", (comment, commentUniqueId) => {
        if (comment.guestId == document.getElementById("userObjectId").value) {
            $("div[data-postUniqueId=" + comment.postUniqueId + "]").append(`
                <div class="form-group row" id=${commentUniqueId}>
                    <div class="col-md-1 col-sm-2 col-3">
                        <img class="comment-ProfilePic" src=${comment.guestAvatar} alt="user avatar" width="35" height="35"/>
                    </div>
                    <div class="col-md-11 col-sm-9 col-8">
                        <div class="commentContainerStyles d-flex align-items-center">
                            <div class="py-1 px-2">
                                <strong>${comment.guestName}</strong>
                                <p class="mb-0">${comment.guestComment}</p>
                            </div>
                            <div class="dropdown show commentHandler">
                                <a class="btn btn-link text-dark bg-white dropdown-toggle" role="button" id="commentHandlerDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-h"></i>                                
                                </a>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="commentHandlerDropdown">
                                    <button class="dropdown-item btn btn-link editComment" data-commentUniqueId=${commentUniqueId}>Edit</button>
                                    <button class="dropdown-item btn btn-link deleteComment" data-commentUniqueId=${commentUniqueId}>Delete</button>
                                </div>
                            </div>
                        </div>
                        <small class="ml-2 text-secondary">${comment.commentTimeStamp}</small>
                    </div>
                </div>
            `);
        } else {
            $("div[data-postUniqueId=" + comment.postUniqueId + "]").append(`
                <div class="form-group row" id=${commentUniqueId}>
                    <div class="col-md-1 col-sm-2 col-3">
                        <img class="comment-ProfilePic" src=${comment.guestAvatar} alt="user avatar" width="35" height="35"/>
                    </div>
                    <div class="col-md-11 col-sm-9 col-8">
                        <div class="commentContainerStyles d-flex align-items-center">
                            <div class="py-1 px-2">
                                <strong>${comment.guestName}</strong>
                                <p class="mb-0">${comment.guestComment}</p>
                            </div>
                        </div>
                        <small class="ml-2 text-secondary">${comment.commentTimeStamp}</small>
                    </div>
                </div>
            `);
        }

        // Auto scroll down when comment
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
                guestId: comment.guestId,
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
        let imageReader = new FileReader();

        imageReader.onload = (event) => {
            $("#avatarInfo").attr("src", event.target.result);
        };
        imageReader.readAsDataURL(avatar.files[0]);
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
        let guestId = document.getElementById("userObjectId").value;
        let postUniqueId = event.target.getAttribute("data-inputComment");
        let inputComment = event.target.value;

        if (inputComment !== "") {
            socket.emit("Add new comment", {
                guestId: guestId,
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
    let guestId = document.getElementById("userObjectId").value;
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
            guestId: guestId,
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

// Disable post button
document.getElementById("modalPostButton").setAttribute("disabled", true);

// Disable edit post button
document.getElementById("editPostButton").setAttribute("disabled", true);

// Post content on change handler
document.getElementById("content").addEventListener("keyup", (event) => {
    if (event.target.value) {
        document.getElementById("modalPostButton").removeAttribute("disabled");
    } else {
        document
            .getElementById("modalPostButton")
            .setAttribute("disabled", true);
    }
});

// Edit post content and video on change handler
document
    .getElementById("editPostContent")
    .addEventListener("keyup", (event) => {
        if (event.target.value) {
            document
                .getElementById("editPostButton")
                .removeAttribute("disabled");
        } else {
            document
                .getElementById("editPostButton")
                .setAttribute("disabled", true);
        }
    });

document.getElementById("editPostVideo").addEventListener("keyup", (event) => {
    if (event.target.value) {
        document.getElementById("editPostButton").removeAttribute("disabled");
    } else {
        document
            .getElementById("editPostButton")
            .setAttribute("disabled", true);
    }
});

// Upload post image to file.io API when choosing image handler
let postImageInput = document.getElementById("postImage");

postImageInput.addEventListener("change", (event) => {
    document.getElementById("modalPostButton").setAttribute("disabled", true);
    document.getElementById("uploadPost").innerHTML = "";
    document.getElementById("uploadPost").innerHTML = `
        <div class="progress">
            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    `;

    // Set time out for progress bar 2
    setTimeout(() => {
        document.getElementById("uploadPost").innerHTML = "";
        document.getElementById("uploadPost").innerHTML = `
            <div class="progress">
                <div class="progress-bar progressBar-2" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
    }, 700);

    // Set time out for progress bar 3
    setTimeout(() => {
        document.getElementById("uploadPost").innerHTML = "";
        document.getElementById("uploadPost").innerHTML = `
            <div class="progress">
                <div class="progress-bar progressBar-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
    }, 900);

    // Set time out for progress bar 4
    setTimeout(() => {
        document.getElementById("uploadPost").innerHTML = "";
        document.getElementById("uploadPost").innerHTML = `
            <div class="progress">
                <div class="progress-bar progressBar-4" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
    }, 1100);

    // Upload image...
    uploadToFileIOAPI(event.target.files[0]);
});

const uploadToFileIOAPI = (image) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    formData.append("file", image);

    xhr.open("POST", "https://file.io", true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Create a hidden input to store the image's download link from file.io API
            let hiddenInput = document.createElement("input");

            hiddenInput.setAttribute("type", "hidden");
            hiddenInput.setAttribute("id", "hiddenImageURL");
            hiddenInput.setAttribute(
                "value",
                JSON.parse(xhr.responseText).link
            );
            document.querySelector("body").append(hiddenInput);

            // Set progress bar and enable post button
            document.getElementById("uploadPost").innerHTML = "";
            document.getElementById("uploadPost").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-5" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
            setTimeout(() => {
                document.getElementById("uploadPost").innerHTML = "";
            }, 500);
            document
                .getElementById("modalPostButton")
                .removeAttribute("disabled");
        }
    };
    xhr.send(formData);
};

// Upload edit post image to file.io API when choosing image handler
let editPostImageInput = document.getElementById("editPostImage");

editPostImageInput.addEventListener("change", (event) => {
    document.getElementById("editPostButton").setAttribute("disabled", true);
    document.getElementById("editUploadPost").innerHTML = "";
    document.getElementById("editUploadPost").innerHTML = `
        <div class="progress">
            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    `;

    // Set time out for progress bar 2
    setTimeout(() => {
        document.getElementById("editUploadPost").innerHTML = "";
        document.getElementById("editUploadPost").innerHTML = `
            <div class="progress">
                <div class="progress-bar progressBar-2" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
    }, 700);

    // Set time out for progress bar 3
    setTimeout(() => {
        document.getElementById("editUploadPost").innerHTML = "";
        document.getElementById("editUploadPost").innerHTML = `
            <div class="progress">
                <div class="progress-bar progressBar-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
    }, 900);

    // Set time out for progress bar 4
    setTimeout(() => {
        document.getElementById("editUploadPost").innerHTML = "";
        document.getElementById("editUploadPost").innerHTML = `
            <div class="progress">
                <div class="progress-bar progressBar-4" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
    }, 1100);

    // Upload image...
    editUploadToFileIOAPI(event.target.files[0]);
});

const editUploadToFileIOAPI = (image) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    formData.append("file", image);

    xhr.open("POST", "https://file.io", true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Create a hidden input to store the image's download link from file.io API
            let hiddenInput = document.createElement("input");

            hiddenInput.setAttribute("type", "hidden");
            hiddenInput.setAttribute("id", "editHiddenImageURL");
            hiddenInput.setAttribute(
                "value",
                JSON.parse(xhr.responseText).link
            );
            document.querySelector("body").append(hiddenInput);

            // Set message and enable post button
            document.getElementById("editUploadPost").innerHTML = "";
            document.getElementById("editUploadPost").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-5" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
            setTimeout(() => {
                document.getElementById("editUploadPost").innerHTML = "";
            }, 500);
            document
                .getElementById("editPostButton")
                .removeAttribute("disabled");
        }
    };
    xhr.send(formData);
};

// Default display none for Youtube URL input
document.getElementById("youtubeURLInput").style.visibility = "hidden";

// Default display none for edit Youtube URL input
document.getElementById("editYoutubeURLInput").style.visibility = "hidden";

// Display type of Youtube URL input field when clicked on Youtube icon of post
document
    .getElementById("youtubeURLInputButton")
    .addEventListener("click", (event) => {
        if (event.target.classList.contains("removeYoutubeURLInput")) {
            document.getElementById("youtubeURLInput").style.visibility =
                "hidden";
            document
                .getElementById("youtubeURLInputButton")
                .classList.remove("removeYoutubeURLInput");
        } else {
            document.getElementById("youtubeURLInput").style.visibility =
                "visible";
            document
                .getElementById("youtubeURLInputButton")
                .classList.add("removeYoutubeURLInput");
            document.getElementById("video").focus();
        }
    });

// Display type of Youtube URL input field when clicked on Youtube icon of edit post
document
    .getElementById("editYoutubeURLInputButton")
    .addEventListener("click", (event) => {
        if (event.target.classList.contains("editRemoveYoutubeURLInput")) {
            document.getElementById("editYoutubeURLInput").style.visibility =
                "hidden";
            document
                .getElementById("editYoutubeURLInputButton")
                .classList.remove("editRemoveYoutubeURLInput");
        } else {
            document.getElementById("editYoutubeURLInput").style.visibility =
                "visible";
            document
                .getElementById("editYoutubeURLInputButton")
                .classList.add("editRemoveYoutubeURLInput");
            document.getElementById("editPostVideo").focus();
        }
    });

// Post image review handler
function postImageReviewHandler(image) {
    if (image.files && image.files[0]) {
        let imageReader = new FileReader();

        imageReader.onload = (event) => {
            $("#postImageReview").attr("src", event.target.result);
            $("#postImageReview").attr("class", "mr-3");
            $("#postImageName").html(image.files[0].name);
        };
        imageReader.readAsDataURL(image.files[0]);
    }
}

// Edit post image review handler
function editPostImageReviewHandler(image) {
    if (image.files && image.files[0]) {
        let imageReader = new FileReader();

        imageReader.onload = (event) => {
            $("#editPostImageReview").attr("src", event.target.result);
            $("#editPostImageReview").attr("class", "mr-3");
            $("#editPostImageName").html(image.files[0].name);
        };
        imageReader.readAsDataURL(image.files[0]);
    }
}
