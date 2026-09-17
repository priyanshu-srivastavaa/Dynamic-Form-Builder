function handleAuthFailure(response) {



    if (
        response.status === 401 ||
        response.status === 403
    ) {

        localStorage.removeItem(
            "authToken"
        );

        localStorage.removeItem(
            "loggedInUser"
        );

        localStorage.removeItem(
            "currentDatabaseFormId"
        );

        localStorage.removeItem(
            "dashboardEditFormId"
        );

        sessionStorage.setItem(
            "authMessage",
            "Your session expired. Please sign in again."
        );

        window.location.replace(
            "login.html"
        );

        return true;

    }

    return false;

}