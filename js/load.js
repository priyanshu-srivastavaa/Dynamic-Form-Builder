// ==========================================
// Load Form From MongoDB
// ==========================================

const LOAD_API_URL = "http://localhost:5000/api/forms";

async function loadFormById(
    formId
) {

    try {

       const response =
                await fetch(
                    `${LOAD_API_URL}/${formId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem(
                                    "authToken"
                                )}`
                        }
                    }
                );

            if (handleAuthFailure(response)) return;

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to load form"
            );

        }

        const selectedForm =
            result.data;

        if (!selectedForm) {

            throw new Error(
                "Form not found"
            );

        }

        form =
            Array.isArray(
                selectedForm.fields
            )
                ? selectedForm.fields
                : [];

        selectedField = null;

        localStorage.setItem(
            "currentDatabaseFormId",
            selectedForm._id
        );

        localStorage.setItem(
            "currentDatabaseFormTitle",
            selectedForm.title ||
            "Untitled Form"
        );

        renderBuilder();

        renderPreview();

        if (
            typeof updateSelectedSummary ===
            "function"
        ) {

            updateSelectedSummary(
                null
            );

        }

        labelInput.value = "";
        placeholderInput.value = "";
        requiredInput.checked = false;

        dropdownOptions.style.display =
            "none";

        showToast(
            `✅ "${selectedForm.title}" loaded successfully`
        );

    }

    catch (error) {

        console.error(
            "Dashboard form load error:",
            error
        );

        showToast(
            error.message ||
            "Unable to load form",
            "error"
        );

    }

}

loadBtn.addEventListener("click", async function () {

    loadBtn.disabled = true;
    loadBtn.innerHTML = "⏳ Loading...";

    try {

       const response =
    await fetch(
        LOAD_API_URL,
        {
            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem(
                        "authToken"
                    )}`
            }
        }
    );
    if (handleAuthFailure(response)) return;

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.message || "Unable to load forms"
            );

        }

        const savedForms = result.data;

        if (!Array.isArray(savedForms) || savedForms.length === 0) {

            showToast(
                "No forms found in database",
                "warning"
            );

            return;

        }

        // Saved forms ki numbered list banegi
        const formList = savedForms
            .map(function (savedForm, index) {

                return `${index + 1}. ${savedForm.title}`;

            })
            .join("\n");

        const selectedNumber = prompt(
            `Select a form to load:\n\n${formList}\n\nEnter form number:`
        );

        // Cancel button press hone par
        if (selectedNumber === null) {

            return;

        }

        const selectedIndex =
            Number(selectedNumber) - 1;

        if (
            !Number.isInteger(selectedIndex) ||
            selectedIndex < 0 ||
            selectedIndex >= savedForms.length
        ) {

            showToast(
                "Please enter a valid form number",
                "warning"
            );

            return;

        }

        const selectedForm =
            savedForms[selectedIndex];

        // MongoDB ke fields canvas ke form array me load honge
        form = Array.isArray(selectedForm.fields)
            ? selectedForm.fields
            : [];

        selectedField = null;

        // Current database form ID future update ke liye
        localStorage.setItem(
            "currentDatabaseFormId",
            selectedForm._id
        );

        localStorage.setItem(
            "currentDatabaseFormTitle",
            selectedForm.title || "Untitled Form"
        );

        renderBuilder();

        renderPreview();

        if (typeof updateSelectedSummary === "function") {

            updateSelectedSummary(null);

        }

        labelInput.value = "";
        placeholderInput.value = "";
        requiredInput.checked = false;

        dropdownOptions.style.display = "none";

        showToast(
            `✅ "${selectedForm.title}" loaded successfully`
        );

        console.log(
            "Loaded database form:",
            selectedForm
        );

    }
    catch (error) {

        console.error(
            "Load form error:",
            error
        );

        showToast(
            error.message ||
            "Backend server is not available",
            "error"
        );

    }
    finally {

        loadBtn.disabled = false;

        loadBtn.innerHTML =
            "<span>📂</span> Load";

    }

});
// ==========================================
// LOAD FORM FROM DASHBOARD EDIT
// ==========================================

const dashboardEditFormId =
    localStorage.getItem(
        "dashboardEditFormId"
    );

if (dashboardEditFormId) {

    localStorage.removeItem(
        "dashboardEditFormId"
    );

    loadFormById(
        dashboardEditFormId
    );

}