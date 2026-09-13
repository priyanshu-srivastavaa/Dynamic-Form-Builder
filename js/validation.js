const RESPONSE_API_URL =
    "https://dynamic-form-builder-backend-1jjb.onrender.com/api/responses";


const FILE_UPLOAD_API_URL =
    "https://dynamic-form-builder-backend-1jjb.onrender.com/api/uploads";


const MAX_FILE_SIZE =
    10 * 1024 * 1024;


const ALLOWED_FILE_EXTENSIONS = [
    "pdf",
    "doc",
    "docx",
    "jpg",
    "jpeg",
    "png",
    "txt"
];


const DEFAULT_SUBMIT_BUTTON_HTML =
    submitBtn.innerHTML;


// ==========================================
// GET INPUTS
// ==========================================

function getPreviewInputs(
    field
) {

    // Matrix has separate radio group
    // for every row:
    // fieldId-0, fieldId-1, fieldId-2...
    if (
        field.type ===
        "matrix"
    ) {

        return Array.from(

            previewArea.querySelectorAll(
                `[name^="${field.id}-"]`
            )

        );

    }


    return Array.from(

        previewArea.querySelectorAll(
            `[name="${field.id}"]`
        )

    );

}


function getPreviewInput(
    field
) {

    const inputs =
        getPreviewInputs(
            field
        );


    return inputs.length

        ? inputs[0]

        : null;

}


// ==========================================
// FILE HELPERS
// ==========================================

function getFileExtension(
    fileName
) {

    const parts =
        String(
            fileName
        )
            .toLowerCase()
            .split(".");


    if (
        parts.length < 2
    ) {

        return "";

    }


    return parts.pop();

}


function validateSelectedFile(
    file
) {

    if (!file) {

        return {

            valid: false,

            message:
                "Please select a file"

        };

    }


    if (
        file.size >
        MAX_FILE_SIZE
    ) {

        return {

            valid: false,

            message:
                "File size must not exceed 10 MB"

        };

    }


    const extension =
        getFileExtension(
            file.name
        );


    if (
        !ALLOWED_FILE_EXTENSIONS
            .includes(
                extension
            )
    ) {

        return {

            valid: false,

            message:
                "Only PDF, DOC, DOCX, JPG, JPEG, PNG and TXT files are allowed"

        };

    }


    return {

        valid: true

    };

}


// ==========================================
// UPLOAD FILE
// ==========================================

async function uploadFileToBackend(
    file
) {

    const uploadData =
        new FormData();


    uploadData.append(
        "file",
        file
    );


    const response =
        await fetch(

            FILE_UPLOAD_API_URL,

            {

                method:
                    "POST",

                body:
                    uploadData

            }

        );


    let result =
        null;


    try {

        result =
            await response.json();

    }

    catch (error) {

        result =
            null;

    }


    if (
        !response.ok
    ) {

        throw new Error(

            result?.message ||

            "File upload failed"

        );

    }


    return result.data;

}
// ==========================================
// SIGNATURE DATA URL -> PNG FILE
// ==========================================

async function signatureDataUrlToFile(
    dataUrl,
    fieldId
) {

    const response =
        await fetch(
            dataUrl
        );


    const blob =
        await response.blob();


    return new File(
        [
            blob
        ],
        `signature-${fieldId}-${Date.now()}.png`,
        {
            type:
                "image/png"
        }
    );

}


// ==========================================
// GET RESPONSE VALUE
// ==========================================

