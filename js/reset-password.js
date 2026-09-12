const resetPasswordForm =
    document.getElementById(
        "resetPasswordForm"
    );

const newPassword =
    document.getElementById(
        "newPassword"
    );

const confirmNewPassword =
    document.getElementById(
        "confirmNewPassword"
    );

const resetMessage =
    document.getElementById(
        "resetMessage"
    );

const toggleNewPassword =
    document.getElementById(
        "toggleNewPassword"
    );


/* GET TOKEN FROM URL */

const params =
    new URLSearchParams(
        window.location.search
    );

const resetToken =
    params.get("token");


if (!resetToken) {

    resetMessage.style.color =
        "#fb7185";

    resetMessage.textContent =
        "Reset token is missing";

    resetPasswordForm
        .querySelector(
            ".signup-create-btn"
        )
        .disabled = true;

}


/* SHOW / HIDE PASSWORD */

toggleNewPassword.addEventListener(
    "click",
    function() {

        if (
            newPassword.type ===
            "password"
        ) {

            newPassword.type =
                "text";

        } else {

            newPassword.type =
                "password";

        }

    }
);


/* RESET PASSWORD */

resetPasswordForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        resetMessage.textContent =
            "";


        if (
            newPassword.value.length <
            8
        ) {

            resetMessage.style.color =
                "#fb7185";

            resetMessage.textContent =
                "Password must be at least 8 characters";

            return;

        }


        if (
            newPassword.value !==
            confirmNewPassword.value
        ) {

            resetMessage.style.color =
                "#fb7185";

            resetMessage.textContent =
                "Passwords do not match";

            return;

        }


        const submitButton =
            resetPasswordForm.querySelector(
                ".signup-create-btn"
            );


        submitButton.disabled =
            true;


        submitButton.querySelector(
            "span"
        ).textContent =
            "Resetting...";


        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/auth/reset-password/${resetToken}`,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                password:
                                    newPassword.value
                            })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to reset password"
                );

            }


            resetMessage.style.color =
                "#4ade80";


            resetMessage.textContent =
                "Password reset successfully";


            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1200
            );

        }

       catch (error) {

    resetMessage.style.color =
        "#fb7185";

    resetMessage.textContent =
        error.message;


    submitButton.disabled =
        false;


    submitButton.querySelector(
        "span"
    ).textContent =
        "Reset Password";


    if (
        error.message
            .toLowerCase()
            .includes("expired") ||
        error.message
            .toLowerCase()
            .includes("invalid")
    ) {

        const oldLink =
            document.getElementById(
                "requestNewResetLink"
            );

        if (!oldLink) {

            const newLink =
                document.createElement(
                    "a"
                );

            newLink.id =
                "requestNewResetLink";

            newLink.href =
                "forgot-password.html";

            newLink.textContent =
                "Request a new reset link";

            newLink.style.display =
                "inline-block";

            newLink.style.marginTop =
                "10px";

            newLink.style.color =
                "#a78bfa";

            newLink.style.fontSize =
                "12px";

            newLink.style.fontWeight =
                "700";


            resetMessage.insertAdjacentElement(
                "afterend",
                newLink
            );

        }

    }

}

    }
);