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
        $("#btnDefault").attr("disabled", false);
    });

    $("body").on("keyup", "#userName", (event) => {
        if (event.target.value) {
            $("#btnUpdate").attr("disabled", false);
            $("#btnDefault").attr("disabled", false);
        } else {
            $("#btnUpdate").attr("disabled", true);
        }
    });

    $("label[for='userPhone']").click(() => {
        $("#userPhone").attr("disabled", false);
        $("#btnDefault").attr("disabled", false);
    });

    $("body").on("keyup", "#userPhone", (event) => {
        if (event.target.value) {
            $("#btnUpdate").attr("disabled", false);
            $("#btnDefault").attr("disabled", false);
        } else {
            $("#btnUpdate").attr("disabled", true);
        }
    });

    $("label[for='newPassword']").click(() => {
        $("#newPassword").attr("disabled", false);
        $("#btnDefault").attr("disabled", false);
    });

    $("body").on("keyup", "#newPassword", (event) => {
        if (event.target.value) {
            $("#btnUpdate").attr("disabled", false);
            $("#btnDefault").attr("disabled", false);
        } else {
            $("#btnUpdate").attr("disabled", true);
        }
    });

    $("label[for='class']").click(() => {
        $("#class").attr("disabled", false);
        $("#btnDefault").attr("disabled", false);
    });

    $("body").on("keyup", "#class", (event) => {
        if (event.target.value) {
            $("#btnUpdate").attr("disabled", false);
            $("#btnDefault").attr("disabled", false);
        } else {
            $("#btnUpdate").attr("disabled", true);
        }
    });

    $("label[for='faculty']").click(() => {
        $("#faculty").attr("disabled", false);
        $("#btnDefault").attr("disabled", false);
    });

    $("body").on("keyup", "#faculty", (event) => {
        if (event.target.value) {
            $("#btnUpdate").attr("disabled", false);
            $("#btnDefault").attr("disabled", false);
        } else {
            $("#btnUpdate").attr("disabled", true);
        }
    });

    $("#btnDefault").click(() => {
        $("#btnUpdate").attr("disabled", true);
        $("#btnDefault").attr("disabled", true);
        $("#userName").attr("disabled", true);
        $("#userPhone").attr("disabled", true);
        $("#class").attr("disabled", true);
        $("#faculty").attr("disabled", true);
        $("#newPassword").attr("disabled", true);
        $("#newPassword").val("");
        $("#updateInfoError").html("");
        $("#hiddenNewAvatarURL").remove();

        // Send request to restore back user self information
        fetch("/dashboard/user")
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    $("#userName").val(result.data.name);
                    $("#userPhone").val(result.data.phone);
                    $("#newAvatar").val("");
                    $("#avatarInfo").attr("src", result.data.avatar);
                }
            })
            .catch((error) => console.log(error));
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

    // Display notification details modal
    $("body").on("click", ".NotifDetails", (event) => {
        let notifId = event.target.dataset.notifid;

        $("#notifDetailAttachment").addClass("d-none");
        $("#notifDetailDownload").addClass("d-none");

        fetch(`/dashboard/notification/${notifId}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    $("#notifDetailTitle").html(result.data.title);
                    $("#notifDetailContent").html(result.data.content);

                    if (result.data.attachment) {
                        $("#notifDetailAttachment").removeClass("d-none");
                        $("#notifDetailDownload").removeClass("d-none");
                        $("#notifDetailDownload").attr(
                            "href",
                            result.data.attachment
                        );
                    }

                    $("#notifDetailTypeDate").html(
                        `${result.data.type} - ${result.data.date}`
                    );
                    $("#notifDetailOwner").html(result.data.owner);
                }
            })
            .catch((error) => console.log(error));

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

    // Display post modal and focus on content field
    $("#textThinking").click(() => {
        $("#postClearImage").css("visibility", "hidden");
        $("#postModal").modal("toggle");
    });

    $("#postModal").on("shown.bs.modal", () => {
        $("#content").trigger("focus");
    });

    // Post image review and name of on change event handler
    $("body").on("change", "#postImage", (event) => {
        $("#postClearImage").css("visibility", "visible");
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
                socket.emit("Store new post", {
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
                socket.emit("Store new post", {
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
                $("#video").val("");
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
                    $("#editPostButton").attr("disabled", true);
                    $("#editPostImageReview").removeAttr("src");
                    $("#editPostImageReview").removeAttr("class");
                    $("#editPostImageName").html("Add to post");
                    $("#editPostClearImage").css("visibility", "hidden");
                    $("#editPostVideo").val("");
                    $("#errorEditPost").html("");

                    if (result.data.image) {
                        $("#editPostImageReview").attr(
                            "src",
                            result.data.image
                        );
                        $("#editPostImageReview").attr("class", "mr-3");
                        $("#editPostImageName").html(
                            result.data.image.split("/uploads/")[1]
                        );
                        $("#editPostClearImage").css("visibility", "visible");
                    }

                    if (result.data.video) {
                        $("#editPostVideo").val(
                            result.data.video.split("embed/")[0] +
                                "watch?v=" +
                                result.data.video.split("embed/")[1]
                        );
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
                        : $("#editPostImageReview").attr("src")
                        ? $("#editPostImageReview").attr("src")
                        : "No image",
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
                        video: "No video",
                        image: $("#editHiddenImageURL").val()
                            ? $("#editHiddenImageURL").val()
                            : $("#editPostImageReview").attr("src")
                            ? $("#editPostImageReview").attr("src")
                            : "No image",
                    }),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        if (result.code === 1) {
                            if (
                                result.ownerId ==
                                document.getElementById("userObjectId").value
                            ) {
                                // Display alert
                                $("#alertContainer").prepend(`
                                    <div class="alert alert-success alert-dismissible fade show ${result.alertId}" role="alert">
                                        <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                        <span>${result.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `);
                                setTimeout(() => {
                                    $(`.${result.alertId}`).alert("close");
                                }, 4000);

                                if (result.imageURL) {
                                    // Send emitting message to render back the edit post image
                                    socket.emit("Update edit post image", {
                                        postUniqueId,
                                        imageURL: result.imageURL,
                                    });

                                    // Remove old edit hidden image URL input
                                    $("#editHiddenImageURL").remove();
                                }
                            }
                        } else if (result.code === 0) {
                            if (
                                result.ownerId ==
                                document.getElementById("userObjectId").value
                            ) {
                                // Display alert
                                $("#alertContainer").prepend(`
                                    <div class="alert alert-danger alert-dismissible fade show ${result.alertId}" role="alert">
                                        <span>${result.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `);
                                setTimeout(() => {
                                    $(`.${result.alertId}`).alert("close");
                                }, 4000);

                                // Restore back the image
                                $(`#${postUniqueId} .post-image`).attr(
                                    "src",
                                    result.image
                                );
                            }
                        }
                    })
                    .catch((error) => console.log(error));

                // Clear old and close modal
                content.val("");
                $("#editPostImageReview").removeAttr("src");
                $("#editPostImageReview").removeAttr("class");
                $("#editPostImageName").html("Add to post");
                $("#editPostClearImage").css("visibility", "hidden");
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
                        : $("#editPostImageReview").attr("src")
                        ? $("#editPostImageReview").attr("src")
                        : "No image",
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
                        image: $("#editHiddenImageURL").val()
                            ? $("#editHiddenImageURL").val()
                            : $("#editPostImageReview").attr("src")
                            ? $("#editPostImageReview").attr("src")
                            : "No image",
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
                                // Display alert
                                $("#alertContainer").prepend(`
                                    <div class="alert alert-success alert-dismissible fade show ${result.alertId}" role="alert">
                                        <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                        <span>${result.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `);
                                setTimeout(() => {
                                    $(`.${result.alertId}`).alert("close");
                                }, 4000);

                                if (result.imageURL) {
                                    // Send emitting message to render back the edit post image
                                    socket.emit("Update edit post image", {
                                        postUniqueId,
                                        imageURL: result.imageURL,
                                    });

                                    // Remove old edit hidden image URL input
                                    $("#editHiddenImageURL").remove();
                                }
                            }
                        } else if (result.code === 0) {
                            if (
                                result.ownerId ==
                                document.getElementById("userObjectId").value
                            ) {
                                // Display alert
                                $("#alertContainer").prepend(`
                                    <div class="alert alert-danger alert-dismissible fade show ${result.alertId}" role="alert">
                                        <span>${result.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `);
                                setTimeout(() => {
                                    $(`.${result.alertId}`).alert("close");
                                }, 4000);

                                // Restore back the image
                                $(`#${postUniqueId} .post-image`).attr(
                                    "src",
                                    result.image
                                );
                            }
                        }
                    })
                    .catch((error) => console.log(error));

                // Clear old and close modal
                content.val("");
                $("#editPostVideo").css("visibility", "hidden");
                $("#editPostImageReview").removeAttr("src");
                $("#editPostImageReview").removeAttr("class");
                $("#editPostImageName").html("Add to post");
                $("#editPostClearImage").css("visibility", "hidden");
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
                        // Display alert
                        $("#alertContainer").prepend(`
                            <div class="alert alert-success alert-dismissible fade show ${result.alertId}" role="alert">
                                <i class="fas fa-bell h5 mr-2 text-warning"></i>
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

    // Post lazy loading on scrolling handler
    let minPost = 10;
    let maxPost = 20;

    $("#postArea .dashboard__contentCommunication").slice(10).hide(); // Get the first 10 posts to display and hide the rest of posts
    $(".dashboard__content").on("scroll", function (event) {
        let element = event.target;

        // Check if user has scrolled to the bottom of each 10 posts
        if (element.scrollTop >= element.scrollHeight - element.offsetHeight) {
            $(
                `#postArea .dashboard__contentCommunication:nth-child(${minPost})`
            ).after(`
                <div class='mt-5 mb-5 post-loading-container'>
                    <div class='post-loading'></div>
                </div>
            `);
            setTimeout(() => {
                $(`#postArea .post-loading-container`).remove();
            }, 1500);

            $("#postArea .dashboard__contentCommunication")
                .slice(minPost, maxPost)
                .fadeIn(3000);

            minPost += 10;
            maxPost += 10;
        }
    });

    // Display edit comment modal
    $("body").on("click", ".editComment", (event) => {
        let commentUniqueId = event.target.dataset.commentuniqueid;
        let postUniqueId = event.target.dataset.postuniqueid;

        event.preventDefault();

        $("#editCommentContent").val("");
        $("#editCommentButton").attr("disabled", true);
        $("#editCommentButton").attr("data-commentUniqueId", commentUniqueId);
        $("#editCommentButton").attr("data-postUniqueId", postUniqueId);

        fetch(`/dashboard/post/comment/${postUniqueId}/${commentUniqueId}`)
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    $("#editCommentContent").val(result.data.guestComment);
                }
            })
            .catch((error) => console.log(error));

        $("#editCommentModal").modal("toggle");
    });

    // Edit comment content input on key up event handler
    $("body").on("keyup", "#editCommentContent", (event) => {
        if (event.target.value) {
            $("#editCommentButton").attr("disabled", false);
        } else {
            $("#editCommentButton").attr("disabled", true);
        }
    });

    // Edit comment handler
    $("body").on("click", "#editCommentButton", (event) => {
        let commentUniqueId = event.target.dataset.commentuniqueid;
        let postUniqueId = event.target.dataset.postuniqueid;
        let editCommentContent = $("#editCommentContent");
        let timestamp =
            "Modified - " +
            new Date().toLocaleDateString() +
            ", " +
            new Date().toLocaleTimeString();

        event.preventDefault();

        if (editCommentContent.val()) {
            $("#errorEditComment").html("");

            // Emitting an message to announce server to edit comment
            socket.emit("Update comment", {
                commentUniqueId,
                guestComment: editCommentContent.val(),
                commentTimeStamp: timestamp,
            });

            // Send request to store edit comment content in db
            fetch(`/dashboard/post/comment/edit`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify({
                    postUniqueId,
                    commentUniqueId,
                    guestComment: editCommentContent.val(),
                    commentTimeStamp: timestamp,
                }),
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.code === 1) {
                        if (
                            result.guestId ==
                            document.getElementById("userObjectId").value
                        ) {
                            // Display alert
                            $("#alertContainer").prepend(`
                                <div class="alert alert-success alert-dismissible fade show ${result.alertId}" role="alert">
                                    <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                    <span>${result.message}</span>                                                                   
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            `);
                            setTimeout(() => {
                                $(`.${result.alertId}`).alert("close");
                            }, 4000);

                            $("#editCommentModal").modal("hide");
                        }
                    }
                })
                .catch((error) => console.log(error));
        } else {
            $("#errorEditComment").html("Comment can not be empty!");
        }
    });

    // Display delete comment modal
    $("body").on("click", ".deleteComment", (event) => {
        let postUniqueId = event.target.dataset.postuniqueid;
        let commentUniqueId = event.target.dataset.commentuniqueid;

        event.preventDefault();

        $("#deleteCommentButton").attr("data-postUniqueId", postUniqueId);
        $("#deleteCommentButton").attr("data-commentUniqueId", commentUniqueId);

        $("#deleteCommentModal").modal("toggle");
    });

    // Delete comment handler
    $("body").on("click", "#deleteCommentButton", (event) => {
        let postUniqueId = event.target.dataset.postuniqueid;
        let commentUniqueId = event.target.dataset.commentuniqueid;

        event.preventDefault();

        fetch(
            `/dashboard/post/comment/delete/${postUniqueId}/${commentUniqueId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "DELETE",
            }
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    if (
                        result.guestId ==
                        document.getElementById("userObjectId").value
                    ) {
                        // Display alert
                        $("#alertContainer").prepend(`
                            <div class="alert alert-success alert-dismissible fade show ${result.alertId}" role="alert">
                                <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                <span>${result.message}</span>                                                                   
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        `);
                        setTimeout(() => {
                            $(`.${result.alertId}`).alert("close");
                        }, 4000);

                        $("#deleteCommentModal").modal("hide");

                        // Emitting an message to announce server to delete comment
                        socket.emit("Delete comment", commentUniqueId);
                    }
                }
            })
            .catch((error) => console.log(error));
    });

    // Add new notification handler
    $("body").on("click", "#addNewNotification", (event) => {
        event.preventDefault();

        $("#notificationMessage").attr("class", "mb-0 mr-3");
        $("#notificationMessage").html("Processing...");

        fetch("/dashboard/notification", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                notificationTitle: $("#notificationTitle").val(),
                notificationContent: $("#notificationContent").val(),
                notificationAttachment: $("#hiddenAttachmentURL").val(),
                notificationDate: new Date().toDateString(),
                notificationType: $("#notificationType").val(),
            }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    $("#notificationMessage").attr(
                        "class",
                        "text-success mb-0 mr-3"
                    );
                    $("#notificationMessage").html(
                        "Create notification successful"
                    );

                    socket.emit("Notification alert", {
                        message: result.message,
                        alertId: result.alertId,
                        ownerId: result.ownerId,
                    });

                    setTimeout(() => {
                        window.location.href = "/dashboard/notification";
                    }, 1500);
                } else if (result.code === 0) {
                    $("#notificationMessage").attr(
                        "class",
                        "text-danger mb-0 mr-3"
                    );
                    $("#notificationMessage").html(result.message);
                }
            })
            .catch((error) => console.log(error));
    });

    // Notification list filter and pagination handler
    $("body").on("change", "#notifs", (event) => {
        fetch(`/dashboard/notification/pagination/${1}/${event.target.value}`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1) {
                    $("#notificationList").html("");

                    // Render new notification list
                    for (let notification of result.data) {
                        $("#notificationList").append(`
                            <tr class="NotifDetails" data-notifId=${
                                notification._id
                            }>
                                <td data-notifId=${notification._id}>
                                    <p title="${
                                        "[" +
                                        notification.type +
                                        "]" +
                                        " - " +
                                        notification.date
                                    }" class="font-italic text-secondary" data-notifId=${
                            notification._id
                        }>
                                        [${notification.type}] - ${
                            notification.date
                        }
                                    </p>
                                    <p class="mb-0 text-primary" data-notifId=${
                                        notification._id
                                    } title=${notification.title}>${
                            notification.title
                        }</p>
                                </td>
                            </tr>
                        `);
                    }

                    // Render new announce the current viewing page of total
                    if (
                        result.totalNotifPages &&
                        result.totalNotifPages === 1
                    ) {
                        $("#innerPagination").html("");
                        $("#innerPagination").append(`
                            <li class="page-item text-light active" data-page="1">
                                <a class="page-link" type="button" data-page="1">1</a>
                            </li>
                        `);
                        $("#currentViewingPage").html("Page 1");
                    } else if (
                        result.totalNotifPages &&
                        result.totalNotifPages > 1
                    ) {
                        let index = 1;
                        let pageNumberElement = "";

                        while (index <= result.totalNotifPages) {
                            if (index === 1) {
                                pageNumberElement += `
                                    <li class="page-item active text-light" data-page=${index}>
                                        <a class="page-link" type="button" data-page=${index}>${index}</a>
                                    </li>
                                `;
                            } else {
                                pageNumberElement += `
                                    <li class="page-item text-primary" data-page=${index}>
                                        <a class="page-link" type="button" data-page=${index}>${index}</a>
                                    </li>
                                `;
                            }

                            index++;
                        }

                        $("#innerPagination").html("");
                        $("#innerPagination").append(`
                            ${pageNumberElement}
                        `);
                        $("#currentViewingPage").html(
                            `Page 1 of ${result.totalNotifPages}`
                        );
                    } else if (result.totalNotifPages === 0) {
                        $("#innerPagination").html("");
                        $("#currentViewingPage").html("");
                    }
                }
            })
            .catch((error) => console.log(error));
    });

    // Notification list switching page handler
    $("body").on("click", ".page-item", (event) => {
        let page = event.target.dataset.page;
        let name = $("#notifs").val();

        fetch(`/dashboard/notification/pagination/${page}/${name}`, {
            method: "POST",
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 1 && result.data.length > 0) {
                    $("#notificationList").html("");

                    // Render new notification list
                    for (let notification of result.data) {
                        $("#notificationList").append(`
                            <tr class="NotifDetails" data-notifId=${
                                notification._id
                            }>
                                <td data-notifId=${notification._id}>
                                    <p title="${
                                        "[" +
                                        notification.type +
                                        "]" +
                                        " - " +
                                        notification.date
                                    }" class="font-italic text-secondary" data-notifId=${
                            notification._id
                        }>
                                        [${notification.type}] - ${
                            notification.date
                        }
                                    </p>
                                    <p class="mb-0 text-primary" data-notifId=${
                                        notification._id
                                    } title=${notification.title}>${
                            notification.title
                        }</p>
                                </td>
                            </tr>
                        `);
                    }

                    // Update active style of page button
                    $(`.page-item[data-page=${page}]`)
                        .removeClass("text-primary")
                        .addClass("active")
                        .addClass("text-light")
                        .siblings()
                        .removeClass("active")
                        .removeClass("text-light")
                        .addClass("text-primary");

                    // Update viewing page
                    if (result.totalNotifPages > 1) {
                        $("#currentViewingPage").html(
                            `Page ${page} of ${result.totalNotifPages}`
                        );
                    } else {
                        $("#currentViewingPage").html("Page 1");
                    }
                }
            })
            .catch((error) => console.log(error));
    });

    // Pagination navigator handler for notification list
    $("body").on("click", ".page-item[data-page='previous']", (event) => {
        $("#innerPagination").animate(
            {
                opacity: 0.8,
                scrollLeft: "-=80",
            },
            400
        );
    });

    $("body").on("click", ".page-item[data-page='next']", (event) => {
        $("#innerPagination").animate(
            {
                opacity: 0.8,
                scrollLeft: "+=80",
            },
            400
        );
    });

    // Focus effect on user sidebar avatar and name in self wall
    if ($("#userWallId").val() == $("#userObjectId").val()) {
        $("img[alt='user sidebar avatar']").css(
            "box-shadow",
            "0 0 0 5px rgba(104, 104, 230, 0.06)"
        );
        $("img[alt='user sidebar avatar']").css(
            "border",
            "3px solid rgba(128, 189, 255, 0.4)"
        );
    }

    // Client listen to the storing message from server to fetch new post
    socket.on("Fetching new post", (post, postUniqueId) => {
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
                    // Send emitting message to render new post
                    socket.emit("Add new post", {
                        ownerId: post.ownerId,
                        postUniqueId,
                        profileAvatar: post.profileAvatar,
                        name: post.name,
                        timestamp: post.timestamp,
                        content: post.content,
                        video: post.video,
                        image: post.image,
                        successAlert: {
                            alertId: result.alertId,
                            message: result.message,
                        },
                    });

                    if (result.imageURL) {
                        // Send emitting message to render back the post image
                        socket.emit("Update post image", {
                            postUniqueId,
                            imageURL: result.imageURL,
                        });

                        // Remove old post hidden image URL input
                        $("#hiddenImageURL").remove();
                    }
                } else if (result.code === 0) {
                    // Send emitting message to announce error post
                    socket.emit("Add new post", {
                        ownerId: post.ownerId,
                        postUniqueId,
                        profileAvatar: post.profileAvatar,
                        name: post.name,
                        timestamp: post.timestamp,
                        content: post.content,
                        video: post.video,
                        image: post.image,
                        errorAlert: {
                            alertId: result.alertId,
                            message: result.message,
                        },
                    });

                    // Remove the loading post
                    $(`#${postUniqueId}`).remove();
                }
            })
            .catch((error) => console.error(error));
    });

    // Client listen to the rendering message from server to render new post
    socket.on("Rendering new post", (post) => {
        // Render the post
        if (post.ownerId == document.getElementById("userObjectId").value) {
            $("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 pb-1 px-3 pt-3 bg-white col-md-12" id=${
                    post.postUniqueId
                }>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <a href="/dashboard/wall/${
                                post.ownerId
                            }" class="text-dark">
                                <img src=${
                                    post.profileAvatar
                                } alt="user avatar" width="45" height="45"/>
                            </a>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <a href="/dashboard/wall/${
                                        post.ownerId
                                    }" class="text-dark">
                                        <strong>${post.name}</strong>
                                    </a>
                                    <p class="mb-0">
                                        <small class="text-secondary timestamp-post">${
                                            post.timestamp
                                        }</small>
                                    </p>
                                </div>
                                <div class="dropdown show">
                                    <a class="btn btn-link text-dark dropdown-toggle" role="button" id="postHandlerDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </a>
                                    
                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="postHandlerDropdown">
                                        <button class="dropdown-item btn btn-link editPost" data-postUniqueId=${
                                            post.postUniqueId
                                        }>Edit</button>
                                        <button class="dropdown-item btn btn-link deletePost" data-postUniqueId=${
                                            post.postUniqueId
                                        }>Delete</button>
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
                                <label class="mb-0 d-flex align-items-center justify-content-center" for="commentInput-${
                                    post.postUniqueId
                                }">
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
                        <div class="dashboard__contentCommunicationComment" id="comment-${
                            post.postUniqueId
                        }">
                            <div id="commentSection" data-postUniqueId=${
                                post.postUniqueId
                            }></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 input-group commentInputStyles">
                                <input type="text" placeholder="Write your comment..." id="commentInput-${
                                    post.postUniqueId
                                }" class="form-control commentInput" data-inputComment=${
                post.postUniqueId
            } onkeypress="emitComment(event)" />
                                <div class="input-group-append">
                                    <button class="btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${
                                        post.postUniqueId
                                    }>
                                        <i class="fas fa-paper-plane" data-postUniqueId=${
                                            post.postUniqueId
                                        }></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            if (post.successAlert) {
                // Display success alert
                $("#alertContainer").prepend(`
                    <div class="alert alert-success alert-dismissible fade show ${post.successAlert.alertId}" role="alert">
                        <i class="fas fa-bell h5 mr-2 text-warning"></i>
                        <span>${post.successAlert.message}</span>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);
                setTimeout(() => {
                    $(`.${post.successAlert.alertId}`).alert("close");
                }, 4000);
            } else if (post.errorAlert) {
                // Display success alert
                $("#alertContainer").prepend(`
                    <div class="alert alert-success alert-dismissible fade show ${post.errorAlert.alertId}" role="alert">
                        <i class="fas fa-bell h5 mr-2 text-warning"></i>
                        <span>${post.errorAlert.message}</span>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);
                setTimeout(() => {
                    $(`.${post.errorAlert.alertId}`).alert("close");
                }, 4000);
            }
        } else {
            $("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 pb-1 px-3 pt-3 bg-white col-md-12" id=${
                    post.postUniqueId
                }>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <a href="/dashboard/wall/${
                                post.ownerId
                            }" class="text-dark">
                                <img src=${
                                    post.profileAvatar
                                } alt="user avatar" width="45" height="45"/>
                            </a>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <a href="/dashboard/wall/${
                                        post.ownerId
                                    }" class="text-dark">
                                        <strong>${post.name}</strong>
                                    </a>
                                    <p class="mb-0">
                                        <small class="text-secondary timestamp-post">${
                                            post.timestamp
                                        }</small>
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
                                <label class="mb-0 d-flex align-items-center justify-content-center" for="commentInput-${
                                    post.postUniqueId
                                }">
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
                        <div class="dashboard__contentCommunicationComment" id="comment-${
                            post.postUniqueId
                        }">
                            <div id="commentSection" data-postUniqueId=${
                                post.postUniqueId
                            }></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 input-group commentInputStyles">
                                <input type="text" placeholder="Write your comment..." id="commentInput-${
                                    post.postUniqueId
                                }" class="form-control commentInput" data-inputComment=${
                post.postUniqueId
            } onkeypress="emitComment(event)" />
                                <div class="input-group-append">
                                    <button class="btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${
                                        post.postUniqueId
                                    }>
                                        <i class="fas fa-paper-plane" data-postUniqueId=${
                                            post.postUniqueId
                                        }></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
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
                    updatePost.image &&
                    updatePost.image !== "No image" &&
                    updatePost.video
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
                        : (!updatePost.image ||
                              updatePost.image === "No image") &&
                          updatePost.video
                        ? `
                        <div class="row">
                            <div class="px-0 col-md-12 embed-responsive embed-responsive-16by9">
                                <iframe class="embed-responsive-item" src=${updatePost.video} allowfullscreen></iframe>
                            </div>
                        </div>
                    `
                        : updatePost.image &&
                          updatePost.image !== "No image" &&
                          !updatePost.video
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
        } else if (updatePost.image === "No image" && !updatePost.video) {
            $(`#${updatePost.postUniqueId} #imageAndVideoContainer`).html("");
            $(`#${updatePost.postUniqueId} .timestamp-post`).html(
                updatePost.timestamp
            );
            $(`#${updatePost.postUniqueId} .post-content`).html(
                updatePost.content
            );
        } else if (!updatePost.video && !updatePost.image) {
            $(`#${updatePost.postUniqueId} #imageAndVideoContainer`).html("");
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

    // Client listen to the rendering message from server to render back post's image
    socket.on("Rendering post image", (updatePostImage) => {
        // Render back the post image
        $(`#${updatePostImage.postUniqueId} .post-image`).attr(
            "src",
            updatePostImage.imageURL
        );
    });

    // Client listen to the rendering message from server to render back edit post's image
    socket.on("Rendering edit post image", (updateEditPostImage) => {
        // Render back the edit post image
        $(`#${updateEditPostImage.postUniqueId} .post-image`).attr(
            "src",
            updateEditPostImage.imageURL
        );
    });

    // Client listen to the storing message from server to fetch new comment
    socket.on("Fetching new comment", (comment, commentUniqueId) => {
        // Send emitting message to render new post
        socket.emit("Add new comment", {
            guestId: comment.guestId,
            postUniqueId: comment.postUniqueId,
            commentUniqueId,
            guestAvatar: comment.guestAvatar,
            guestName: comment.guestName,
            guestComment: comment.guestComment,
            commentTimeStamp: comment.commentTimeStamp,
        });

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

    // Client listen to the rendering message from server to render new comment
    socket.on("Rendering new comment", (comment) => {
        if (comment.guestId == document.getElementById("userObjectId").value) {
            $("div[data-postUniqueId=" + comment.postUniqueId + "]").append(`
                <div class="form-group row" id=${comment.commentUniqueId}>
                    <div class="col-md-1 col-sm-2 col-3">
                        <a href="/dashboard/wall/${comment.guestId}" class="text-dark">
                            <img class="comment-ProfilePic" src=${comment.guestAvatar} alt="user avatar" width="40" height="40"/>
                        </a>
                    </div>
                    <div class="col-md-11 col-sm-9 col-8">
                        <div class="commentContainerStyles d-flex align-items-center">
                            <div class="py-1 px-2">
                                <a href="/dashboard/wall/${comment.guestId}" class="text-dark">
                                    <strong>${comment.guestName}</strong>
                                </a>
                                <p class="mb-0">${comment.guestComment}</p>
                            </div>
                            <div class="dropdown show commentHandler">
                                <a class="btn btn-link text-dark bg-white dropdown-toggle" role="button" id="commentHandlerDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-h"></i>                                
                                </a>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="commentHandlerDropdown">
                                    <button class="dropdown-item btn btn-link editComment" data-postUniqueId=${comment.postUniqueId} data-commentUniqueId=${comment.commentUniqueId}>Edit</button>
                                    <button class="dropdown-item btn btn-link deleteComment" data-postUniqueId=${comment.postUniqueId} data-commentUniqueId=${comment.commentUniqueId}>Delete</button>
                                </div>
                            </div>
                        </div>
                        <small class="ml-2 text-secondary">${comment.commentTimeStamp}</small>
                    </div>
                </div>
            `);
        } else {
            $("div[data-postUniqueId=" + comment.postUniqueId + "]").append(`
                <div class="form-group row" id=${comment.commentUniqueId}>
                    <div class="col-md-1 col-sm-2 col-3">
                        <a href="/dashboard/wall/${comment.guestId}" class="text-dark">
                            <img class="comment-ProfilePic" src=${comment.guestAvatar} alt="user avatar" width="40" height="40"/>
                        </a>
                    </div>
                    <div class="col-md-11 col-sm-9 col-8">
                        <div class="commentContainerStyles d-flex align-items-center">
                            <div class="py-1 px-2">
                                <a href="/dashboard/wall/${comment.guestId}" class="text-dark">
                                    <strong>${comment.guestName}</strong>
                                </a>
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
    });

    // Client listen to the rendering message from server to render update comment
    socket.on("Rendering update comment", (updateComment) => {
        $(`#${updateComment.commentUniqueId} p`).html(
            updateComment.guestComment
        );
        $(`#${updateComment.commentUniqueId} small`).html(
            updateComment.commentTimeStamp
        );
    });

    // Client listen to the deleting message from server to delete comment
    socket.on("Deleting comment", (commentUniqueId) => {
        $(`#${commentUniqueId}`).remove();
    });

    // Client listen to the deleting message from server to delete comment
    socket.on("Displaying notification alert", (notification) => {
        if (
            notification.ownerId !=
            document.getElementById("userObjectId").value
        ) {
            // Display alert
            $("#alertContainer").prepend(`
                <div class="alert alert-warning alert-dismissible fade show ${notification.alertId}" role="alert">
                    <i class="fas fa-bell h5 mr-2 text-warning"></i>
                    <span>${notification.message}</span>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);
            setTimeout(() => {
                $(`.${notification.alertId}`).alert("close");
            }, 4000);
        }
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

// Edit info form handler
if (document.getElementById("btnUpdate")) {
    document.getElementById("btnUpdate").addEventListener("click", (event) => {
        event.preventDefault();

        let userName = document.getElementById("userName");
        let userPhone = document.getElementById("userPhone");
        let newPassword = document.getElementById("newPassword");
        let studentClass = document.getElementById("class");
        let studentFaculty = document.getElementById("faculty");
        let hiddenNewAvatarURL = document.getElementById("hiddenNewAvatarURL");
        let btnUpdate = document.getElementById("btnUpdate");
        let btnDefault = document.getElementById("btnDefault");
        let messageError = document.getElementById("updateInfoError");
        let messageSuccess = document.getElementById("updateInfoSuccess");

        fetch("/dashboard/info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hiddenNewAvatarURL: hiddenNewAvatarURL
                    ? hiddenNewAvatarURL.value
                    : "",
                userName: userName ? userName.value : "",
                userPhone: userPhone ? userPhone.value : "",
                newPassword: newPassword ? newPassword.value : "",
                studentClass: studentClass ? studentClass.value : "",
                studentFaculty: studentFaculty ? studentFaculty.value : "",
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.code === 1) {
                    messageError.innerHTML = "";
                    messageSuccess.innerHTML = result.message;
                    userName.setAttribute("disabled", "disabled");
                    userPhone.setAttribute("disabled", "disabled");
                    btnUpdate.setAttribute("disabled", "disabled");
                    btnDefault.setAttribute("disabled", "disabled");

                    if (newPassword) {
                        newPassword.setAttribute("disabled", "disabled");
                    }

                    if (studentClass) {
                        studentClass.setAttribute("disabled", "disabled");
                    }

                    if (studentFaculty) {
                        studentFaculty.setAttribute("disabled", "disabled");
                    }

                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 1500);
                } else if (result.code === 0) {
                    messageSuccess.innerHTML = "";
                    messageError.innerHTML = result.message;
                } else {
                    messageError.innerHTML = "";
                }
            })
            .catch((error) => console.error(error));
    });
}

// Upload edit info form avatar to file.io API when choosing image handler
let newAvatarInput = document.getElementById("newAvatar");

if (newAvatarInput) {
    newAvatarInput.addEventListener("change", (event) => {
        if (document.getElementById("hiddenNewAvatarURL")) {
            document.getElementById("hiddenNewAvatarURL").remove();
        }

        document.getElementById("btnUpdate").setAttribute("disabled", true);
        document.getElementById("btnDefault").setAttribute("disabled", true);
        document.getElementById("uploadNewAvatar").innerHTML = "";
        document.getElementById("uploadNewAvatar").innerHTML = `
            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;

        // Set time out for progress bar 2
        setTimeout(() => {
            document.getElementById("uploadNewAvatar").innerHTML = "";
            document.getElementById("uploadNewAvatar").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-2" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
        }, 700);

        // Set time out for progress bar 3
        setTimeout(() => {
            document.getElementById("uploadNewAvatar").innerHTML = "";
            document.getElementById("uploadNewAvatar").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
        }, 900);

        // Set time out for progress bar 4
        setTimeout(() => {
            document.getElementById("uploadNewAvatar").innerHTML = "";
            document.getElementById("uploadNewAvatar").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-4" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
        }, 1100);

        // Upload new avatar...
        uploadNewAvatarToFileIOAPI(event.target.files[0]);
    });
}

const uploadNewAvatarToFileIOAPI = (avatar) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    formData.append("file", avatar);

    xhr.open("POST", "https://file.io", true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Create a hidden input to store the new avatar's download link from file.io API
            let hiddenInput = document.createElement("input");

            hiddenInput.setAttribute("type", "hidden");
            hiddenInput.setAttribute("id", "hiddenNewAvatarURL");
            hiddenInput.setAttribute(
                "value",
                JSON.parse(xhr.responseText).link
            );
            document.querySelector("body").append(hiddenInput);

            // Set progress bar and enable post button
            document.getElementById("uploadNewAvatar").innerHTML = "";
            document.getElementById("uploadNewAvatar").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-5" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
            setTimeout(() => {
                document.getElementById("uploadNewAvatar").innerHTML = "";
            }, 500);
            document.getElementById("btnUpdate").removeAttribute("disabled");
            document.getElementById("btnDefault").removeAttribute("disabled");
        }
    };
    xhr.send(formData);
};

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
            socket.emit("Store new comment", {
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
        socket.emit("Store new comment", {
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
if (document.getElementById("modalPostButton")) {
    document.getElementById("modalPostButton").setAttribute("disabled", true);
}

// Disable edit post button
if (document.getElementById("editPostButton")) {
    document.getElementById("editPostButton").setAttribute("disabled", true);
}

// Post content and video on change handler
if (document.getElementById("content")) {
    document.getElementById("content").addEventListener("keyup", (event) => {
        if (event.target.value) {
            document
                .getElementById("modalPostButton")
                .removeAttribute("disabled");
        } else {
            document
                .getElementById("modalPostButton")
                .setAttribute("disabled", true);
        }
    });
}

if (document.getElementById("video")) {
    document.getElementById("video").addEventListener("keyup", (event) => {
        document.getElementById("modalPostButton").removeAttribute("disabled");
    });
}

// Edit post content and video on change handler
if (document.getElementById("editPostContent")) {
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
}

if (document.getElementById("editPostVideo")) {
    document
        .getElementById("editPostVideo")
        .addEventListener("keyup", (event) => {
            document
                .getElementById("editPostButton")
                .removeAttribute("disabled");
        });
}

// Upload post image to file.io API when choosing image handler
let postImageInput = document.getElementById("postImage");

if (postImageInput) {
    postImageInput.addEventListener("change", (event) => {
        document.getElementById("errorPost").innerHTML = "";
        document
            .getElementById("modalPostButton")
            .setAttribute("disabled", true);
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
}

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

if (editPostImageInput) {
    editPostImageInput.addEventListener("change", (event) => {
        document.getElementById("errorEditPost").innerHTML = "";
        document
            .getElementById("editPostButton")
            .setAttribute("disabled", true);
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
}

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
if (document.getElementById("youtubeURLInput")) {
    document.getElementById("youtubeURLInput").style.visibility = "hidden";
}

// Default display none for edit Youtube URL input
if (document.getElementById("editYoutubeURLInput")) {
    document.getElementById("editYoutubeURLInput").style.visibility = "hidden";
}

// Display type of Youtube URL input field when clicked on Youtube icon of post
if (document.getElementById("youtubeURLInputButton")) {
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
}

// Display type of Youtube URL input field when clicked on Youtube icon of edit post
if (document.getElementById("editYoutubeURLInputButton")) {
    document
        .getElementById("editYoutubeURLInputButton")
        .addEventListener("click", (event) => {
            if (event.target.classList.contains("editRemoveYoutubeURLInput")) {
                document.getElementById(
                    "editYoutubeURLInput"
                ).style.visibility = "hidden";
                document
                    .getElementById("editYoutubeURLInputButton")
                    .classList.remove("editRemoveYoutubeURLInput");
            } else {
                document.getElementById(
                    "editYoutubeURLInput"
                ).style.visibility = "visible";
                document
                    .getElementById("editYoutubeURLInputButton")
                    .classList.add("editRemoveYoutubeURLInput");
                document.getElementById("editPostVideo").focus();
            }
        });
}

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

// Clear image of post modal handler
if (document.getElementById("postClearImage")) {
    document.getElementById("postClearImage").addEventListener("click", () => {
        document.getElementById("errorPost").innerHTML = "";
        document.getElementById("postImageName").innerHTML = "";
        document.getElementById("postImageName").innerHTML = "Add to post";
        document.getElementById("postImageReview").removeAttribute("src");
        document.getElementById("postImageReview").removeAttribute("class");
        document.getElementById("postClearImage").style.visibility = "hidden";
        document.getElementById("hiddenImageURL").remove();
    });
}

// Clear image of edit post modal handler
if (document.getElementById("editPostClearImage")) {
    document.getElementById("editPostClearImage").style.visibility = "hidden";

    document
        .getElementById("editPostClearImage")
        .addEventListener("click", () => {
            document.getElementById("errorEditPost").innerHTML = "";
            document.getElementById("editPostImageName").innerHTML = "";
            document.getElementById("editPostImageName").innerHTML =
                "Add to post";
            document
                .getElementById("editPostImageReview")
                .removeAttribute("src");
            document
                .getElementById("editPostImageReview")
                .removeAttribute("class");
            document.getElementById("editPostClearImage").style.visibility =
                "hidden";
            document
                .getElementById("editPostButton")
                .removeAttribute("disabled");
        });
}

// Upload attachment to file.io API when choosing attachment handler
let attachmentInput = document.getElementById("notificationAttachment");

if (attachmentInput) {
    attachmentInput.addEventListener("change", (event) => {
        if (document.getElementById("hiddenAttachmentURL")) {
            document.getElementById("hiddenAttachmentURL").remove();
        }

        document
            .getElementById("addNewNotification")
            .setAttribute("disabled", true);
        document.getElementById("uploadAttachment").innerHTML = "";
        document.getElementById("uploadAttachment").innerHTML = `
            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;

        // Set time out for progress bar 2
        setTimeout(() => {
            document.getElementById("uploadAttachment").innerHTML = "";
            document.getElementById("uploadAttachment").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-2" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
        }, 700);

        // Set time out for progress bar 3
        setTimeout(() => {
            document.getElementById("uploadAttachment").innerHTML = "";
            document.getElementById("uploadAttachment").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
        }, 900);

        // Set time out for progress bar 4
        setTimeout(() => {
            document.getElementById("uploadAttachment").innerHTML = "";
            document.getElementById("uploadAttachment").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-4" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
        }, 1100);

        // Upload image...
        uploadAttachmentToFileIOAPI(event.target.files[0]);
    });
}

const uploadAttachmentToFileIOAPI = (attachment) => {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();

    formData.append("file", attachment);

    xhr.open("POST", "https://file.io", true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Create a hidden input to store the image's download link from file.io API
            let hiddenInput = document.createElement("input");

            hiddenInput.setAttribute("type", "hidden");
            hiddenInput.setAttribute("id", "hiddenAttachmentURL");
            hiddenInput.setAttribute(
                "value",
                JSON.parse(xhr.responseText).link
            );
            document.querySelector("body").append(hiddenInput);

            // Set message and enable post button
            document.getElementById("uploadAttachment").innerHTML = "";
            document.getElementById("uploadAttachment").innerHTML = `
                <div class="progress">
                    <div class="progress-bar progressBar-5" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
            setTimeout(() => {
                document.getElementById("uploadAttachment").innerHTML = "";
            }, 500);
            document
                .getElementById("addNewNotification")
                .removeAttribute("disabled");
        }
    };
    xhr.send(formData);
};

// Edit notification form handler
// HERE

// Edit staff management form handler
// HERE
