// ==========================================
// GET SELECTED FIELD
// ==========================================

function getSelectedField() {

    return form.find(
        field =>
            field.id ===
            selectedField
    );

}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSelectedSummary(
    field
) {

    if (
        !selectedFieldName ||
        !selectedFieldType
    ) {

        return;

    }


    if (!field) {

        selectedFieldName.textContent =
            "No field selected";


        selectedFieldType.textContent =
            "Choose a field from the canvas";


        return;

    }


    selectedFieldName.textContent =
        field.label ||
        "Untitled Field";


    selectedFieldType.textContent =

        field.type === "section"

            ? "Layout: Section Heading"

            : "Type: " +
              field.type;

}


// ==========================================
// SET PROPERTY CONTROL STATE
// ==========================================

function setPropertyControlsForField(
    field
) {

    const isSection =
        field &&
        field.type ===
        "section";


    // Section only needs its heading text.

    placeholderInput.disabled =
        isSection;


    requiredInput.disabled =
        isSection;


    minLengthInput.disabled =
        isSection;


    maxLengthInput.disabled =
        isSection;


    minValueInput.disabled =
        isSection;


    maxValueInput.disabled =
        isSection;


    ruleAction.disabled =
        isSection;


    ruleField.disabled =
        isSection;


    ruleOperator.disabled =
        isSection;


    ruleValue.disabled =
        isSection;


    if (isSection) {

        placeholderInput.value =
            "";

        requiredInput.checked =
            false;

        ruleAction.value =
            "";

        ruleValue.value =
            "";

    }

}


// ==========================================
// SHOW FIELD PROPERTIES
// ==========================================

