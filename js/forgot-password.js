const FORGOT_PASSWORD_API =
    "https://dynamic-form-builder-backend-ljb.onrender.com/api/auth/forgot-password";


const forgotPasswordForm =
    document.getElementById(
        "forgotPasswordForm"
    );


const forgotEmail =
    document.getElementById(
        "forgotEmail"
    );


const forgotMessage =
    document.getElementById(
        "forgotMessage"
    );


forgotPasswordForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        forgotMessage.style.color =
            "#b8c4db";


        forgotMessage.textContent =
            "Generating reset link...";


        const submitButton =
            forgotPasswordForm.querySelector(
                ".signup-create-btn"
            );


        submitButton.disabled =
            true;


        try {

            const response =
                await fetch(
                    FORGOT_PASSWORD_API,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email:
                                    forgotEmail.value.trim()
                            })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to create reset link"
                );

            }


            forgotMessage.style.color =
                "#4ade80";

            forgotMessage.textContent =
                "Reset link sent. Please check your email.";

            forgotEmail.value = "";

        }

        catch (error) {

            forgotMessage.style.color =
                "#fb7185";


            forgotMessage.textContent =
                error.message;

            }


           finally {

                submitButton.disabled =
                    false;

            }

        

    }
);