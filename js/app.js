// ==========================================
// APP INITIALIZATION
// ==========================================

loadFromLocalStorage();

renderBuilder();

renderPreview();


// ==========================================
// CLEAR FORM
// ==========================================

clearBtn.addEventListener("click", function () {

    const confirmed = confirm(
        "Clear the current form from the canvas? " +
        "Your manually saved version will remain available."
    );

    if (!confirmed) return;

    form = [];

    selectedField = null;

    renderBuilder();

    renderPreview();

    if (typeof updateSelectedSummary === "function") {

        updateSelectedSummary(null);

    }

    showToast(
        "Canvas cleared. Use Load to restore the saved form.",
        "warning"
    );

});


// ==========================================
// TOAST
// ==========================================

function showToast(message, type = "success") {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.className = "";

    toast.classList.add("show");

    if (type === "error") {

        toast.classList.add("error");

    }

    if (type === "warning") {

        toast.classList.add("warning");

    }

    clearTimeout(showToast.timeoutId);

    showToast.timeoutId = setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);

}


// ==========================================
// DELETE FIELD MODAL
// ==========================================

confirmDelete.addEventListener("click", function () {

    if (
        deleteIndex !== null &&
        form[deleteIndex]
    ) {

        saveHistory();

        const deletedField =
            form[deleteIndex];

        form.splice(deleteIndex, 1);

        if (
            selectedField ===
            deletedField.id
        ) {

            selectedField = null;

            labelInput.value = "";

            placeholderInput.value = "";

            requiredInput.checked = false;

            dropdownOptions.style.display =
                "none";

            if (
                typeof updateSelectedSummary ===
                "function"
            ) {

                updateSelectedSummary(null);

            }

        }

        renderBuilder();

        renderPreview();

        saveToLocalStorage();

        showToast("Field deleted");

    }

    closeDeleteModal();

});


cancelDelete.addEventListener(
    "click",
    closeDeleteModal
);


deleteModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            deleteModal
        ) {

            closeDeleteModal();

        }

    }
);


function closeDeleteModal() {

    deleteModal.classList.remove("show");

    deleteIndex = null;

}


// ==========================================
// COMPONENTS PANEL COLLAPSE
// ==========================================

toggleComponents.addEventListener(
    "click",
    function () {

        componentsPanel.classList.toggle(
            "collapsed"
        );

        const collapsed =
            componentsPanel.classList.contains(
                "collapsed"
            );

        document.body.classList.toggle(
            "components-collapsed",
            collapsed
        );

        toggleComponents.title =
            collapsed
                ? "Expand Components"
                : "Collapse Components";

    }
);


// ==========================================
// PROPERTIES PANEL COLLAPSE
// ==========================================

toggleProperties.addEventListener(
    "click",
    function () {

        propertiesPanel.classList.toggle(
            "collapsed"
        );

        const collapsed =
            propertiesPanel.classList.contains(
                "collapsed"
            );

        document.body.classList.toggle(
            "properties-collapsed",
            collapsed
        );

        toggleProperties.title =
            collapsed
                ? "Expand Inspector"
                : "Collapse Inspector";

    }
);


// ==========================================
// PREVIEW MODAL
// ==========================================

previewBtn.addEventListener(
    "click",
    function () {

        renderPreview();

        previewModal.classList.add(
            "show"
        );

        document.body.classList.add(
            "preview-open"
        );

    }
);


closePreviewBtn.addEventListener(
    "click",
    closePreviewModal
);


previewModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            previewModal
        ) {

            closePreviewModal();

        }

    }
);


function closePreviewModal() {

    previewModal.classList.remove(
        "show"
    );

    document.body.classList.remove(
        "preview-open"
    );

}


// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {

            return;

        }

        if (
            previewModal.classList.contains(
                "show"
            )
        ) {

            closePreviewModal();

        }

        if (
            deleteModal.classList.contains(
                "show"
            )
        ) {

            closeDeleteModal();

        }

    }
);