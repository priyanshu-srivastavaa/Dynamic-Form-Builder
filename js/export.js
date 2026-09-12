exportBtn.addEventListener("click", function () {
    if (form.length === 0) {
        showToast("No form to export", "warning");
        return;
    }

    const jsonData = JSON.stringify(form, null, 4);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "dynamic-form.json";

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showToast("Form exported successfully");
});