function showProperties() {

    const field =
        getSelectedField();


    if (!field) {

        updateSelectedSummary(
            null
        );

        return;

    }


    updateSelectedSummary(
        field
    );


    setPropertyControlsForField(
        field
    );


    labelInput.value =
        field.label ||
        "";


    placeholderInput.value =
        field.placeholder ||
        "";


    requiredInput.checked =
        Boolean(
            field.required
        );

        // ======================================
// NAME - MIDDLE NAME OPTION
// ======================================

if (
    field.type === "name"
) {

    middleNameProperty.style.display =
        "flex";

    includeMiddleName.checked =
        field.includeMiddleName === true;

}

else {

    middleNameProperty.style.display =
        "none";

    includeMiddleName.checked =
        false;

}

// ======================================
// MATRIX SETTINGS
// ======================================

if (
    field.type === "matrix"
) {

    matrixProperties.style.display =
        "block";

    renderMatrixSettings();

}

else {

    matrixProperties.style.display =
        "none";

}


    minLengthInput.value =
        field.minLength ??
        0;


    maxLengthInput.value =
        field.maxLength ??
        100;


    minValueInput.value =
        field.minValue ??
        0;


    maxValueInput.value =
        field.maxValue ??
        100;

        


    // ======================================
    // OPTIONS
    // ======================================

   const supportsOptions =

    field.type === "dropdown"

    ||

    field.type === "radio"

    ||

    field.type === "multiselect" 
    ||
    field.type === "checkboxgroup";

    dropdownOptions.style.display =

        supportsOptions

            ? "block"

            : "none";


    if (
        supportsOptions
    ) {

        field.options =

            Array.isArray(
                field.options
            ) &&
            field.options.length

                ? field.options

                : [
                    "Option 1",
                    "Option 2"
                ];


        renderOptions();

    }

   if (
    field.type ===
    "imagechoice"
) {

    field.options =
        Array.isArray(field.options) &&
        field.options.length
            ? field.options
            : [
                {
                    label: "Option 1",
                    image: ""
                },
                {
                    label: "Option 2",
                    image: ""
                }
            ];

    renderImageChoiceSettings();

}


    // Section does not need conditional logic.

    if (
        field.type ===
        "section"
    ) {

        ruleField.innerHTML =
            '<option value="">Not available for Section Heading</option>';


        return;

    }


    // ======================================
    // CONDITIONAL FIELD LIST
    // ======================================

    ruleField.innerHTML =
        '<option value="">Select field</option>';


    form.forEach(
        function (
            otherField
        ) {

            if (
                otherField.id ===
                field.id
            ) {

                return;

            }


            // Section heading cannot provide
            // a response value.

            if (
                otherField.type ===
                "section"
            ) {

                return;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                otherField.id;


            option.textContent =
                otherField.label ||
                otherField.type;


            ruleField.appendChild(
                option
            );

        }
    );


    if (
        field.rule
    ) {

        ruleAction.value =
            field.rule.action ||
            "";


        ruleField.value =
            String(
                field.rule.fieldId ||
                ""
            );


        ruleOperator.value =
            field.rule.operator ||
            "==";


        ruleValue.value =
            field.rule.value ??
            "";

    }

    else {

        ruleAction.value =
            "";

        ruleField.value =
            "";

        ruleOperator.value =
            "==";

        ruleValue.value =
            "";

    }

}


// ==========================================
// UPDATE SELECTED FIELD
// ==========================================

function updateSelectedField(
    update,
    rerenderBuilder = false
) {

    const field =
        getSelectedField();


    if (!field) {

        return;

    }


    saveHistory();


    update(
        field
    );


    if (
        rerenderBuilder
    ) {

        renderBuilder();

        updateSelectedSummary(
            field
        );

    }


    renderPreview();

    saveToLocalStorage();

}


// ==========================================
// LABEL
// ==========================================

labelInput.addEventListener(
    "input",
    function () {

        updateSelectedField(

            field => {

                field.label =
                    this.value;

            },

            true

        );

    }
);


// ==========================================
// PLACEHOLDER
// ==========================================

placeholderInput.addEventListener(
    "input",
    function () {

        updateSelectedField(
            field => {

                if (
                    field.type ===
                    "section"
                ) {

                    return;

                }


                field.placeholder =
                    this.value;

            }
        );

    }
);


// ==========================================
// REQUIRED
// ==========================================

requiredInput.addEventListener(
    "change",
    function () {

        updateSelectedField(
            field => {

                if (
                    field.type ===
                    "section"
                ) {

                    field.required =
                        false;

                    return;

                }


                field.required =
                    this.checked;

            }
        );

    }
);

// ==========================================
// INCLUDE MIDDLE NAME
// ==========================================

includeMiddleName.addEventListener(
    "change",
    function () {

        const field =
            getSelectedField();


        if (
            !field ||
            field.type !== "name"
        ) {

            return;

        }


        saveHistory();


        field.includeMiddleName =
            this.checked;


        renderBuilder();

        renderPreview();

        saveToLocalStorage();

    }
);


// ==========================================
// VALIDATION SETTINGS
// ==========================================

minLengthInput.addEventListener(
    "input",
    function () {

        updateSelectedField(
            field => {

                if (
                    field.type ===
                    "section"
                ) {

                    return;

                }


                field.minLength =
                    Number(
                        this.value
                    );

            }
        );

    }
);


maxLengthInput.addEventListener(
    "input",
    function () {

        updateSelectedField(
            field => {

                if (
                    field.type ===
                    "section"
                ) {

                    return;

                }


                field.maxLength =
                    Number(
                        this.value
                    );

            }
        );

    }
);


minValueInput.addEventListener(
    "input",
    function () {

        updateSelectedField(
            field => {

                if (
                    field.type ===
                    "section"
                ) {

                    return;

                }


                field.minValue =
                    Number(
                        this.value
                    );

            }
        );

    }
);


maxValueInput.addEventListener(
    "input",
    function () {

        updateSelectedField(
            field => {

                if (
                    field.type ===
                    "section"
                ) {

                    return;

                }


                field.maxValue =
                    Number(
                        this.value
                    );

            }
        );

    }
);


// ==========================================
// CONDITIONAL RULE
// ==========================================

function updateRule() {

    const field =
        getSelectedField();


    if (
        !field ||
        field.type ===
        "section"
    ) {

        return;

    }


    saveHistory();


    if (
        !ruleAction.value
    ) {

        field.rule =
            null;

    }

    else {

        field.rule = {

            action:
                ruleAction.value,

            fieldId:
                Number(
                    ruleField.value
                ),

            operator:
                ruleOperator.value,

            value:
                ruleValue.value

        };

    }


    renderPreview();

    saveToLocalStorage();

}


ruleAction.addEventListener(
    "change",
    updateRule
);


ruleField.addEventListener(
    "change",
    updateRule
);


ruleOperator.addEventListener(
    "change",
    updateRule
);


ruleValue.addEventListener(
    "input",
    updateRule
);

// ==========================================
// MATRIX SETTINGS
// ==========================================

function renderMatrixSettings() {

    const field =
        getSelectedField();


    if (
        !field ||
        field.type !== "matrix"
    ) {

        return;

    }


    field.rows =
        Array.isArray(field.rows) &&
        field.rows.length
            ? field.rows
            : [
                "Service",
                "Quality",
                "Support"
            ];


    field.columns =
        Array.isArray(field.columns) &&
        field.columns.length
            ? field.columns
            : [
                "Poor",
                "Average",
                "Good",
                "Excellent"
            ];


    matrixRowsList.innerHTML =
        "";

    matrixColumnsList.innerHTML =
        "";


    // ======================================
    // ROWS
    // ======================================

    field.rows.forEach(
        function (
            rowText,
            index
        ) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "matrix-property-item";


            const input =
                document.createElement(
                    "input"
                );

            input.type =
                "text";

            input.value =
                rowText;

            input.placeholder =
                "Row label";


            const deleteBtn =
                document.createElement(
                    "button"
                );

            deleteBtn.type =
                "button";

            deleteBtn.className =
                "delete-option";

            deleteBtn.textContent =
                "🗑";


            input.addEventListener(
                "input",
                function () {

                    field.rows[index] =
                        this.value;

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            deleteBtn.addEventListener(
                "click",
                function () {

                    if (
                        field.rows.length <=
                        1
                    ) {

                        showToast(
                            "At least one matrix row is required",
                            "warning"
                        );

                        return;

                    }


                    saveHistory();


                    field.rows.splice(
                        index,
                        1
                    );


                    renderMatrixSettings();

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            row.append(
                input,
                deleteBtn
            );


            matrixRowsList.appendChild(
                row
            );

        }
    );


    // ======================================
    // COLUMNS
    // ======================================

    field.columns.forEach(
        function (
            columnText,
            index
        ) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "matrix-property-item";


            const input =
                document.createElement(
                    "input"
                );

            input.type =
                "text";

            input.value =
                columnText;

            input.placeholder =
                "Column label";


            const deleteBtn =
                document.createElement(
                    "button"
                );

            deleteBtn.type =
                "button";

            deleteBtn.className =
                "delete-option";

            deleteBtn.textContent =
                "🗑";


            input.addEventListener(
                "input",
                function () {

                    field.columns[index] =
                        this.value;

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            deleteBtn.addEventListener(
                "click",
                function () {

                    if (
                        field.columns.length <=
                        1
                    ) {

                        showToast(
                            "At least one matrix column is required",
                            "warning"
                        );

                        return;

                    }


                    saveHistory();


                    field.columns.splice(
                        index,
                        1
                    );


                    renderMatrixSettings();

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            row.append(
                input,
                deleteBtn
            );


            matrixColumnsList.appendChild(
                row
            );

        }
    );

}

// ==========================================
// IMAGE CHOICE SETTINGS
// ==========================================

function renderImageChoiceSettings() {

    const field =
        getSelectedField();

    if (
        !field ||
        field.type !==
        "imagechoice"
    ) {
        return;
    }

    const oldBox =
        document.getElementById(
            "imageChoicePropertyBox"
        );

    if (oldBox) {
        oldBox.remove();
    }


    const propertyBox =
        document.createElement(
            "div"
        );

    propertyBox.id =
        "imageChoicePropertyBox";

    propertyBox.className =
        "property-group";


    const heading =
        document.createElement(
            "h3"
        );

    heading.textContent =
        "Image Choices";


    const list =
        document.createElement(
            "div"
        );

    list.id =
        "imageChoiceOptionsList";


    field.options.forEach(
        function(option, index) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "image-choice-setting-row";


            const labelInput =
                document.createElement(
                    "input"
                );

            labelInput.type =
                "text";

            labelInput.value =
                option.label || "";

            labelInput.placeholder =
                "Option label";


            const imageInput =
                document.createElement(
                    "input"
                );

            imageInput.type =
                "text";

            imageInput.value =
                option.image || "";

            imageInput.placeholder =
                "Image URL";


            const deleteBtn =
                document.createElement(
                    "button"
                );

            deleteBtn.type =
                "button";

            deleteBtn.className =
                "delete-option";

            deleteBtn.textContent =
                "🗑";


            labelInput.addEventListener(
                "input",
                function () {

                    field.options[index].label =
                        this.value;

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            imageInput.addEventListener(
                "input",
                function () {

                    field.options[index].image =
                        this.value;

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            deleteBtn.addEventListener(
                "click",
                function () {

                    if (
                        field.options.length <=
                        1
                    ) {

                        showToast(
                            "At least one image choice is required",
                            "warning"
                        );

                        return;

                    }

                    saveHistory();

                    field.options.splice(
                        index,
                        1
                    );

                    renderImageChoiceSettings();

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            row.append(
                labelInput,
                imageInput,
                deleteBtn
            );

            list.appendChild(
                row
            );

        }
    );


    const addBtn =
        document.createElement(
            "button"
        );

    addBtn.type =
        "button";

    addBtn.className =
        "add-option-btn";

    addBtn.textContent =
        "+ Add Image Choice";


    addBtn.addEventListener(
        "click",
        function () {

            saveHistory();

            field.options.push({
                label:
                    "Option " +
                    (
                        field.options.length +
                        1
                    ),

                image:
                    ""
            });

            renderImageChoiceSettings();

            renderPreview();

            saveToLocalStorage();

        }
    );


    propertyBox.append(
        heading,
        list,
        addBtn
    );


    dropdownOptions.insertAdjacentElement(
        "afterend",
        propertyBox
    );

}

// ==========================================
// ADD MATRIX ROW
// ==========================================

addMatrixRowBtn.addEventListener(
    "click",
    function () {

        const field =
            getSelectedField();

        if (
            !field ||
            field.type !== "matrix"
        ) {
            return;
        }

        saveHistory();

        field.rows.push(
            "Row " +
            (
                field.rows.length +
                1
            )
        );

        renderMatrixSettings();

        renderPreview();

        saveToLocalStorage();

        const inputs =
            matrixRowsList.querySelectorAll(
                "input"
            );

        const lastInput =
            inputs[
                inputs.length - 1
            ];

        if (
            lastInput
        ) {
            lastInput.focus();
            lastInput.select();
        }

    }
);


// ==========================================
// ADD MATRIX COLUMN
// ==========================================

addMatrixColumnBtn.addEventListener(
    "click",
    function () {

        const field =
            getSelectedField();

        if (
            !field ||
            field.type !== "matrix"
        ) {
            return;
        }

        saveHistory();

        field.columns.push(
            "Column " +
            (
                field.columns.length +
                1
            )
        );

        renderMatrixSettings();

        renderPreview();

        saveToLocalStorage();

        const inputs =
            matrixColumnsList.querySelectorAll(
                "input"
            );

        const lastInput =
            inputs[
                inputs.length - 1
            ];

        if (
            lastInput
        ) {
            lastInput.focus();
            lastInput.select();
        }

    }
);

// ==========================================
// OPTIONS
// ==========================================

function renderOptions() {

    optionsList.innerHTML =
        "";


    const field =
        getSelectedField();


    if (!field) {

        return;

    }


  if (
    field.type !== "dropdown" &&
    field.type !== "radio" &&
    field.type !== "multiselect" &&
    field.type !== "checkboxgroup"
) {

        return;

    }


    field.options.forEach(
        function (
            optionText,
            index
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "option-row";


            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "text";


            input.value =
                optionText;


            input.className =
                "option-input";


            input.placeholder =
                "Enter option...";


            const removeButton =
                document.createElement(
                    "button"
                );


            removeButton.type =
                "button";


            removeButton.className =
                "delete-option";


            removeButton.title =
                "Delete option";


            removeButton.textContent =
                "🗑";


            input.addEventListener(
                "input",
                function () {

                    field.options[
                        index
                    ] =
                        this.value;


                    renderPreview();

                    saveToLocalStorage();

                }
            );


            removeButton.addEventListener(
                "click",
                function () {

                    if (
                        field.options.length ===
                        1
                    ) {

                        showToast(
                            "At least one option is required",
                            "warning"
                        );

                        return;

                    }


                    saveHistory();


                    field.options.splice(
                        index,
                        1
                    );


                    renderOptions();

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            row.append(
                input,
                removeButton
            );


            optionsList.appendChild(
                row
            );

        }
    );

}


// ==========================================
// ADD OPTION
// ==========================================

addOptionBtn.addEventListener(
    "click",
    function () {

        const field =
            getSelectedField();


        if (!field) {

            return;

        }


       if (
            field.type !== "dropdown" &&
            field.type !== "radio" &&
            field.type !== "multiselect" &&
           field.type !== "checkboxgroup"
        ) {

            return;

        }


        saveHistory();


        field.options.push(

            "Option " +
            (
                field.options.length +
                1
            )

        );


        renderOptions();

        renderPreview();

        saveToLocalStorage();


        const inputs =
            optionsList.querySelectorAll(
                ".option-input"
            );


        const lastInput =
            inputs[
                inputs.length - 1
            ];


        if (
            lastInput
        ) {

            lastInput.focus();

            lastInput.select();

        }

    }
);