function saveToLocalStorage() {
    localStorage.setItem("dynamicForm", JSON.stringify(form));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem("dynamicForm");

    if (!data) return false;

    try {
        const parsed = JSON.parse(data);

        if (!Array.isArray(parsed)) {
            throw new Error("Saved form must be an array");
        }

        form = parsed;
        selectedField = null;
        return true;
    } catch (error) {
        console.error("Unable to load saved form:", error);
        localStorage.removeItem("dynamicForm");
        return false;
    }
}
