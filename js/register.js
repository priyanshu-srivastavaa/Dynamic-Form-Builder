const REGISTER_API_URL =
    `${FORMIFY_API_BASE_URL}/api/auth/register`;


const registerForm =
    document.getElementById(
        "registerForm"
    );

const registerName =
    document.getElementById(
        "registerName"
    );

const registerEmail =
    document.getElementById(
        "registerEmail"
    );

const registerPassword =
    document.getElementById(
        "registerPassword"
    );

const confirmPassword =
    document.getElementById(
        "confirmPassword"
    );

const registerMessage =
    document.getElementById(
        "registerMessage"
    );

const termsCheckbox =
    document.getElementById(
        "termsCheckbox"
    );


const toggleRegisterPassword =
    document.getElementById(
        "toggleRegisterPassword"
    );

const toggleConfirmPassword =
    document.getElementById(
        "toggleConfirmPassword"
    );


const strengthBar1 =
    document.getElementById(
        "strengthBar1"
    );

const strengthBar2 =
    document.getElementById(
        "strengthBar2"
    );

const strengthBar3 =
    document.getElementById(
        "strengthBar3"
    );


const passwordStrengthText =
    document.getElementById(
        "passwordStrengthText"
    );


const ruleLength =
    document.getElementById(
        "ruleLength"
    );

const ruleNumber =
    document.getElementById(
        "ruleNumber"
    );

const ruleSymbol =
    document.getElementById(
        "ruleSymbol"
    );


function togglePassword(
    input,
    button
) {

    const showPassword =
        input.type === "password";


    input.type =
        showPassword
            ? "text"
            : "password";


    button.setAttribute(
        "aria-label",
        showPassword
            ? "Hide password"
            : "Show password"
    );

}


toggleRegisterPassword.addEventListener(
    "click",
    function() {

        togglePassword(
            registerPassword,
            toggleRegisterPassword
        );

    }
);


toggleConfirmPassword.addEventListener(
    "click",
    function() {

        togglePassword(
            confirmPassword,
            toggleConfirmPassword
        );

    }
);



function updatePasswordStrength() {

    const password =
        registerPassword.value;


    const hasLength =
        password.length >= 8;

    const hasNumber =
        /\d/.test(
            password
        );

    const hasSymbol =
        /[^A-Za-z0-9]/.test(
            password
        );


    ruleLength.classList.toggle(
        "valid",
        hasLength
    );

    ruleNumber.classList.toggle(
        "valid",
        hasNumber
    );

    ruleSymbol.classList.toggle(
        "valid",
        hasSymbol
    );


    let strength = 0;


    if (hasLength) {
        strength++;
    }

    if (hasNumber) {
        strength++;
    }

    if (hasSymbol) {
        strength++;
    }


    strengthBar1.classList.toggle(
        "active",
        strength >= 1
    );

    strengthBar2.classList.toggle(
        "active",
        strength >= 2
    );

    strengthBar3.classList.toggle(
        "active",
        strength >= 3
    );


    if (!password) {

        passwordStrengthText.textContent =
            "—";

    }

    else if (strength === 1) {

        passwordStrengthText.textContent =
            "Weak";

    }

    else if (strength === 2) {

        passwordStrengthText.textContent =
            "Good";

    }

    else if (strength === 3) {

        passwordStrengthText.textContent =
            "Strong";

    }

    else {

        passwordStrengthText.textContent =
            "Weak";

    }

}


registerPassword.addEventListener(
    "input",
    updatePasswordStrength
);
registerPassword.addEventListener(
    "change",
    updatePasswordStrength
);

updatePasswordStrength();


registerForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        registerMessage.textContent =
            "";


        const name =
            registerName.value.trim();

        const email =
            registerEmail.value.trim();

        const password =
            registerPassword.value;

        const confirm =
            confirmPassword.value;


        if (
            !name ||
            !email ||
            !password ||
            !confirm
        ) {

            registerMessage.textContent =
                "Please fill all fields.";

            return;

        }


        if (password.length < 8) {

            registerMessage.textContent =
                "Password must contain at least 8 characters.";

            return;

        }


        if (
            !/\d/.test(
                password
            )
        ) {

            registerMessage.textContent =
                "Password must contain at least one number.";

            return;

        }


        if (
            !/[^A-Za-z0-9]/.test(
                password
            )
        ) {

            registerMessage.textContent =
                "Password must contain at least one symbol.";

            return;

        }


        if (
            password !== confirm
        ) {

            registerMessage.textContent =
                "Passwords do not match.";

            return;

        }


        if (
            !termsCheckbox.checked
        ) {

            registerMessage.textContent =
                "Please accept Terms of Service and Privacy Policy.";

            return;

        }


        const submitButton =
            registerForm.querySelector(
                ".signup-create-btn"
            );


        submitButton.disabled =
            true;


        submitButton.querySelector(
            "span"
        ).textContent =
            "Creating account...";


        try {

            const response =
                await fetch(
                    REGISTER_API_URL,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                name:
                                    name,

                                email:
                                    email,

                                password:
                                    password

                            })

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to create account"
                );

            }


            registerMessage.style.color =
                "#4ade80";


            registerMessage.textContent =
                "Account created successfully. Redirecting...";


            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1000
            );

        }

        catch (error) {

            registerMessage.style.color =
                "#fb7185";


            registerMessage.textContent =
                error.message ||
                "Unable to register";
        }


                submitButton.disabled =
                false;

            submitButton.querySelector(
                "span"
            ).textContent =
                "Create Account";
            }
);