// jQuery code
$(document).ready(() => {
    // Display log out modal when clicked on log out button
    $("#logoutButton").click(() => {
        $("#logoutModal").modal("toggle");
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

    $.each(
        permission.split("[")[1].split("]")[0].split('"').join("").split(","),
        (index, element) => {
            $("#permission option[value='" + element + "']").prop(
                "selected",
                true
            );
        }
    );
});

// JavaScript code
// Google Auth handler
function onGoogleSignIn(googleUser) {
    let student = googleUser.getBasicProfile();

    // console.log("ID: " + student.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("Name: " + student.getName());
    console.log("Image URL: " + student.getImageUrl());
    console.log("Email: " + student.getEmail()); // This is null if the 'email' scope is not present.
}
