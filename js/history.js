const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

function saveHistory() {

    undoStack.push(JSON.stringify(form));

    if (undoStack.length > 50) {

        undoStack.shift();

    }

    redoStack = [];

}

undoBtn.addEventListener("click", function () {

    if (undoStack.length === 0) return;

    redoStack.push(JSON.stringify(form));

    form = JSON.parse(undoStack.pop());

    selectedField = null;

    renderBuilder();

    renderPreview();
    saveToLocalStorage();

});

redoBtn.addEventListener("click", function () {

    if (redoStack.length === 0) return;

    undoStack.push(JSON.stringify(form));

    form = JSON.parse(redoStack.pop());

    selectedField = null;

    renderBuilder();

    renderPreview();
    saveToLocalStorage();

});