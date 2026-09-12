// ==========================================
// Save Form To MongoDB
// ==========================================

const API_URL = "https://dynamic-form-builder-backend-ljb.onrender.com/api/forms";

saveBtn.addEventListener("click", async function () {

    if (!Array.isArray(form) || form.length === 0) {

        showToast(
            "Please add at least one field before saving",
            "warning"
        );

        return;

    }

    const formTitle = prompt(
        "Enter form title:",
        "Untitled Form"
    );

    if (formTitle === null) {
        return;
    }

    const requestData = {
        title: formTitle.trim() || "Untitled Form",
        description: "",
        fields: form
    };

    saveBtn.disabled = true;
    saveBtn.innerHTML = "⏳ Saving...";

    try {

       const currentFormId =
    localStorage.getItem(
        "currentDatabaseFormId"
    );

const requestUrl =
    currentFormId
        ? `${API_URL}/${currentFormId}`
        : API_URL;

const requestMethod =
    currentFormId
        ? "PUT"
        : "POST";

const response =
    await fetch(
        requestUrl,
        {
            method:
                requestMethod,

            headers: {
                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${localStorage.getItem(
                        "authToken"
                    )}`
            },

            body:
                JSON.stringify(
                    requestData
                )
        }
    );
    if (handleAuthFailure(response)) return;
        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.message || "Unable to save form"
            );

        }

        // Database form ID future update/load ke liye save hoga
        localStorage.setItem(
            "currentDatabaseFormId",
            result.data._id
        );

        showToast(
    currentFormId
        ? "✅ Form Updated Successfully"
        : "✅ Form Saved Successfully"
);

        console.log(
            "Saved database form:",
            result.data
        );

    }
    catch (error) {

        console.error(
            "Save form error:",
            error
        );

        showToast(
            error.message ||
            "Backend server is not available",
            "error"
        );

    }
    finally {

        saveBtn.disabled = false;
        saveBtn.innerHTML = "<span>💾</span> Save";

    }

});
