// jQuery code
$(document).ready(() => {
    // Display log out modal when clicked on username in dashboard page
    $("#dashboardUsername").click(() => {
        $("#logoutModal").modal("toggle");
    });

    // Fetch request for user to log out in dashboard page
    $("#dashboardLogoutBtn").click(() => {
        fetch("/logout")
            .then((response) => {
                if (response.status === 200) {
                    window.location.href = "/";
                }
            })
            .catch((error) => console.error(error));
    });
});

// JavaScript code
// ...