function getFieldResponseValue(
    field
) {

    const inputs =
        getPreviewInputs(
            field
        );


    if (
        !inputs.length
    ) {

        return "";

    }


    if (
        field.type ===
        "checkbox"
    ) {

        return inputs[0]
            .checked;

    }


    if (
        field.type ===
        "multiselect"
    ) {

        return inputs

            .filter(
                input =>
                    input.checked
            )

            .map(
                input =>
                    input.value
            );

    }
    if (
    field.type ===
    "checkboxgroup"
) {

    return inputs
        .filter(
            input =>
                input.checked
        )
        .map(
            input =>
                input.value
        );

}


    if (
        field.type ===
        "radio"

        ||

        field.type ===
        "rating"

         ||

    field.type === 
    "scale"

    ||
    field.type === 
    "yesno"
    
    ||

    field.type ===
    "imagechoice"
    ) {

        const selected =
            inputs.find(
                input =>
                    input.checked
            );


        return selected

            ? selected.value

            : "";

    }


    if (
    field.type === "range"
) {
    return Number(
        inputs[0].value
    );
}
    if (
    field.type ===
    "matrix"
) {

    const group =
        previewArea.querySelector(
            `[data-matrix-field="${field.id}"]`
        );


    const rows =
        Array.isArray(field.rows)
            ? field.rows
            : [];


    const result =
        {};


    rows.forEach(
        function (
            row,
            rowIndex
        ) {

            const selected =
                group?.querySelector(
                    `input[name="${field.id}-${rowIndex}"]:checked`
                );


            result[row] =
                selected
                    ? selected.value
                    : "";

        }
    );


    return result;

}



    // ==========================================
    // ADDRESS RESPONSE FIX
    // ==========================================

    if (
        field.type ===
        "address"
    ) {

        const group =
            previewArea.querySelector(
                `[data-address-field="${field.id}"]`
            );


        if (!group) {

            return {

                addressLine: "",
                city: "",
                state: "",
                pincode: "",
                country: ""

            };

        }


        const addressLine =
            group.querySelector(
                ".address-line-input"
            );


        const city =
            group.querySelector(
                ".address-city-input"
            );


        const state =
            group.querySelector(
                ".address-state-input"
            );


        const pincode =
            group.querySelector(
                ".address-pincode-input"
            );


        const country =
            group.querySelector(
                ".address-country-input"
            );


        return {

            addressLine:
                addressLine?.value.trim() || "",

            city:
                city?.value.trim() || "",

            state:
                state?.value.trim() || "",

            pincode:
                pincode?.value.trim() || "",

            country:
                country?.value.trim() || ""

        };

    }


    if (
    field.type ===
    "name"
) {

    const group =
        previewArea.querySelector(
            `[data-name-field="${field.id}"]`
        );


    if (!group) {

        return {
            firstName: "",
            lastName: ""
        };

    }


    const firstName =
        group.querySelector(
            ".name-first-input"
        );


    const lastName =
        group.querySelector(
            ".name-last-input"
        );


    const result = {

        firstName:
            firstName?.value.trim() || "",

        lastName:
            lastName?.value.trim() || ""

    };


    if (
        field.includeMiddleName
    ) {

        const middleName =
            group.querySelector(
                ".name-middle-input"
            );


        result.middleName =
            middleName?.value.trim() || "";

    }


    return result;

}
return inputs[0].value;
}


// ==========================================
// FORM SUBMIT
// ==========================================

