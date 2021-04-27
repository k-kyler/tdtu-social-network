const socket=io("/");function onGoogleSignIn(e){e=e.getAuthResponse().id_token;let t=new XMLHttpRequest;t.open("POST","/auth/login"),t.setRequestHeader("Content-Type","application/json"),t.onload=()=>{"Sign in successful with Google"===t.responseText?(onGoogleSignOut(),window.location.href="/dashboard"):"Your email is not for TDTU Student"===t.responseText&&(onGoogleSignOut(),document.getElementById("signInErrorMessage").innerHTML=t.responseText)},t.send(JSON.stringify({googleIdToken:e}))}function onGoogleSignOut(){let e=gapi.auth2.getAuthInstance();e.signOut().then(function(){console.log("Student has signed out")})}function displayAvatarHandler(t){if(t.files&&t.files[0]){let e=new FileReader;e.onload=e=>{$("#avatarInfo").attr("src",e.target.result)},e.readAsDataURL(t.files[0])}}$(document).ready(()=>{$("#logoutButton").click(()=>{$("#logoutModal").modal("toggle")}),$("#displayInfo").click(()=>{$("#infoModal").modal("toggle")}),$("#modalLogoutButton").click(()=>{fetch("/logout").then(e=>{200===e.status&&(window.location.href="/")}).catch(e=>console.error(e))}),$("#workplace").val($("#workplaceHidden").val());let e=$("#permissionHidden").val();e&&$.each(e.split("[")[1].split("]")[0].split('"').join("").split(","),(e,t)=>{$("#permission option[value='"+t+"']").prop("selected",!0)}),$("label[for='userName']").click(()=>{$("#userName").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)}),$("body").on("keyup","#userName",e=>{e.target.value?($("#btnUpdate").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)):$("#btnUpdate").attr("disabled",!0)}),$("label[for='userPhone']").click(()=>{$("#userPhone").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)}),$("body").on("keyup","#userPhone",e=>{e.target.value?($("#btnUpdate").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)):$("#btnUpdate").attr("disabled",!0)}),$("label[for='changePassword']").click(()=>{$("#oldPassword").attr("disabled",!1),$("#newPassword").attr("disabled",!1),$("#confirmPassword").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)}),$("body").on("keyup","#oldPassword",e=>{e.target.value?($("#btnUpdate").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)):$("#btnUpdate").attr("disabled",!0)}),$("body").on("keyup","#newPassword",e=>{e.target.value?($("#btnUpdate").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)):$("#btnUpdate").attr("disabled",!0)}),$("body").on("keyup","#confirmPassword",e=>{e.target.value?($("#btnUpdate").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)):$("#btnUpdate").attr("disabled",!0)}),$("label[for='class']").click(()=>{$("#class").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)}),$("body").on("keyup","#class",e=>{e.target.value?($("#btnUpdate").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)):$("#btnUpdate").attr("disabled",!0)}),$("label[for='faculty']").click(()=>{$("#faculty").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)}),$("body").on("keyup","#faculty",e=>{e.target.value?($("#btnUpdate").attr("disabled",!1),$("#btnDefault").attr("disabled",!1)):$("#btnUpdate").attr("disabled",!0)}),$("#btnDefault").click(()=>{$("#btnUpdate").attr("disabled",!0),$("#btnDefault").attr("disabled",!0),$("#userName").attr("disabled",!0),$("#userPhone").attr("disabled",!0),$("#class").attr("disabled",!0),$("#faculty").attr("disabled",!0),$("#newPassword").attr("disabled",!0),$("#newPassword").val(""),$("#oldPassword").attr("disabled",!0),$("#oldPassword").val(""),$("#confirmPassword").attr("disabled",!0),$("#confirmPassword").val(""),$("#updateInfoError").html(""),$("#hiddenNewAvatarURL").remove(),fetch("/dashboard/user").then(e=>e.json()).then(e=>{1===e.code&&($("#userName").val(e.data.name),$("#userPhone").val(e.data.phone),$("#newAvatar").val(""),$("#avatarInfo").attr("src",e.data.avatar),$("#class")&&$("#class").val(e.data.class),$("#faculty")&&$("#faculty").val(e.data.faculty))}).catch(e=>console.log(e))}),$("body").on("click",".NotifDetails",e=>{e=e.target.dataset.notifid;$("#notifDetailAttachment").addClass("d-none"),$("#notifDetailDownload").addClass("d-none"),fetch(`/dashboard/notification/${e}`).then(e=>e.json()).then(e=>{1===e.code&&($("#notifDetailTitle").html(e.data.title),$("#notifDetailContent").html(e.data.content),e.data.attachment&&($("#notifDetailAttachment").removeClass("d-none"),$("#notifDetailDownload").removeClass("d-none"),$("#notifDetailDownload").attr("href",e.data.attachment)),$("#notifDetailTypeDate").html(`${e.data.type} - ${e.data.date}`),$("#notifDetailOwner").html(e.data.owner))}).catch(e=>console.log(e)),$("#NotifDetailsModal").modal("toggle")}),$(".EditNotif").click(e=>{e=e.target.dataset.notificationid;$("#btnUpdateNotif").attr("data-notificationId",e),$("#btnUpdateNotif").attr("disabled",!0),$("#editNotificationMessage").html(""),fetch(`/dashboard/notification/${e}`).then(e=>e.json()).then(e=>{1===e.code&&($("#editTitle").val(e.data.title),$("#editContent").val(e.data.content),$("#editType").val(e.data.type),e.data.attachment?$("#deleteAttachmentRow").css("display","block"):$("#deleteAttachmentRow").css("display","none"))}).catch(e=>console.log(e)),$("#EditNotifModal").modal("toggle")}),$(".DeleteNotif").click(e=>{e=e.target.dataset.notificationid;$("#deleteNotifBtn").attr("data-notificationId",e),fetch(`/dashboard/notification/${e}`).then(e=>e.json()).then(e=>{1===e.code&&$("#deleteNotifTitle").html("Delete "+e.data.title+"?")}).catch(e=>console.log(e)),$("#deleteNotifModal").modal("toggle")}),$(".EditManagement").click(e=>{e=e.target.dataset.userid;$("#btnUpdateManagement").attr("data-userId",e),$("#btnUpdateManagement").attr("disabled",!0),$("#editPermission").val(""),$("#editManagementMessage").html(""),fetch(`/dashboard/users/${e}`).then(e=>e.json()).then(e=>{1===e.code&&($("#facultyClassRow").css("display","none"),$("#permissionRow").css("display","none"),$("#workplaceRow").css("display","none"),$("label[for='editPassword']").css("display","none"),$("#editPassword").css("display","none"),$("#editEmail").val(e.data.email),$("#editPhone").val(e.data.phone),$("#editName").val(e.data.name),"Staff"===e.data.type?($("#permissionRow").css("display","flex"),$("#workplaceRow").css("display","flex"),$("label[for='editPassword']").css("display","block"),$("#editPassword").css("display","block"),$("#editWorkplace").val(e.data.workplace),e.data.permission&&$.each(e.data.permission,(e,t)=>{$("#editPermission option[value='"+t.postName+"']").prop("selected",!0)})):"Student"===e.data.type&&($("#facultyClassRow").css("display","flex"),$("#editClass").val(e.data.class),$("#editFaculty").val(e.data.faculty)))}).catch(e=>console.log(e)),$("#EditManagementModal").modal("toggle")}),$(".DeleteManagement").click(e=>{e=e.target.dataset.userid;$("#deleteManagementBtn").attr("data-userId",e),fetch(`/dashboard/users/${e}`).then(e=>e.json()).then(e=>{1===e.code&&$("#deleteManagementTitle").html("Delete "+e.data.name+"?")}).catch(e=>console.log(e)),$("#deleteManagementModal").modal("toggle")}),$("#textThinking").click(()=>{$("#postClearImage").css("visibility","hidden"),$("#postModal").modal("toggle")}),$("#postModal").on("shown.bs.modal",()=>{$("#content").trigger("focus")}),$("body").on("change","#postImage",e=>{$("#postClearImage").css("visibility","visible")}),$("#modalPostButton").click(e=>{e.preventDefault();let t=$("#profileAvatar").attr("src"),a=$("#owner").text(),d=$("#content"),o=$("#video").val(),n=$("#userObjectId").val(),s=(new Date).toLocaleDateString()+", "+(new Date).toLocaleTimeString();o&&!o.includes("https://www.youtube.com")?$("#errorPost").html("Not youtube URL"):o?o&&o.includes("https://www.youtube.com")&&(""!==d.val()?($("#errorPost").html(""),fetch("/dashboard/post",{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({ownerId:n,profileAvatar:t,name:a,content:d.val(),timestamp:s,image:$("#hiddenImageURL").val(),video:o.split("watch?v=")[0]+"embed/"+o.split("watch?v=")[1]})}).then(e=>e.json()).then(e=>{1===e.code?(socket.emit("Add new post",{postUniqueId:e.postUniqueId,userType:e.userType,ownerId:n,profileAvatar:t,name:a,content:d.val(),timestamp:s,image:$("#hiddenImageURL").val(),video:o.split("watch?v=")[0]+"embed/"+o.split("watch?v=")[1],successAlert:{alertId:e.alertId,message:e.message}}),d.val(""),e.imageURL&&(socket.emit("Update post image",{postUniqueId:e.postUniqueId,imageURL:e.imageURL}),$("#hiddenImageURL").remove())):0===e.code&&e.ownerId==document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                                    <div class="alert alert-success alert-dismissible fade show ${post.errorAlert.alertId}" role="alert">
                                        <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                        <span>${post.errorAlert.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `),setTimeout(()=>{$(`.${post.errorAlert.alertId}`).alert("close")},4e3))}).catch(e=>console.error(e)),$("#video").val(""),$("#postImageReview").removeAttr("src"),$("#postImageReview").removeAttr("class"),$("#postImageName").html("Add to post"),$("#postImage").val(""),$("#postModal").modal("hide")):$("#errorPost").html("Missing content")):""!==d.val()?($("#errorPost").html(""),fetch("/dashboard/post",{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({ownerId:n,profileAvatar:t,name:a,content:d.val(),timestamp:s,image:$("#hiddenImageURL").val()})}).then(e=>e.json()).then(e=>{1===e.code?(socket.emit("Add new post",{postUniqueId:e.postUniqueId,userType:e.userType,ownerId:n,profileAvatar:t,name:a,content:d.val(),timestamp:s,image:$("#hiddenImageURL").val(),successAlert:{alertId:e.alertId,message:e.message}}),d.val(""),e.imageURL&&(socket.emit("Update post image",{postUniqueId:e.postUniqueId,imageURL:e.imageURL}),$("#hiddenImageURL").remove())):0===e.code&&e.ownerId==document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                                    <div class="alert alert-success alert-dismissible fade show ${post.errorAlert.alertId}" role="alert">
                                        <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                        <span>${post.errorAlert.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `),setTimeout(()=>{$(`.${post.errorAlert.alertId}`).alert("close")},4e3))}).catch(e=>console.error(e)),$("#postImageReview").removeAttr("src"),$("#postImageReview").removeAttr("class"),$("#postImageName").html("Add to post"),$("#postImage").val(""),$("#postModal").modal("hide")):$("#errorPost").html("Missing content")}),$("body").on("click",".editPost",e=>{var t=e.target.dataset.postuniqueid;e.preventDefault(),$("#editPostButton").attr("data-postUniqueId",t),fetch(`/dashboard/post/${t}`).then(e=>e.json()).then(e=>{1===e.code&&($("#editPostContent").val(e.data.content),$("#editPostButton").attr("disabled",!0),$("#editPostImageReview").removeAttr("src"),$("#editPostImageReview").removeAttr("class"),$("#editPostImageName").html("Add to post"),$("#editPostClearImage").css("visibility","hidden"),$("#editPostVideo").val(""),$("#errorEditPost").html(""),e.data.image&&($("#editPostImageReview").attr("src",e.data.image),$("#editPostImageReview").attr("class","mr-3"),$("#editPostImageName").html(e.data.image.split("/uploads/")[1]),$("#editPostClearImage").css("visibility","visible")),e.data.video&&$("#editPostVideo").val(e.data.video.split("embed/")[0]+"watch?v="+e.data.video.split("embed/")[1]))}).catch(e=>console.log(e)),$("#editPostModal").modal("toggle")}),$("body").on("click","#editPostButton",e=>{let t=e.target.dataset.postuniqueid;var a="Modified - "+(new Date).toLocaleDateString()+", "+(new Date).toLocaleTimeString();let d=$("#editPostVideo").val(),o=$("#editPostContent");e.preventDefault(),d&&!d.includes("https://www.youtube.com")?$("#errorEditPost").html("Not youtube URL"):d?d&&d.includes("https://www.youtube.com")&&(""!==o.val()?($("#errorEditPost").html(""),socket.emit("Update post",{postUniqueId:t,content:o.val(),timestamp:a,image:$("#editHiddenImageURL").val()?$("#editHiddenImageURL").val():$("#editPostImageReview").attr("src")?$("#editPostImageReview").attr("src"):"No image",video:d.split("watch?v=")[0]+"embed/"+d.split("watch?v=")[1]}),fetch("/dashboard/post/edit",{headers:{"Content-Type":"application/json"},method:"PUT",body:JSON.stringify({postUniqueId:t,content:o.val(),timestamp:a,image:$("#editHiddenImageURL").val()?$("#editHiddenImageURL").val():$("#editPostImageReview").attr("src")?$("#editPostImageReview").attr("src"):"No image",video:d.split("watch?v=")[0]+"embed/"+d.split("watch?v=")[1]})}).then(e=>e.json()).then(e=>{1===e.code?e.ownerId==document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                                    <div class="alert alert-success alert-dismissible fade show ${e.alertId}" role="alert">
                                        <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                        <span>${e.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `),setTimeout(()=>{$(`.${e.alertId}`).alert("close")},4e3),e.imageURL&&(socket.emit("Update edit post image",{postUniqueId:t,imageURL:e.imageURL}),$("#editHiddenImageURL").remove())):0===e.code&&e.ownerId==document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                                    <div class="alert alert-danger alert-dismissible fade show ${e.alertId}" role="alert">
                                        <span>${e.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `),setTimeout(()=>{$(`.${e.alertId}`).alert("close")},4e3),$(`#${t} .post-image`).attr("src",e.image))}).catch(e=>console.log(e)),o.val(""),$("#editPostVideo").css("visibility","hidden"),$("#editPostImageReview").removeAttr("src"),$("#editPostImageReview").removeAttr("class"),$("#editPostImageName").html("Add to post"),$("#editPostClearImage").css("visibility","hidden"),$("#editPostImage").val(""),$("#editPostModal").modal("hide")):$("#errorEditPost").html("Missing content")):""!==o.val()?($("#errorEditPost").html(""),socket.emit("Update post",{content:o.val(),timestamp:a,image:$("#editHiddenImageURL").val()?$("#editHiddenImageURL").val():$("#editPostImageReview").attr("src")?$("#editPostImageReview").attr("src"):"No image",postUniqueId:t}),fetch("/dashboard/post/edit",{headers:{"Content-Type":"application/json"},method:"PUT",body:JSON.stringify({postUniqueId:t,content:o.val(),timestamp:a,video:"No video",image:$("#editHiddenImageURL").val()?$("#editHiddenImageURL").val():$("#editPostImageReview").attr("src")?$("#editPostImageReview").attr("src"):"No image"})}).then(e=>e.json()).then(e=>{1===e.code?e.ownerId==document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                                    <div class="alert alert-success alert-dismissible fade show ${e.alertId}" role="alert">
                                        <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                        <span>${e.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `),setTimeout(()=>{$(`.${e.alertId}`).alert("close")},4e3),e.imageURL&&(socket.emit("Update edit post image",{postUniqueId:t,imageURL:e.imageURL}),$("#editHiddenImageURL").remove())):0===e.code&&e.ownerId==document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                                    <div class="alert alert-danger alert-dismissible fade show ${e.alertId}" role="alert">
                                        <span>${e.message}</span>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `),setTimeout(()=>{$(`.${e.alertId}`).alert("close")},4e3),$(`#${t} .post-image`).attr("src",e.image))}).catch(e=>console.log(e)),o.val(""),$("#editPostImageReview").removeAttr("src"),$("#editPostImageReview").removeAttr("class"),$("#editPostImageName").html("Add to post"),$("#editPostClearImage").css("visibility","hidden"),$("#editPostImage").val(""),$("#editPostModal").modal("hide")):$("#errorEditPost").html("Missing content")}),$("body").on("click",".deletePost",e=>{var t=e.target.dataset.postuniqueid;e.preventDefault(),$("#deletePostButton").attr("data-postUniqueId",t),$("#deletePostModal").modal("toggle")}),$("body").on("click","#deletePostButton",e=>{let t=e.target.dataset.postuniqueid;e.preventDefault(),fetch(`/dashboard/post/delete/${t}`,{headers:{"Content-Type":"application/json"},method:"DELETE"}).then(e=>e.json()).then(e=>{1===e.code&&e.ownerId==document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                            <div class="alert alert-success alert-dismissible fade show ${e.alertId}" role="alert">
                                <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                <span>${e.message}</span>                                                                   
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        `),setTimeout(()=>{$(`.${e.alertId}`).alert("close")},4e3),$("#deletePostModal").modal("hide"),socket.emit("Delete post",t))}).catch(e=>console.log(e))}),$("body").on("click",".post-image",e=>{var t=e.target.getAttribute("src");e.preventDefault(),$("#viewBiggerPostImage").attr("src",t),$("#viewBiggerPostImageModal").modal("toggle")});let t=10,a=20;$("#postArea .dashboard__contentCommunication").slice(10).hide(),$(".dashboard__content").on("scroll",function(){document.querySelector(`#postArea .dashboard__contentCommunication:nth-child(${t})`)&&document.querySelector(`#postArea .dashboard__contentCommunication:nth-child(${t})`).getBoundingClientRect().top<=$(".dashboard__content").height()&&($(`#postArea .dashboard__contentCommunication:nth-child(${t})`).after(`
                                <div class='mt-5 mb-5 post-loading-container'>
                                    <div class='post-loading'></div>
                                </div>
                            `),setTimeout(()=>{$("#postArea .post-loading-container").remove()},1500),$("#postArea .dashboard__contentCommunication").slice(t,a).fadeIn(3e3),t+=10,a+=10)}),$("body").on("click",".editComment",e=>{var t=e.target.dataset.commentuniqueid,a=e.target.dataset.postuniqueid;e.preventDefault(),$("#editCommentContent").val(""),$("#editCommentButton").attr("disabled",!0),$("#editCommentButton").attr("data-commentUniqueId",t),$("#editCommentButton").attr("data-postUniqueId",a),fetch(`/dashboard/post/comment/${a}/${t}`).then(e=>e.json()).then(e=>{1===e.code&&$("#editCommentContent").val(e.data.guestComment)}).catch(e=>console.log(e)),$("#editCommentModal").modal("toggle")}),$("body").on("keyup","#editCommentContent",e=>{e.target.value?$("#editCommentButton").attr("disabled",!1):$("#editCommentButton").attr("disabled",!0)}),$("body").on("click","#editCommentButton",e=>{var t=e.target.dataset.commentuniqueid,a=e.target.dataset.postuniqueid;let d=$("#editCommentContent");var o="Modified - "+(new Date).toLocaleDateString()+", "+(new Date).toLocaleTimeString();e.preventDefault(),d.val()?($("#errorEditComment").html(""),socket.emit("Update comment",{commentUniqueId:t,guestComment:d.val(),commentTimeStamp:o}),fetch("/dashboard/post/comment/edit",{headers:{"Content-Type":"application/json"},method:"PUT",body:JSON.stringify({postUniqueId:a,commentUniqueId:t,guestComment:d.val(),commentTimeStamp:o})}).then(e=>e.json()).then(e=>{1===e.code&&e.guestId==document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                                <div class="alert alert-success alert-dismissible fade show ${e.alertId}" role="alert">
                                    <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                    <span>${e.message}</span>                                                                   
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            `),setTimeout(()=>{$(`.${e.alertId}`).alert("close")},4e3),$("#editCommentModal").modal("hide"))}).catch(e=>console.log(e))):$("#errorEditComment").html("Comment can not be empty!")}),$("body").on("click",".deleteComment",e=>{var t=e.target.dataset.postuniqueid,a=e.target.dataset.commentuniqueid;e.preventDefault(),$("#deleteCommentButton").attr("data-postUniqueId",t),$("#deleteCommentButton").attr("data-commentUniqueId",a),$("#deleteCommentModal").modal("toggle")}),$("body").on("click","#deleteCommentButton",e=>{var t=e.target.dataset.postuniqueid;let a=e.target.dataset.commentuniqueid;e.preventDefault(),fetch(`/dashboard/post/comment/delete/${t}/${a}`,{headers:{"Content-Type":"application/json"},method:"DELETE"}).then(e=>e.json()).then(e=>{1===e.code&&e.guestId==document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                            <div class="alert alert-success alert-dismissible fade show ${e.alertId}" role="alert">
                                <i class="fas fa-bell h5 mr-2 text-warning"></i>
                                <span>${e.message}</span>                                                                   
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        `),setTimeout(()=>{$(`.${e.alertId}`).alert("close")},4e3),$("#deleteCommentModal").modal("hide"),socket.emit("Delete comment",a))}).catch(e=>console.log(e))}),$("body").on("click","#addNewNotification",e=>{e.preventDefault(),$("#notificationMessage").attr("class","mb-0 mr-3"),$("#notificationMessage").html("Processing..."),fetch("/dashboard/notification",{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({notificationTitle:$("#notificationTitle").val(),notificationContent:$("#notificationContent").val(),notificationAttachment:$("#hiddenAttachmentURL").val(),notificationDate:(new Date).toDateString(),notificationType:$("#notificationType").val()})}).then(e=>e.json()).then(e=>{1===e.code?($("#notificationMessage").attr("class","text-success mb-0 mr-3"),$("#notificationMessage").html("Create notification successful"),socket.emit("Notification alert",{message:e.message,alertId:e.alertId,ownerId:e.ownerId}),setTimeout(()=>{window.location.href="/dashboard/notification"},1500)):0===e.code&&($("#notificationMessage").attr("class","text-danger mb-0 mr-3"),$("#notificationMessage").html(e.message))}).catch(e=>console.log(e))}),$("body").on("click","#btnUpdateNotif",e=>{e.preventDefault();e=e.target.dataset.notificationid;$("#editNotificationMessage").html("Processing..."),fetch(`/dashboard/notification/${e}`,{headers:{"Content-Type":"application/json"},method:"PUT",body:JSON.stringify({notificationTitle:$("#editTitle").val(),notificationContent:$("#editContent").val(),notificationAttachment:$("#hiddenEditAttachmentURL").val(),notificationDate:(new Date).toDateString()+" (Đã chỉnh sửa)",notificationType:$("#editType").val(),deleteAttachment:$("#deleteAttachmentBool").val()})}).then(e=>e.json()).then(e=>{1===e.code?($("#editNotificationMessage").attr("class","text-success"),$("#editNotificationMessage").html(e.message),setTimeout(()=>{window.location.href="/dashboard/notification"},1500)):0===e.code&&($("#editNotificationMessage").attr("class","text-danger"),$("#editNotificationMessage").html(e.message))}).catch(e=>console.log(e))}),$("body").on("keydown","#editTitle",e=>{e.target.value?$("#btnUpdateNotif").attr("disabled",!1):$("#btnUpdateNotif").attr("disabled",!0)}),$("body").on("keydown","#editContent",e=>{e.target.value?$("#btnUpdateNotif").attr("disabled",!1):$("#btnUpdateNotif").attr("disabled",!0)}),$("body").on("change","#editType",e=>{e.target.value?$("#btnUpdateNotif").attr("disabled",!1):$("#btnUpdateNotif").attr("disabled",!0)}),$("body").on("change","#editAttachment",e=>{e.target.value?$("#btnUpdateNotif").attr("disabled",!1):$("#btnUpdateNotif").attr("disabled",!0)}),$("body").on("click","#deleteNotificationAttachment",()=>{$("#editNotificationMessage").attr("class","text-success"),$("#editNotificationMessage").html("Delete attachment of notification successful"),$("#deleteAttachmentBool").val("yes"),$("#btnUpdateNotif").attr("disabled",!1)}),$("body").on("click","#deleteNotifBtn",e=>{e.preventDefault();e=e.target.dataset.notificationid;$("#deleteNotificationMessage").html(""),fetch(`/dashboard/notification/${e}`,{method:"DELETE"}).then(e=>e.json()).then(e=>{1===e.code?($("#deleteNotificationMessage").attr("class","text-success text-center"),$("#deleteNotificationMessage").html(e.message),setTimeout(()=>{window.location.href="/dashboard/notification"},1500)):0===e.code&&($("#deleteNotificationMessage").attr("class","text-danger text-center"),$("#deleteNotificationMessage").html(e.message))}).catch(e=>console.log(e))}),$("body").on("change","#notifs",e=>{fetch(`/dashboard/notification/pagination/1/${e.target.value}`,{method:"POST"}).then(e=>e.json()).then(a=>{if(1===a.code){$("#notificationList").html("");for(var e of a.data)$("#notificationList").append(`
                            <tr class="NotifDetails" data-notifId=${e._id}>
                                <td data-notifId=${e._id}>
                                    <p title="${"["+e.type+"] - "+e.date}" class="font-italic text-secondary" data-notifId=${e._id}>
                                        [${e.type}] - ${e.date}
                                    </p>
                                    <p class="mb-0 text-primary" data-notifId=${e._id} title=${e.title}>${e.title}</p>
                                </td>
                            </tr>
                        `);if(a.totalNotifPages&&1===a.totalNotifPages)$("#innerPagination").html(""),$("#innerPagination").append(`
                            <li class="page-item text-light active" data-page="1">
                                <a class="page-link" type="button" data-page="1">1</a>
                            </li>
                        `),$("#currentViewingPage").html("Page 1");else if(a.totalNotifPages&&1<a.totalNotifPages){let e=1,t="";for(;e<=a.totalNotifPages;)1===e?t+=`
                                    <li class="page-item active text-light" data-page=${e}>
                                        <a class="page-link" type="button" data-page=${e}>${e}</a>
                                    </li>
                                `:t+=`
                                    <li class="page-item text-primary" data-page=${e}>
                                        <a class="page-link" type="button" data-page=${e}>${e}</a>
                                    </li>
                                `,e++;$("#innerPagination").html(""),$("#innerPagination").append(`
                            ${t}
                        `),$("#currentViewingPage").html(`Page 1 of ${a.totalNotifPages}`)}else 0===a.totalNotifPages&&($("#innerPagination").html(""),$("#currentViewingPage").html(""))}}).catch(e=>console.log(e))}),$("body").on("click",".page-item",e=>{let a=e.target.dataset.page;e=$("#notifs").val();fetch(`/dashboard/notification/pagination/${a}/${e}`,{method:"POST"}).then(e=>e.json()).then(e=>{if(1===e.code&&0<e.data.length){$("#notificationList").html("");for(var t of e.data)$("#notificationList").append(`
                            <tr class="NotifDetails" data-notifId=${t._id}>
                                <td data-notifId=${t._id}>
                                    <p title="${"["+t.type+"] - "+t.date}" class="font-italic text-secondary" data-notifId=${t._id}>
                                        [${t.type}] - ${t.date}
                                    </p>
                                    <p class="mb-0 text-primary" data-notifId=${t._id} title=${t.title}>${t.title}</p>
                                </td>
                            </tr>
                        `);$(`.page-item[data-page=${a}]`).removeClass("text-primary").addClass("active").addClass("text-light").siblings().removeClass("active").removeClass("text-light").addClass("text-primary"),1<e.totalNotifPages?$("#currentViewingPage").html(`Page ${a} of ${e.totalNotifPages}`):$("#currentViewingPage").html("Page 1")}}).catch(e=>console.log(e))}),$("body").on("click",".page-item[data-page='previous']",e=>{$("#innerPagination").animate({scrollLeft:"-=80"},400)}),$("body").on("click",".page-item[data-page='next']",e=>{$("#innerPagination").animate({scrollLeft:"+=80"},400)}),$("#userWallId").val()==$("#userObjectId").val()&&($("img[alt='user sidebar avatar']").css("box-shadow","0 0 0 5px rgba(104, 104, 230, 0.06)"),$("img[alt='user sidebar avatar']").css("border","3px solid rgba(128, 189, 255, 0.4)")),$("body").on("keydown","#editEmail",e=>{e.target.value?$("#btnUpdateManagement").attr("disabled",!1):$("#btnUpdateManagement").attr("disabled",!0)}),$("body").on("keydown","#editName",e=>{e.target.value?$("#btnUpdateManagement").attr("disabled",!1):$("#btnUpdateManagement").attr("disabled",!0)}),$("body").on("keydown","#editPhone",e=>{e.target.value?$("#btnUpdateManagement").attr("disabled",!1):$("#btnUpdateManagement").attr("disabled",!0)}),$("body").on("keydown","#editFaculty",e=>{e.target.value?$("#btnUpdateManagement").attr("disabled",!1):$("#btnUpdateManagement").attr("disabled",!0)}),$("body").on("keydown","#editClass",e=>{e.target.value?$("#btnUpdateManagement").attr("disabled",!1):$("#btnUpdateManagement").attr("disabled",!0)}),$("body").on("keydown","#editPassword",e=>{e.target.value?$("#btnUpdateManagement").attr("disabled",!1):$("#btnUpdateManagement").attr("disabled",!0)}),$("body").on("change","#editWorkplace",e=>{e.target.value?$("#btnUpdateManagement").attr("disabled",!1):$("#btnUpdateManagement").attr("disabled",!0)}),$("body").on("change","#editPermission",e=>{e.target.value?$("#btnUpdateManagement").attr("disabled",!1):$("#btnUpdateManagement").attr("disabled",!0)}),$("body").on("change","#editAvatar",e=>{e.target.value?$("#btnUpdateManagement").attr("disabled",!1):$("#btnUpdateManagement").attr("disabled",!0)}),$("body").on("click","#btnUpdateManagement",e=>{e.preventDefault();var t=e.target.dataset.userid;let a=new FormData;e=document.getElementById("editAvatar");a.append("phone",$("#editPhone").val()),a.append("name",$("#editName").val()),a.append("workplace",$("#editWorkplace").val()),a.append("permission",$("#editPermission")&&$("#editPermission").val()),a.append("class",$("#editClass")&&$("#editClass").val()),a.append("faculty",$("#editFaculty")&&$("#editFaculty").val()),a.append("password",$("#editPassword")&&$("#editPassword").val()),a.append("editAvatar",e.files[0]),fetch(`/dashboard/users/${t}`,{method:"PUT",body:a}).then(e=>e.json()).then(e=>{1===e.code?($("#editManagementMessage").attr("class","text-success"),$("#editManagementMessage").html(e.message),setTimeout(()=>{window.location.href="/dashboard/users"},1500)):0===e.code&&($("#editManagementMessage").attr("class","text-danger"),$("#editManagementMessage").html(e.message))}).catch(e=>console.log(e))}),$("body").on("click","#deleteManagementBtn",e=>{e.preventDefault();e=e.target.dataset.userid;$("#deleteManagementMessage").html(""),fetch(`/dashboard/users/${e}`,{method:"DELETE"}).then(e=>e.json()).then(e=>{1===e.code?($("#deleteManagementMessage").attr("class","text-success text-center"),$("#deleteManagementMessage").html(e.message),setTimeout(()=>{window.location.href="/dashboard/users"},1500)):0===e.code&&($("#deleteManagementMessage").attr("class","text-danger text-center"),$("#deleteManagementMessage").html(e.message))}).catch(e=>console.log(e))}),socket.on("Rendering new post",e=>{e.ownerId==document.getElementById("userObjectId").value?($("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 pb-1 px-3 pt-3 bg-white col-md-12" id=${e.postUniqueId}>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <a href="/dashboard/wall/${e.ownerId}" class="text-dark">
                                <img src=${e.profileAvatar} alt="user avatar" width="45" height="45"/>
                            </a>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <a href="/dashboard/wall/${e.ownerId}" class="text-dark">
                                        <strong>${e.name}</strong>
                                    </a>
                                    <p class="mb-0">
                                        <small class="text-secondary timestamp-post">${e.timestamp}</small>
                                    </p>
                                </div>
                                <div class="dropdown show">
                                    <a class="btn btn-link text-dark dropdown-toggle" role="button" id="postHandlerDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </a>
                                    
                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="postHandlerDropdown">
                                        <button class="dropdown-item btn btn-link editPost" data-postUniqueId=${e.postUniqueId}>Edit</button>
                                        <button class="dropdown-item btn btn-link deletePost" data-postUniqueId=${e.postUniqueId}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="post-content">${e.content}</p>
                    <div id="imageAndVideoContainer">
                        ${e.image&&e.video?`
                                <div class="row">
                                    <div class="px-0 col-md-6">
                                        <img src="/images/imageLoading.gif" class="post-image" />
                                    </div>
                                    <div class="px-0 col-md-6 embed-responsive embed-responsive-16by9">
                                        <iframe class="embed-responsive-item" src=${e.video} allowfullscreen></iframe>
                                    </div>
                                </div>   
                            `:!e.image&&e.video?`
                                <div class="row">
                                    <div class="px-0 col-md-12 embed-responsive embed-responsive-16by9">
                                        <iframe class="embed-responsive-item" src=${e.video} allowfullscreen></iframe>
                                    </div>
                                </div>
                            `:e.image&&!e.video?`
                                <div class="row">
                                    <div class="px-0 col-md-12">
                                        <img src="/images/imageLoading.gif" class="post-image" />
                                    </div>
                                </div>
                            `:`
                                
                            `}
                    </div>
                    <div class="m-3">
                        <hr class="my-0" />
                        <div class="btn-postStatus form-group row mb-0">
                            <div class="col-md-4 col-sm-4 col-4 p-2 d-flex align-items-center justify-content-center">
                                <i class="far fa-thumbs-up"></i>
                                <span class="ml-2">Like</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 p-2">
                                <label class="mb-0 d-flex align-items-center justify-content-center" for="commentInput-${e.postUniqueId}">
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
                        <div class="dashboard__contentCommunicationComment" id="comment-${e.postUniqueId}">
                            <div id="commentSection" data-postUniqueId=${e.postUniqueId}></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 input-group commentInputStyles">
                                <input type="text" placeholder="Write your comment..." id="commentInput-${e.postUniqueId}" class="form-control commentInput" data-inputComment=${e.postUniqueId} onkeypress="emitComment(event)" />
                                <div class="input-group-append">
                                    <button class="btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${e.postUniqueId}>
                                        <i class="fas fa-paper-plane" data-postUniqueId=${e.postUniqueId}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `),$("#alertContainer").prepend(`
                <div class="alert alert-success alert-dismissible fade show ${e.successAlert.alertId}" role="alert">
                    <i class="fas fa-bell h5 mr-2 text-warning"></i>
                    <span>${e.successAlert.message}</span>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `),setTimeout(()=>{$(`.${e.successAlert.alertId}`).alert("close")},4e3)):$("#postArea").prepend(`
                <div class="dashboard__contentCommunication mb-4 pb-1 px-3 pt-3 bg-white col-md-12" id=${e.postUniqueId}>
                    <div class="form-group row">
                        <div class="col-md-1 col-sm-2 col-3">
                            <a href="/dashboard/wall/${e.ownerId}" class="text-dark">
                                <img src=${e.profileAvatar} alt="user avatar" width="45" height="45"/>
                            </a>
                        </div>
                        <div class="col-md-11 col-sm-9 col-8">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <a href="/dashboard/wall/${e.ownerId}" class="text-dark">
                                        <strong>${e.name}</strong>
                                    </a>
                                    <p class="mb-0">
                                        <small class="text-secondary timestamp-post">${e.timestamp}</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="post-content">${e.content}</p>
                    <div id="imageAndVideoContainer">
                        ${e.image&&e.video?`
                                <div class="row">
                                    <div class="px-0 col-md-6">
                                        <img src="/images/imageLoading.gif" class="post-image" />
                                    </div>
                                    <div class="px-0 col-md-6 embed-responsive embed-responsive-16by9">
                                        <iframe class="embed-responsive-item" src=${e.video} allowfullscreen></iframe>
                                    </div>
                                </div>   
                            `:!e.image&&e.video?`
                                <div class="row">
                                    <div class="px-0 col-md-12 embed-responsive embed-responsive-16by9">
                                        <iframe class="embed-responsive-item" src=${e.video} allowfullscreen></iframe>
                                    </div>
                                </div>
                            `:e.image&&!e.video?`
                                <div class="row">
                                    <div class="px-0 col-md-12">
                                        <img src="/images/imageLoading.gif" class="post-image" />
                                    </div>
                                </div>
                            `:`
                                
                            `}
                    </div>
                    <div class="m-3">
                        <hr class="my-0" />
                        <div class="btn-postStatus form-group row mb-0">
                            <div class="col-md-4 col-sm-4 col-4 p-2 d-flex align-items-center justify-content-center">
                                <i class="far fa-thumbs-up"></i>
                                <span class="ml-2">Like</span>
                            </div>
                            <div class="col-md-4 col-sm-4 col-4 p-2">
                                <label class="mb-0 d-flex align-items-center justify-content-center" for="commentInput-${e.postUniqueId}">
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
                        <div class="dashboard__contentCommunicationComment" id="comment-${e.postUniqueId}">
                            <div id="commentSection" data-postUniqueId=${e.postUniqueId}></div>
                        </div>

                        <div class="row">
                            <div class="px-0 pt-3 col-md-12 input-group commentInputStyles">
                                <input type="text" placeholder="Write your comment..." id="commentInput-${e.postUniqueId}" class="form-control commentInput" data-inputComment=${e.postUniqueId} onkeypress="emitComment(event)" />
                                <div class="input-group-append">
                                    <button class="btn btn-primary" onclick="emitCommentOnButton(event)" data-postUniqueId=${e.postUniqueId}>
                                        <i class="fas fa-paper-plane" data-postUniqueId=${e.postUniqueId}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)}),socket.on("Rendering update post",e=>{e.video||e.image?($(`#${e.postUniqueId} .timestamp-post`).html(e.timestamp),$(`#${e.postUniqueId} .post-content`).html(e.content),$(`#${e.postUniqueId} #imageAndVideoContainer`).html(""),$(`#${e.postUniqueId} #imageAndVideoContainer`).append(`
                ${e.image&&"No image"!==e.image&&e.video?`
                        <div class="row">
                            <div class="px-0 col-md-6">
                                <img src="/images/imageLoading.gif" class="post-image" />
                            </div>
                            <div class="px-0 col-md-6 embed-responsive embed-responsive-16by9">
                                <iframe class="embed-responsive-item" src=${e.video} allowfullscreen></iframe>
                            </div>
                        </div>   
                    `:e.image&&"No image"!==e.image||!e.video?e.image&&"No image"!==e.image&&!e.video?`
                        <div class="row">
                            <div class="px-0 col-md-12">
                                <img src="/images/imageLoading.gif" class="post-image" />
                            </div>
                        </div>
                    `:`
                        
                    `:`
                        <div class="row">
                            <div class="px-0 col-md-12 embed-responsive embed-responsive-16by9">
                                <iframe class="embed-responsive-item" src=${e.video} allowfullscreen></iframe>
                            </div>
                        </div>
                    `}
            `)):("No image"!==e.image||e.video)&&(e.video||e.image)||($(`#${e.postUniqueId} #imageAndVideoContainer`).html(""),$(`#${e.postUniqueId} .timestamp-post`).html(e.timestamp),$(`#${e.postUniqueId} .post-content`).html(e.content))}),socket.on("Deleting post",e=>{$(`#${e}`).remove()}),socket.on("Rendering post image",e=>{$(`#${e.postUniqueId} .post-image`).attr("src",e.imageURL)}),socket.on("Rendering edit post image",e=>{$(`#${e.postUniqueId} .post-image`).attr("src",e.imageURL)}),socket.on("Rendering new comment",e=>{e.guestId==document.getElementById("userObjectId").value?$("div[data-postUniqueId="+e.postUniqueId+"]").append(`
                <div class="form-group row" id=${e.commentUniqueId}>
                    <div class="col-md-1 col-sm-2 col-3">
                        <a href="/dashboard/wall/${e.guestId}" class="text-dark">
                            <img class="comment-ProfilePic" src=${e.guestAvatar} alt="user avatar" width="40" height="40"/>
                        </a>
                    </div>
                    <div class="col-md-11 col-sm-9 col-8">
                        <div class="commentContainerStyles d-flex align-items-center">
                            <div class="py-1 px-2">
                                <a href="/dashboard/wall/${e.guestId}" class="text-dark">
                                    <strong>${e.guestName}</strong>
                                </a>
                                <p class="mb-0">${e.guestComment}</p>
                            </div>
                            <div class="dropdown show commentHandler">
                                <a class="btn btn-link text-dark bg-white dropdown-toggle" role="button" id="commentHandlerDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-h"></i>                                
                                </a>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="commentHandlerDropdown">
                                    <button class="dropdown-item btn btn-link editComment" data-postUniqueId=${e.postUniqueId} data-commentUniqueId=${e.commentUniqueId}>Edit</button>
                                    <button class="dropdown-item btn btn-link deleteComment" data-postUniqueId=${e.postUniqueId} data-commentUniqueId=${e.commentUniqueId}>Delete</button>
                                </div>
                            </div>
                        </div>
                        <small class="ml-2 text-secondary">${e.commentTimeStamp}</small>
                    </div>
                </div>
            `):$("div[data-postUniqueId="+e.postUniqueId+"]").append(`
                <div class="form-group row" id=${e.commentUniqueId}>
                    <div class="col-md-1 col-sm-2 col-3">
                        <a href="/dashboard/wall/${e.guestId}" class="text-dark">
                            <img class="comment-ProfilePic" src=${e.guestAvatar} alt="user avatar" width="40" height="40"/>
                        </a>
                    </div>
                    <div class="col-md-11 col-sm-9 col-8">
                        <div class="commentContainerStyles d-flex align-items-center">
                            <div class="py-1 px-2">
                                <a href="/dashboard/wall/${e.guestId}" class="text-dark">
                                    <strong>${e.guestName}</strong>
                                </a>
                                <p class="mb-0">${e.guestComment}</p>
                            </div>
                        </div>
                        <small class="ml-2 text-secondary">${e.commentTimeStamp}</small>
                    </div>
                </div>
            `),document.getElementById("comment-"+e.postUniqueId).scrollTop=document.getElementById("comment-"+e.postUniqueId).scrollHeight}),socket.on("Rendering update comment",e=>{$(`#${e.commentUniqueId} p`).html(e.guestComment),$(`#${e.commentUniqueId} small`).html(e.commentTimeStamp)}),socket.on("Deleting comment",e=>{$(`#${e}`).remove()}),socket.on("Displaying notification alert",e=>{e.ownerId!=document.getElementById("userObjectId").value&&($("#alertContainer").prepend(`
                <div class="alert alert-warning alert-dismissible fade show d-flex ${e.alertId}" role="alert">
                    <i class="fas fa-bell h5 mr-2 text-warning mb-0"></i>
                    <div class="d-flex align-items-center">${e.message}</div>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `),setTimeout(()=>{$(`.${e.alertId}`).alert("close")},4e3))})}),document.getElementById("btnUpdate")&&document.getElementById("btnUpdate").addEventListener("click",e=>{e.preventDefault();let t=document.getElementById("userName"),a=document.getElementById("userPhone"),d=document.getElementById("oldPassword"),o=document.getElementById("newPassword"),n=document.getElementById("confirmPassword"),s=document.getElementById("class"),i=document.getElementById("faculty");e=document.getElementById("hiddenNewAvatarURL");let l=document.getElementById("btnUpdate"),r=document.getElementById("btnDefault"),m=document.getElementById("updateInfoError"),c=document.getElementById("updateInfoSuccess");fetch("/dashboard/info",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hiddenNewAvatarURL:e?e.value:"",userName:t?t.value:"",userPhone:a?a.value:"",oldPassword:d?d.value:"",newPassword:o?o.value:"",confirmPassword:n?n.value:"",studentClass:s?s.value:"",studentFaculty:i?i.value:""})}).then(e=>e.json()).then(e=>{1===e.code?(m.innerHTML="",c.innerHTML=e.message,t.setAttribute("disabled","disabled"),a.setAttribute("disabled","disabled"),l.setAttribute("disabled","disabled"),r.setAttribute("disabled","disabled"),d&&d.setAttribute("disabled","disabled"),o&&o.setAttribute("disabled","disabled"),n&&n.setAttribute("disabled","disabled"),s&&s.setAttribute("disabled","disabled"),i&&i.setAttribute("disabled","disabled"),setTimeout(()=>{window.location.href="/dashboard"},1500)):0===e.code?(c.innerHTML="",m.innerHTML=e.message):m.innerHTML=""}).catch(e=>console.error(e))});let newAvatarInput=document.getElementById("newAvatar");newAvatarInput&&newAvatarInput.addEventListener("change",e=>{document.getElementById("hiddenNewAvatarURL")&&document.getElementById("hiddenNewAvatarURL").remove(),document.getElementById("btnUpdate").setAttribute("disabled",!0),document.getElementById("btnDefault").setAttribute("disabled",!0),document.getElementById("uploadNewAvatar").innerHTML="",document.getElementById("uploadNewAvatar").innerHTML=`
            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `,setTimeout(()=>{document.getElementById("uploadNewAvatar").innerHTML="",document.getElementById("uploadNewAvatar").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-2" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},700),setTimeout(()=>{document.getElementById("uploadNewAvatar").innerHTML="",document.getElementById("uploadNewAvatar").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},900),setTimeout(()=>{document.getElementById("uploadNewAvatar").innerHTML="",document.getElementById("uploadNewAvatar").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-4" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},1100),uploadNewAvatarToFileIOAPI(e.target.files[0])});const uploadNewAvatarToFileIOAPI=e=>{let t=new XMLHttpRequest,a=new FormData;a.append("file",e),t.open("POST","https://file.io",!0),t.onreadystatechange=()=>{if(4===t.readyState&&200===t.status){let e=document.createElement("input");e.setAttribute("type","hidden"),e.setAttribute("id","hiddenNewAvatarURL"),e.setAttribute("value",JSON.parse(t.responseText).link),document.querySelector("body").append(e),document.getElementById("uploadNewAvatar").innerHTML="",document.getElementById("uploadNewAvatar").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-5" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `,setTimeout(()=>{document.getElementById("uploadNewAvatar").innerHTML=""},500),document.getElementById("btnUpdate").removeAttribute("disabled"),document.getElementById("btnDefault").removeAttribute("disabled")}},t.send(a)},emitComment=s=>{if(13===s.keyCode){let t=document.getElementById("sidebarUsername").innerHTML,a=document.getElementById("displayInfo").getAttribute("src"),d=document.getElementById("userObjectId").value,o=s.target.getAttribute("data-inputComment"),n=s.target.value;""!==n&&fetch("/dashboard/post",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({guestId:d,postUniqueId:o,guestAvatar:a,guestComment:n,guestName:t,commentTimeStamp:(new Date).toLocaleDateString()+", "+(new Date).toLocaleTimeString()})}).then(e=>e.json()).then(e=>{socket.emit("Add new comment",{commentUniqueId:e.commentUniqueId,userType:e.userType,guestId:d,postUniqueId:o,guestAvatar:a,guestComment:n,guestName:t,commentTimeStamp:(new Date).toLocaleDateString()+", "+(new Date).toLocaleTimeString()}),s.target.value=""}).catch(e=>console.error(e))}},emitCommentOnButton=e=>{let t=document.getElementById("sidebarUsername").innerHTML,a=document.getElementById("displayInfo").getAttribute("src"),d=document.getElementById("userObjectId").value,o=e.target.dataset.postuniqueid;document.body.querySelector(`input[data-inputComment="${o}"]`)&&""!==document.body.querySelector(`input[data-inputComment="${o}"]`).value&&fetch("/dashboard/post",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({guestId:d,postUniqueId:o,guestAvatar:a,guestComment:document.body.querySelector(`input[data-inputComment="${o}"]`).value,guestName:t,commentTimeStamp:(new Date).toLocaleDateString()+", "+(new Date).toLocaleTimeString()})}).then(e=>e.json()).then(e=>{socket.emit("Add new comment",{commentUniqueId:e.commentUniqueId,userType:e.userType,guestId:d,postUniqueId:o,guestAvatar:a,guestComment:document.body.querySelector(`input[data-inputComment="${o}"]`).value,guestName:t,commentTimeStamp:(new Date).toLocaleDateString()+", "+(new Date).toLocaleTimeString()}),document.body.querySelector(`input[data-inputComment="${o}"]`).value=""}).catch(e=>console.error(e))};document.getElementById("modalPostButton")&&document.getElementById("modalPostButton").setAttribute("disabled",!0),document.getElementById("editPostButton")&&document.getElementById("editPostButton").setAttribute("disabled",!0),document.getElementById("content")&&document.getElementById("content").addEventListener("keyup",e=>{e.target.value?document.getElementById("modalPostButton").removeAttribute("disabled"):document.getElementById("modalPostButton").setAttribute("disabled",!0)}),document.getElementById("video")&&document.getElementById("video").addEventListener("keyup",e=>{document.getElementById("modalPostButton").removeAttribute("disabled")}),document.getElementById("editPostContent")&&document.getElementById("editPostContent").addEventListener("keyup",e=>{e.target.value?document.getElementById("editPostButton").removeAttribute("disabled"):document.getElementById("editPostButton").setAttribute("disabled",!0)}),document.getElementById("editPostVideo")&&document.getElementById("editPostVideo").addEventListener("keyup",e=>{document.getElementById("editPostButton").removeAttribute("disabled")});let postImageInput=document.getElementById("postImage");postImageInput&&postImageInput.addEventListener("change",e=>{document.getElementById("errorPost").innerHTML="",document.getElementById("modalPostButton").setAttribute("disabled",!0),document.getElementById("uploadPost").innerHTML="",document.getElementById("uploadPost").innerHTML=`
            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `,setTimeout(()=>{document.getElementById("uploadPost").innerHTML="",document.getElementById("uploadPost").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-2" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},700),setTimeout(()=>{document.getElementById("uploadPost").innerHTML="",document.getElementById("uploadPost").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},900),setTimeout(()=>{document.getElementById("uploadPost").innerHTML="",document.getElementById("uploadPost").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-4" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},1100),uploadToFileIOAPI(e.target.files[0])});const uploadToFileIOAPI=e=>{let t=new XMLHttpRequest,a=new FormData;a.append("file",e),t.open("POST","https://file.io",!0),t.onreadystatechange=()=>{if(4===t.readyState&&200===t.status){let e=document.createElement("input");e.setAttribute("type","hidden"),e.setAttribute("id","hiddenImageURL"),e.setAttribute("value",JSON.parse(t.responseText).link),document.querySelector("body").append(e),document.getElementById("uploadPost").innerHTML="",document.getElementById("uploadPost").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-5" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `,setTimeout(()=>{document.getElementById("uploadPost").innerHTML=""},500),document.getElementById("modalPostButton").removeAttribute("disabled")}},t.send(a)};let editPostImageInput=document.getElementById("editPostImage");editPostImageInput&&editPostImageInput.addEventListener("change",e=>{document.getElementById("errorEditPost").innerHTML="",document.getElementById("editPostButton").setAttribute("disabled",!0),document.getElementById("editUploadPost").innerHTML="",document.getElementById("editUploadPost").innerHTML=`
            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `,setTimeout(()=>{document.getElementById("editUploadPost").innerHTML="",document.getElementById("editUploadPost").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-2" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},700),setTimeout(()=>{document.getElementById("editUploadPost").innerHTML="",document.getElementById("editUploadPost").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},900),setTimeout(()=>{document.getElementById("editUploadPost").innerHTML="",document.getElementById("editUploadPost").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-4" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},1100),editUploadToFileIOAPI(e.target.files[0])});const editUploadToFileIOAPI=e=>{let t=new XMLHttpRequest,a=new FormData;a.append("file",e),t.open("POST","https://file.io",!0),t.onreadystatechange=()=>{if(4===t.readyState&&200===t.status){let e=document.createElement("input");e.setAttribute("type","hidden"),e.setAttribute("id","editHiddenImageURL"),e.setAttribute("value",JSON.parse(t.responseText).link),document.querySelector("body").append(e),document.getElementById("editUploadPost").innerHTML="",document.getElementById("editUploadPost").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-5" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `,setTimeout(()=>{document.getElementById("editUploadPost").innerHTML=""},500),document.getElementById("editPostButton").removeAttribute("disabled")}},t.send(a)};function postImageReviewHandler(t){if(t.files&&t.files[0]){let e=new FileReader;e.onload=e=>{$("#postImageReview").attr("src",e.target.result),$("#postImageReview").attr("class","mr-3"),$("#postImageName").html(t.files[0].name)},e.readAsDataURL(t.files[0])}}function editPostImageReviewHandler(t){if(t.files&&t.files[0]){let e=new FileReader;e.onload=e=>{$("#editPostImageReview").attr("src",e.target.result),$("#editPostImageReview").attr("class","mr-3"),$("#editPostImageName").html(t.files[0].name)},e.readAsDataURL(t.files[0])}}document.getElementById("youtubeURLInput")&&(document.getElementById("youtubeURLInput").style.visibility="hidden"),document.getElementById("editYoutubeURLInput")&&(document.getElementById("editYoutubeURLInput").style.visibility="hidden"),document.getElementById("youtubeURLInputButton")&&document.getElementById("youtubeURLInputButton").addEventListener("click",e=>{e.target.classList.contains("removeYoutubeURLInput")?(document.getElementById("youtubeURLInput").style.visibility="hidden",document.getElementById("youtubeURLInputButton").classList.remove("removeYoutubeURLInput")):(document.getElementById("youtubeURLInput").style.visibility="visible",document.getElementById("youtubeURLInputButton").classList.add("removeYoutubeURLInput"),document.getElementById("video").focus())}),document.getElementById("editYoutubeURLInputButton")&&document.getElementById("editYoutubeURLInputButton").addEventListener("click",e=>{e.target.classList.contains("editRemoveYoutubeURLInput")?(document.getElementById("editYoutubeURLInput").style.visibility="hidden",document.getElementById("editYoutubeURLInputButton").classList.remove("editRemoveYoutubeURLInput")):(document.getElementById("editYoutubeURLInput").style.visibility="visible",document.getElementById("editYoutubeURLInputButton").classList.add("editRemoveYoutubeURLInput"),document.getElementById("editPostVideo").focus())}),document.getElementById("postClearImage")&&document.getElementById("postClearImage").addEventListener("click",()=>{document.getElementById("errorPost").innerHTML="",document.getElementById("postImageName").innerHTML="",document.getElementById("postImageName").innerHTML="Add to post",document.getElementById("postImageReview").removeAttribute("src"),document.getElementById("postImageReview").removeAttribute("class"),document.getElementById("postClearImage").style.visibility="hidden",document.getElementById("hiddenImageURL").remove()}),document.getElementById("editPostClearImage")&&(document.getElementById("editPostClearImage").style.visibility="hidden",document.getElementById("editPostClearImage").addEventListener("click",()=>{document.getElementById("errorEditPost").innerHTML="",document.getElementById("editPostImageName").innerHTML="",document.getElementById("editPostImageName").innerHTML="Add to post",document.getElementById("editPostImageReview").removeAttribute("src"),document.getElementById("editPostImageReview").removeAttribute("class"),document.getElementById("editPostClearImage").style.visibility="hidden",document.getElementById("editPostButton").removeAttribute("disabled")}));let attachmentInput=document.getElementById("notificationAttachment");attachmentInput&&attachmentInput.addEventListener("change",e=>{document.getElementById("hiddenAttachmentURL")&&document.getElementById("hiddenAttachmentURL").remove(),document.getElementById("addNewNotification").setAttribute("disabled",!0),document.getElementById("clearNotificationAttachment").setAttribute("disabled",!0),document.getElementById("uploadAttachment").innerHTML="",document.getElementById("uploadAttachment").innerHTML=`
            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `,setTimeout(()=>{document.getElementById("uploadAttachment").innerHTML="",document.getElementById("uploadAttachment").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-2" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},700),setTimeout(()=>{document.getElementById("uploadAttachment").innerHTML="",document.getElementById("uploadAttachment").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},900),setTimeout(()=>{document.getElementById("uploadAttachment").innerHTML="",document.getElementById("uploadAttachment").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-4" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},1100),uploadAttachmentToFileIOAPI(e.target.files[0])});const uploadAttachmentToFileIOAPI=e=>{let t=new XMLHttpRequest,a=new FormData;a.append("file",e),t.open("POST","https://file.io",!0),t.onreadystatechange=()=>{if(4===t.readyState&&200===t.status){let e=document.createElement("input");e.setAttribute("type","hidden"),e.setAttribute("id","hiddenAttachmentURL"),e.setAttribute("value",JSON.parse(t.responseText).link),document.querySelector("body").append(e),document.getElementById("uploadAttachment").innerHTML="",document.getElementById("uploadAttachment").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-5" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `,setTimeout(()=>{document.getElementById("uploadAttachment").innerHTML=""},500),document.getElementById("addNewNotification").removeAttribute("disabled"),document.getElementById("clearNotificationAttachment").removeAttribute("disabled")}},t.send(a)};document.getElementById("clearNotificationAttachment")&&document.getElementById("clearNotificationAttachment").addEventListener("click",()=>{document.getElementById("notificationAttachment").value="",document.getElementById("hiddenAttachmentURL")&&document.getElementById("hiddenAttachmentURL").remove()});let editAttachmentInput=document.getElementById("editAttachment");editAttachmentInput&&editAttachmentInput.addEventListener("change",e=>{document.getElementById("hiddenEditAttachmentURL")&&document.getElementById("hiddenEditAttachmentURL").remove(),document.getElementById("btnUpdateNotif").setAttribute("disabled",!0),document.getElementById("clearEditNotificationAttachment").setAttribute("disabled",!0),document.getElementById("uploadEditAttachment").innerHTML="",document.getElementById("uploadEditAttachment").innerHTML=`
            <div class="progress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `,setTimeout(()=>{document.getElementById("uploadEditAttachment").innerHTML="",document.getElementById("uploadEditAttachment").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-2" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},700),setTimeout(()=>{document.getElementById("uploadEditAttachment").innerHTML="",document.getElementById("uploadEditAttachment").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},900),setTimeout(()=>{document.getElementById("uploadEditAttachment").innerHTML="",document.getElementById("uploadEditAttachment").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-4" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `},1100),uploadEditAttachmentToFileIOAPI(e.target.files[0])});const uploadEditAttachmentToFileIOAPI=e=>{let t=new XMLHttpRequest,a=new FormData;a.append("file",e),t.open("POST","https://file.io",!0),t.onreadystatechange=()=>{if(4===t.readyState&&200===t.status){let e=document.createElement("input");e.setAttribute("type","hidden"),e.setAttribute("id","hiddenEditAttachmentURL"),e.setAttribute("value",JSON.parse(t.responseText).link),document.querySelector("body").append(e),document.getElementById("uploadEditAttachment").innerHTML="",document.getElementById("uploadEditAttachment").innerHTML=`
                <div class="progress">
                    <div class="progress-bar progressBar-5" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `,setTimeout(()=>{document.getElementById("uploadEditAttachment").innerHTML=""},500),document.getElementById("btnUpdateNotif").removeAttribute("disabled"),document.getElementById("clearEditNotificationAttachment").removeAttribute("disabled")}},t.send(a)};document.getElementById("clearEditNotificationAttachment")&&document.getElementById("clearEditNotificationAttachment").addEventListener("click",()=>{document.getElementById("editAttachment").value="",document.getElementById("hiddenEditAttachmentURL")&&document.getElementById("hiddenEditAttachmentURL").remove()});