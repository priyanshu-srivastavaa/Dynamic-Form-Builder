// =========================
// Keyboard Shortcuts
// =========================

document.addEventListener("keydown", function (e) {

    // Ctrl + Z
    if (e.ctrlKey && e.key.toLowerCase() === "z") {

        e.preventDefault();

        undoBtn.click();

    }

    // Ctrl + Y
    if (e.ctrlKey && e.key.toLowerCase() === "y") {

        e.preventDefault();

        redoBtn.click();

    }

    // Ctrl + S
    if (e.ctrlKey && e.key.toLowerCase() === "s") {

        e.preventDefault();

        saveBtn.click();

    }

    // Delete Selected Field
    if (e.key === "Delete") {

        if (!selectedField) return;

        const index = form.findIndex(f => f.id === selectedField);

        if (index === -1) return;

        saveHistory();

        form.splice(index, 1);

        selectedField = null;

        renderBuilder();

        renderPreview();
        saveToLocalStorage();

    }

});