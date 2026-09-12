const LOGIN_API_URL =
    "https://dynamic-form-builder-backend-ljb.onrender.com/api/auth/login";


const loginForm =
    document.getElementById(
        "loginForm"
    );


const loginEmail =
    document.getElementById(
        "loginEmail"
    );


const loginPassword =
    document.getElementById(
        "loginPassword"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


const toggleLoginPassword =
    document.getElementById(
        "toggleLoginPassword"
    );


const rememberMe =
    document.getElementById(
        "rememberMe"
    );

const authMessage =
    sessionStorage.getItem(
        "authMessage"
    );

if (authMessage) {

    loginMessage.style.color =
        "#fbbf24";

    loginMessage.textContent =
        authMessage;

    sessionStorage.removeItem(
        "authMessage"
    );

}



/* ==========================================
   SHOW / HIDE PASSWORD
========================================== */

toggleLoginPassword.addEventListener(
    "click",
    function() {

        const showPassword =
            loginPassword.type ===
            "password";


        loginPassword.type =
            showPassword
                ? "text"
                : "password";


        toggleLoginPassword.setAttribute(
            "aria-label",
            showPassword
                ? "Hide password"
                : "Show password"
        );

    }
);



/* ==========================================
   REMEMBER EMAIL
========================================== */

const rememberedEmail =
    localStorage.getItem(
        "rememberedLoginEmail"
    );


if (rememberedEmail) {

    loginEmail.value =
        rememberedEmail;

    rememberMe.checked =
        true;

}



/* ==========================================
   LOGIN
========================================== */

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        loginMessage.style.color =
            "#b8c4db";


        loginMessage.textContent =
            "Signing in...";


        const submitButton =
            loginForm.querySelector(
                ".signup-create-btn"
            );


        submitButton.disabled =
            true;


        submitButton.querySelector(
            "span"
        ).textContent =
            "Signing in...";


        try {

            const response =
                await fetch(
                    LOGIN_API_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                email:
                                    loginEmail.value.trim(),

                                password:
                                    loginPassword.value

                            })

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Login failed"
                );

            }



            /* SAVE TOKEN */

            localStorage.setItem(
                "authToken",
                result.token
            );


            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(
                    result.data
                )
            );



            /* REMEMBER EMAIL */

            if (
                rememberMe.checked
            ) {

                localStorage.setItem(
                    "rememberedLoginEmail",
                    loginEmail.value.trim()
                );

            }

            else {

                localStorage.removeItem(
                    "rememberedLoginEmail"
                );

            }



            loginMessage.style.color =
                "#4ade80";


            loginMessage.textContent =
                "Login successful. Redirecting...";


            setTimeout(
                function() {

                    window.location.href =
                        "dashboard.html";

                },
                700
            );

        }

        catch (error) {

            loginMessage.style.color =
                "#fb7185";


            loginMessage.textContent =
                error.message ||
                "Unable to login";


            submitButton.disabled =
                false;


            submitButton.querySelector(
                "span"
            ).textContent =
                "Sign in";

        }

    }
);