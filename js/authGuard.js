async function verifyAuth() {

    const token =
        localStorage.getItem(
            "authToken"
        );


    if (!token) {

        window.location.replace(
            "login.html"
        );

        return;

    }


    try {


        const response =
            await fetch(
                `${FORMIFY_API_BASE_URL}/api/auth/profile`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

           


        if (!response.ok) {

            throw new Error(
                "Invalid or expired token"
            );

        }

    }

    catch (error) {

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

    }


}


verifyAuth();