previewForm.addEventListener(
    "submit",
    async function (
        event
    ) {

        event.preventDefault();


        let isValid =
            true;


        // ======================================
        // VALIDATION
        // ======================================

        for (
            let i = 0;
            i < form.length;
            i++
        ) {

            const field =
                form[i];


            // Section Heading is NOT an answer.

            if (
                field.type ===
                "section"
            ) {

                continue;

            }


            const inputs =
                getPreviewInputs(
                    field
                );


            if (
                !inputs.length
            ) {

                continue;

            }


            const enabledInputs =
                inputs.filter(
                    input =>
                        !input.disabled
                );


            if (
                !enabledInputs.length
            ) {

                continue;

            }


            const input =
                enabledInputs[0];


            // ==================================
            // REQUIRED
            // ==================================

            if (
                field.type ===
                "time"
            ) {

                if (
                    field.required &&
                    !input.value
                ) {

                    showToast(

                        (
                            field.label ||
                            "Preferred Time"
                        ) +
                        " is required",

                        "error"

                    );


                    isValid =
                        false;


                    break;

                }


                continue;

            }


            if (
                field.required
            ) {

                if (
                    field.type ===
                    "checkbox"
                ) {

                    if (
                        !input.checked
                    ) {

                        showToast(

                            (
                                field.label ||
                                "This field"
                            ) +
                            " is required",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }

                }


                else if (
                    field.type ===
                    "radio"

                    ||

                    field.type ===
                    "rating"

                     ||

                    field.type === 
                    "scale"

                    ||

                    field.type ===
                     "yesno"

                    ||

                 field.type ===
                 "imagechoice"
                ) {

                    const selected =
                        enabledInputs.some(
                            item =>
                                item.checked
                        );


                    if (
                        !selected
                    ) {

                        showToast(

                            (
                                field.label ||
                                "This field"
                            ) +
                            " is required",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }

                }

                else if (
    field.type ===
    "matrix"
) {

    const group =
        previewArea.querySelector(
            `[data-matrix-field="${field.id}"]`
        );

    const rows =
        Array.isArray(field.rows)
            ? field.rows
            : [];

    let allRowsSelected =
        true;


    rows.forEach(
        function (
            row,
            rowIndex
        ) {

            const selected =
                group?.querySelector(
                    `input[name="${field.id}-${rowIndex}"]:checked`
                );

            if (
                !selected
            ) {

                allRowsSelected =
                    false;

            }

        }
    );


    if (
        !allRowsSelected
    ) {

        showToast(
            (
                field.label ||
                "Matrix"
            ) +
            ": please select an option for every row",
            "error"
        );

        isValid =
            false;

        break;

    }

}


                else if (
                    field.type ===
                    "multiselect"
                ) {

                    const selected =
                        enabledInputs.some(
                            item =>
                                item.checked
                        );


                    if (
                        !selected
                    ) {

                        showToast(

                            (
                                field.label ||
                                "Multi Select"
                            ) +
                            " is required",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }

                }
                else if (
    field.type ===
    "checkboxgroup"
) {

    const selected =
        enabledInputs.some(
            item =>
                item.checked
        );

    if (
        !selected
    ) {

        showToast(
            (
                field.label ||
                "Checkbox Group"
            ) +
            " is required",

            "error"
        );

        isValid =
            false;

        break;
    }

}
else if (
    field.type ===
    "range"
) {

    const touched =
        input.dataset.rangeTouched ===
        "true";

    if (
        !touched
    ) {

        showToast(
            (
                field.label ||
                "Range Slider"
            ) +
            ": please select a value",
            "error"
        );

        isValid =
            false;

        break;
    }

}


                else if (
                    field.type ===
                    "address"
                ) {

                    const group =
                        previewArea.querySelector(
                            `[data-address-field="${field.id}"]`
                        );


                    const addressLine =
                        group?.querySelector(
                            ".address-line-input"
                        )?.value.trim();


                    const city =
                        group?.querySelector(
                            ".address-city-input"
                        )?.value.trim();


                    const state =
                        group?.querySelector(
                            ".address-state-input"
                        )?.value.trim();


                    const pincode =
                        group?.querySelector(
                            ".address-pincode-input"
                        )?.value.trim();


                    const country =
                        group?.querySelector(
                            ".address-country-input"
                        )?.value.trim();


                    if (
                        !addressLine ||
                        !city ||
                        !state ||
                        !pincode ||
                        !country
                    ) {

                        showToast(

                            (
                                field.label ||
                                "Address"
                            ) +
                            " is required",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }

                }

                else if (
    field.type ===
    "name"
) {

    const group =
        previewArea.querySelector(
            `[data-name-field="${field.id}"]`
        );


    const firstName =
        group?.querySelector(
            ".name-first-input"
        )?.value.trim();


    const lastName =
        group?.querySelector(
            ".name-last-input"
        )?.value.trim();


    if (
        !firstName ||
        !lastName
    ) {

        showToast(
            (
                field.label ||
                "Full Name"
            ) +
            " is required",
            "error"
        );


        isValid =
            false;


        break;

    }

}

else if (
    field.type === "signature"
) {

    const group =
        previewArea.querySelector(
            `[data-signature-field="${field.id}"]`
        );

    const hiddenInput =
        group?.querySelector(
            'input[type="hidden"]'
        );

    const uploadInput =
        group?.querySelector(
            ".signature-upload-input"
        );

    const mode =
        hiddenInput?.dataset.signatureMode ||
        "draw";


    let hasSignature =
        false;


    if (
        mode === "draw"
    ) {

        hasSignature =
            Boolean(
                hiddenInput?.value
            );

    }

    else {

        hasSignature =
            Boolean(
                uploadInput?.files &&
                uploadInput.files.length
            );

    }


    if (
        !hasSignature
    ) {

        showToast(
            (
                field.label ||
                "Signature"
            ) +
            " is required",
            "error"
        );

        isValid =
            false;

        break;

    }

}


                else if (
                    field.type ===
                    "file"
                ) {

                    if (
                        !input.files ||
                        !input.files.length
                    ) {

                        showToast(

                            (
                                field.label ||
                                "File Upload"
                            ) +
                            " is required",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }

                }


                else if (
                    input.value.trim() ===
                    ""
                ) {

                    showToast(

                        (
                            field.label ||
                            "This field"
                        ) +
                        " is required",

                        "error"

                    );


                    isValid =
                        false;


                    break;

                }

            }


            // ==================================
            // FILE
            // ==================================

            if (
                field.type ===
                "file"

                &&

                input.files

                &&

                input.files.length
            ) {

                const file =
                    input.files[0];


                const fileValidation =
                    validateSelectedFile(
                        file
                    );


                if (
                    !fileValidation.valid
                ) {

                    showToast(

                        (
                            field.label ||
                            "File Upload"
                        ) +
                        ": " +
                        fileValidation.message,

                        "error"

                    );


                    isValid =
                        false;


                    break;

                }

            }


            // ==================================
            // TEXT / TEXTAREA
            // ==================================

            if (
                field.type ===
                "text"

                ||

                field.type ===
                "textarea"
                ||
                field.type === "password"
            ) {

                const value =
                    input.value
                        .trim();


                if (
                    value !== ""
                ) {

                   const minLength =
    field.type === "password"
        ? Math.max(
            6,
            Number(field.minLength ?? 6)
        )
        : Number(
            field.minLength ?? 0
        );


                    const maxLength =
                        Number(

                            field.maxLength ??

                            (
                                field.type ===
                                "textarea"

                                     ? 500

                                : field.type === "password"
                                     ? 50
                                     : 100
                            )

                        );


                    if (
                        value.length <
                        minLength
                    ) {

                        showToast(

                            (
                                field.label ||
                                "Field"
                            ) +

                            " minimum " +

                            minLength +

                            " characters required",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }


                    if (
                        value.length >
                        maxLength
                    ) {

                        showToast(

                            (
                                field.label ||
                                "Field"
                            ) +

                            " maximum " +

                            maxLength +

                            " characters allowed",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }

                }

            }


            // ==================================
            // EMAIL
            // ==================================

            if (
                field.type ===
                "email"
            ) {

                const value =
                    input.value
                        .trim();


                if (
                    value !== ""
                ) {

                    const emailPattern =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                    if (
                        !emailPattern.test(
                            value
                        )
                    ) {

                        showToast(

                            (
                                field.label ||
                                "Email Field"
                            ) +

                            " must be a valid email address",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }

                }

            }


            // ==================================
            // PHONE
            // ==================================

            if (
                field.type ===
                "phone"
            ) {

                const value =
                    input.value
                        .trim();


                if (
                    value !== ""
                ) {

                    const phonePattern =
                        /^\+?[0-9\s()\-]+$/;


                    const digitsOnly =
                        value.replace(
                            /\D/g,
                            ""
                        );


                    if (
                        !phonePattern.test(
                            value
                        )

                        ||

                        digitsOnly.length <
                        7

                        ||

                        digitsOnly.length >
                        15
                    ) {

                        showToast(

                            (
                                field.label ||
                                "Phone Field"
                            ) +

                            " must be a valid phone number",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }

                }

            }


            // ==================================
            // URL
            // ==================================

            if (
                field.type ===
                "url"
            ) {

                const value =
                    input.value
                        .trim();


                if (
                    value !== ""
                ) {

                    let validUrl =
                        false;


                    try {

                        const parsedUrl =
                            new URL(
                                value
                            );


                        validUrl =

                            parsedUrl.protocol ===
                                "http:"

                            ||

                            parsedUrl.protocol ===
                                "https:";

                    }

                    catch (error) {

                        validUrl =
                            false;

                    }


                    if (
                        !validUrl
                    ) {

                        showToast(

                            (
                                field.label ||
                                "Website URL"
                            ) +

                            " must be a valid URL starting with http:// or https://",

                            "error"

                        );


                        isValid =
                            false;


                        break;

                    }

                }

            }


            // ==================================
            // NUMBER
            // ==================================

            if (
                field.type ===
                "number"
                 ||
               field.type === "currency"
                ||
                field.type === "range"
            ) {

                if (
                    input.value.trim() ===
                    ""
                ) {

                    continue;

                }


                const value =
                    Number(
                        input.value
                    );


                const minValue =
                    Number(
                        field.minValue ??
                        0
                    );


                const maxValue =
                    Number(
                        field.maxValue ??
                        100
                    );


                if (
                    value <
                    minValue
                ) {

                    showToast(

                        (
                            field.label ||
                            "Number Field"
                        ) +

                        " must be at least " +

                        minValue,

                        "error"

                    );


                    isValid =
                        false;


                    break;

                }


                if (
                    value >
                    maxValue
                ) {

                    showToast(

                        (
                            field.label ||
                            "Number Field"
                        ) +

                        " must not exceed " +

                        maxValue,

                        "error"

                    );


                    isValid =
                        false;


                    break;

                }

            }

        }


        if (
            !isValid
        ) {

            return;

        }


        // ======================================
        // DATABASE FORM ID
        // ======================================

        const currentFormId =
            localStorage.getItem(
                "currentDatabaseFormId"
            );


        if (
            !currentFormId
        ) {

            showToast(

                "Please Save or Load the form before submitting a response",

                "warning"

            );


            return;

        }


        submitBtn.disabled =
            true;


        submitBtn.innerHTML =
            "Submitting...";


        try {

            const answers =
                [];


            for (
                let i = 0;
                i < form.length;
                i++
            ) {

                const field =
                    form[i];


                // ==================================
                // IMPORTANT:
                // NEVER SAVE SECTION AS ANSWER
                // ==================================

                if (
                    field.type ===
                    "section"
                ) {

                    continue;

                }


                const inputs =
                    getPreviewInputs(
                        field
                    );


                if (
                    !inputs.length
                ) {

                    continue;

                }


                const enabledInputs =
                    inputs.filter(
                        input =>
                            !input.disabled
                    );


                if (
                    !enabledInputs.length
                ) {

                    continue;

                }


                // ==================================
                // FILE UPLOAD
                // ==================================

                if (
                    field.type ===
                    "file"
                ) {

                    const file =
                        enabledInputs[0]
                            .files?.[0];


                    if (
                        !file
                    ) {

                        answers.push({

                            fieldId:
                                field.id,

                            label:
                                field.label ||
                                "File Upload",

                            value:
                                null

                        });


                        continue;

                    }


                    submitBtn.innerHTML =
                        "Uploading file...";


                    const uploadedFile =
                        await uploadFileToBackend(
                            file
                        );


                    answers.push({

                        fieldId:
                            field.id,

                        label:
                            field.label ||
                            "File Upload",

                        value: {

                            originalName:
                                uploadedFile.originalName,

                            storedName:
                                uploadedFile.storedName,

                            mimeType:
                                uploadedFile.mimeType,

                            size:
                                uploadedFile.size,

                            url:
                                uploadedFile.url

                        }

                    });


                    continue;

                }
               // ==================================
// SIGNATURE UPLOAD
// ==================================

if (
    field.type ===
    "signature"
) {

    const group =
        previewArea.querySelector(
            `[data-signature-field="${field.id}"]`
        );


    const hiddenInput =
        group?.querySelector(
            'input[type="hidden"]'
        );


    const uploadInput =
        group?.querySelector(
            ".signature-upload-input"
        );


    const mode =
        hiddenInput?.dataset.signatureMode ||
        "draw";


    let signatureFile =
        null;


    // DRAW MODE
    if (
        mode === "draw"
    ) {

        const signatureData =
            hiddenInput?.value;


        if (
            !signatureData
        ) {

            answers.push({

                fieldId:
                    field.id,

                label:
                    field.label ||
                    "Signature",

                value:
                    null

            });


            continue;

        }


        signatureFile =
            await signatureDataUrlToFile(
                signatureData,
                field.id
            );

    }


    // UPLOAD MODE
    else {

        const selectedFile =
            uploadInput?.files?.[0];


        if (
            !selectedFile
        ) {

            answers.push({

                fieldId:
                    field.id,

                label:
                    field.label ||
                    "Signature",

                value:
                    null

            });


            continue;

        }


        const extension =
            getFileExtension(
                selectedFile.name
            );


        if (
            ![
                "png",
                "jpg",
                "jpeg"
            ].includes(
                extension
            )
        ) {

            throw new Error(
                "Signature must be PNG, JPG or JPEG"
            );

        }


        if (
            selectedFile.size >
            MAX_FILE_SIZE
        ) {

            throw new Error(
                "Signature image must not exceed 10 MB"
            );

        }


        signatureFile =
            selectedFile;

    }


    submitBtn.innerHTML =
        "Uploading signature...";


    const uploadedSignature =
        await uploadFileToBackend(
            signatureFile
        );


    answers.push({

        fieldId:
            field.id,

        label:
            field.label ||
            "Signature",

        value: {

            originalName:
                uploadedSignature.originalName,

            storedName:
                uploadedSignature.storedName,

            mimeType:
                uploadedSignature.mimeType,

            size:
                uploadedSignature.size,

            url:
                uploadedSignature.url

        }

    });


    continue;

}


                // ==================================
                // NORMAL ANSWER
                // ==================================

                answers.push({

                    fieldId:
                        field.id,

                    label:
                        field.label ||
                        "Untitled Field",

                    value:
                        getFieldResponseValue(
                            field
                        )

                });

            }


            const requestData = {

                formId:
                    currentFormId,

                answers:
                    answers

            };


            submitBtn.innerHTML =
                "Saving response...";


            const response =
                await fetch(

                    RESPONSE_API_URL,

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                requestData
                            )

                    }

                );


            let result =
                null;


            try {

                result =
                    await response.json();

            }

            catch (error) {

                result =
                    null;

            }


            if (
                !response.ok
            ) {

                throw new Error(

                    result?.message ||

                    "Unable to submit form response"

                );

            }


            showToast(

                "✅ Form Response Submitted Successfully"

            );


            if (
                typeof applyRules ===
                "function"
            ) {

                applyRules();

            }

        }

        catch (error) {

            console.error(

                "Submit response error:",

                error

            );


            showToast(

                error.message ||

                "Unable to submit form",

                "error"

            );

        }

        finally {

            submitBtn.disabled =
                false;


            submitBtn.innerHTML =
                DEFAULT_SUBMIT_BUTTON_HTML;

        }

    }
);