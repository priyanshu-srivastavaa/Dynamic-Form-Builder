importBtn.addEventListener("click", function () {
    importFile.click();
});

importFile.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (loadEvent) {
        try {
            const data = JSON.parse(loadEvent.target.result);

            if (!Array.isArray(data)) {
                throw new Error("Imported JSON must contain a form array");
            }

            form = data;
            selectedField = null;

            renderBuilder();
            renderPreview();
            updateSelectedSummary(null);
            saveToLocalStorage();

            showToast("Form imported successfully");
        } catch (error) {
            console.error(error);
            showToast("Invalid JSON file", "error");
        } finally {
            importFile.value = "";
        }
    };

    reader.readAsText(file);
});
