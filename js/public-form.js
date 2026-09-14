const UPLOADS_API_URL =
    "https://dynamic-form-builder-backend-1jjb.onrender.com/api/uploads";

const RESPONSES_API_URL =
    "https://dynamic-form-builder-backend-1jjb.onrender.com/api/responses";

const publicForm =
    document.getElementById(
        "publicForm"
    );
const FORMS_API_URL =
    "https://dynamic-form-builder-backend-1jjb.onrender.com/api/forms";


const publicFormLoading =
    document.getElementById(
        "publicFormLoading"
    );

const publicFormContent =
    document.getElementById(
        "publicFormContent"
    );

const publicFormTitle =
    document.getElementById(
        "publicFormTitle"
    );


const params =
    new URLSearchParams(
        window.location.search
    );

const formId =
    params.get(
        "formId"
    );


if (!formId) {

    publicFormLoading.innerHTML = `
        <h2>
            Form not found
        </h2>

        <p>
            Invalid form link.
        </p>
    `;

}
else {

    loadPublicForm();

}


async function loadPublicForm() {

    try {

        const response =
            await fetch(
                `https://dynamic-form-builder-backend-1jjb.onrender.com/api/forms/public/${formId}`
            );

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
            if (
                selectedForm?.status !== "published"
            ) {

                throw new Error(
                    "This form is not published yet."
                );

            }

            window.currentPublicForm =
             selectedForm;


        publicFormTitle.textContent =
            selectedForm?.title ||
            "Untitled Form";


        document.title =
            selectedForm?.title ||
            "Public Form";

            renderPublicFormFields(
                selectedForm
            );
            initializeAddressDropdowns();
            initializePublicSignatures();
        publicFormLoading.hidden =
            true;

        publicFormContent.hidden =
            false;


        console.log(
            "Public form loaded:",
            selectedForm
        );

    }

    catch (error) {

        console.error(
            "Public form error:",
            error
        );


        publicFormLoading.innerHTML = `
            <h2>
                Unable to load form
            </h2>

            <p>
                ${escapePublicHtml(
                    error.message ||
                    "Something went wrong"
                )}
            </p>
        `;

    }

}


function escapePublicHtml(
    value
) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

function renderPublicFormFields(
    selectedForm
) {

    const publicFormFields =
        document.getElementById(
            "publicFormFields"
        );

    const fields =
        Array.isArray(
            selectedForm?.fields
        )
            ? selectedForm.fields
            : [];


    if (!fields.length) {

        publicFormFields.innerHTML = `
            <p class="chart-empty-text">
                No fields available
            </p>
        `;

        return;
    }


    publicFormFields.innerHTML =
        fields
            .map(
                function(field) {

                    const label =
                        escapePublicHtml(
                            field.label ||
                            "Untitled Field"
                        );

                    const requiredMark =
                        field.required
                            ? `<span class="public-required">*</span>`
                            : "";


                    if (
                        field.type ===
                        "section"
                    ) {

                        return `
                            <div class="public-section-heading">

                                <span>
                                    Section
                                </span>

                                <h2>
                                    ${label}
                                </h2>

                            </div>
                        `;

                    }


                    switch (
                        field.type
                    ) {

                       case "text":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <input
                type="text"
                name="${field.id}"
                class="public-text-input"
                placeholder="${
                    escapePublicHtml(
                        field.placeholder ||
                        "Type your answer..."
                    )
                }"
            >

        </div>
    `;


                       case "email":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-email-wrap">

                <span class="public-email-icon">
                    @
                </span>

                <input
                    type="email"
                    name="${field.id}"
                    class="public-email-input"
                    placeholder="${
                        escapePublicHtml(
                            field.placeholder ||
                            "name@example.com"
                        )
                    }"
                >

            </div>

            <small class="public-email-help">
                Enter a valid email address
            </small>

        </div>
    `;

                        case "number":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-number-wrap">

                <span class="public-number-icon">
                    #
                </span>

                <input
                    type="number"
                    name="${field.id}"
                    class="public-number-input"
                    inputmode="numeric"
                    placeholder="${
                        escapePublicHtml(
                            field.placeholder ||
                            "Enter a number"
                        )
                    }"
                >

            </div>

            <small class="public-number-help">
                Enter numeric value only
            </small>

        </div>
    `;


               case "date":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-date-field">

                <input
                    type="text"
                    name="${field.id}"
                    class="public-date-text-input"
                    placeholder="DD/MM/YYYY"
                    maxlength="10"
                    inputmode="numeric"
                    oninput="
                        let value =
                            this.value.replace(/[^0-9]/g, '');

                        if (value.length > 2) {
                            value =
                                value.slice(0,2) +
                                '/' +
                                value.slice(2);
                        }

                        if (value.length > 5) {
                            value =
                                value.slice(0,5) +
                                '/' +
                                value.slice(5,9);
                        }

                        this.value = value;
                    "
                >

                <input
                    type="date"
                    class="public-date-picker"
                    tabindex="-1"
                    onchange="
                        if (!this.value) return;

                        const parts =
                            this.value.split('-');

                        const formatted =
                            parts[2] +
                            '/' +
                            parts[1] +
                            '/' +
                            parts[0];

                        const textInput =
                            this.parentElement.querySelector(
                                '.public-date-text-input'
                            );

                        if (textInput) {
                            textInput.value = formatted;
                        }
                    "
                >

                <button
                    type="button"
                    class="public-date-picker-btn"
                    onclick="
                        const picker =
                            this.parentElement.querySelector(
                                '.public-date-picker'
                            );

                        if (
                            picker &&
                            typeof picker.showPicker === 'function'
                        ) {
                            picker.showPicker();
                        }
                    "
                >
                    📅
                </button>

            </div>

        </div>
    `;

                       case "textarea":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

           <textarea
    name="${field.id}"
    class="public-textarea-input"
    placeholder="${
        escapePublicHtml(
            field.placeholder ||
                        "Type your answer here..."
                    )
                }"
                     rows="5"
                    oninput="
                        const footer =
                            this.parentElement.querySelector(
                                '.public-textarea-count'
                            );

                        if (footer) {
                            footer.textContent =
                                this.value.length;
                        }
                                
                    "
                ></textarea>
            <div class="public-textarea-footer">
                <span>Long answer</span>
                <span class="public-textarea-count">0</span>
            </div>

        </div>
    `;


                      case "url":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-url-wrap">

                <span class="public-url-prefix">
                    https://
                </span>

                <input
                    type="text"
                    name="${field.id}"
                    class="public-url-input"
                    placeholder="${
                        escapePublicHtml(
                            field.placeholder ||
                            "example.com"
                        )
                    }"
                >

            </div>

            <small class="public-url-help">
                Enter website address
            </small>

        </div>
    `;


                       case "phone":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-phone-wrap">

                <div class="public-phone-code">
                    <span>IN</span>
                    <strong>+91</strong>
                </div>

                <input
                    type="tel"
                    name="${field.id}"
                    class="public-phone-input"
                    inputmode="numeric"
                    maxlength="10"
                    placeholder="${
                        escapePublicHtml(
                            field.placeholder ||
                            "Enter 10-digit mobile number"
                        )
                    }"
                    oninput="
                    this.value = this.value.replace(/[^0-9]/g, '');
                "
                >

            </div>

            <small class="public-phone-help">
                Enter a valid mobile number
            </small>

        </div>
    `;

                       case "time":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-time-builder">

                <div class="public-time-part">

                    <span>HOUR</span>

                    <select
                        name="${field.id}_hour"
                    >
                        <option value="">HH</option>

                        ${
                            Array.from(
                                { length: 12 },
                                function(_, index) {

                                    const hour =
                                        String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        );

                                    return `
                                        <option value="${hour}">
                                            ${hour}
                                        </option>
                                    `;

                                }
                            ).join("")
                        }

                    </select>

                </div>


                <div class="public-time-separator">
                    :
                </div>


                <div class="public-time-part">

                    <span>MINUTE</span>

                    <select
                        name="${field.id}_minute"
                    >
                        <option value="">MM</option>

                        ${
                            Array.from(
                                { length: 60 },
                                function(_, index) {

                                    const minute =
                                        String(
                                            index
                                        ).padStart(
                                            2,
                                            "0"
                                        );

                                    return `
                                        <option value="${minute}">
                                            ${minute}
                                        </option>
                                    `;

                                }
                            ).join("")
                        }

                    </select>

                </div>


                <div class="public-time-part">

                    <span>PERIOD</span>

                    <select
                        name="${field.id}_period"
                    >
                        <option value="AM">
                            AM
                        </option>

                        <option value="PM">
                            PM
                        </option>
                    </select>

                </div>


                <div class="public-time-icon">
                    🕒
                </div>

            </div>

        </div>
    `;
                           case "dropdown":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

           <div class="public-dropdown-wrap">

    <select
        name="${field.id}"
        class="public-dropdown-select"
    >

        <option value="">
            Select an option
        </option>

        ${
            Array.isArray(field.options)
                ? field.options
                    .map(function(option) {

                        const value =
                            typeof option === "object"
                                ? option.label ||
                                  option.value ||
                                  ""
                                : option;

                        return `
                            <option value="${escapePublicHtml(value)}">
                                ${escapePublicHtml(value)}
                            </option>
                        `;

                    })
                    .join("")
                : ""
        }

    </select>

    <span class="public-dropdown-chevron" aria-hidden="true">
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    </span>

</div>

            </div>

        </div>
    `;


case "radio":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-radio-group">

                ${
                    Array.isArray(field.options)
                        ? field.options
                            .map(function(option) {

                                const value =
                                    typeof option === "object"
                                        ? option.label ||
                                          option.value ||
                                          ""
                                        : option;

                                return `
                                    <label class="public-radio-option">

                                        <input
                                            type="radio"
                                            name="${field.id}"
                                            value="${escapePublicHtml(value)}"
                                        >

                                        <span class="public-radio-circle"></span>

                                        <strong>
                                            ${escapePublicHtml(value)}
                                        </strong>

                                    </label>
                                `;

                            })
                            .join("")
                        : ""
                }

            </div>

        </div>
    `;


case "checkbox":

    return `
        <div class="public-field">

            <label class="public-single-checkbox">

                <input
                    type="checkbox"
                    name="${field.id}"
                    value="Yes"
                >

                <span class="public-single-checkbox-box">
                    ✓
                </span>

                <span class="public-single-checkbox-text">
                    ${label}
                    ${requiredMark}
                </span>

            </label>

        </div>
    `;


case "file":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <label class="public-file-upload-box">

                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                    name="${field.id}"
                    class="public-file-input"
                    onchange="
                        const box =
                            this.closest('.public-file-upload-box');

                        const fileName =
                            box.querySelector('.public-file-name');

                        if (this.files && this.files.length) {

                            fileName.textContent =
                                this.files[0].name;

                            box.classList.add('has-file');

                        } else {

                            fileName.textContent =
                                'No file selected';

                            box.classList.remove('has-file');
                        }
                    "
                >

                <div class="public-file-top">

                    <div class="public-file-icon-wrap">
                        <div class="public-file-icon">↑</div>
                    </div>

                    <div class="public-file-copy">
                        <strong>Upload your file</strong>
                        <span>
                            Select a document or image from your device
                        </span>
                    </div>

                    <div class="public-file-browse-btn">
                        Browse File
                    </div>

                </div>

                <div class="public-file-bottom">

                    <div class="public-file-meta">
                        PDF, DOC, DOCX, JPG, PNG
                    </div>

                    <div class="public-file-name">
                        No file selected
                    </div>

                </div>

            </label>

        </div>
    `;


case "rating":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-rating-wrap">

                <div class="public-rating-stars">

                    ${[1, 2, 3, 4, 5]
                        .map(
                            function(value) {

                                return `
                                    <label class="public-rating-star">

                                        <input
                                            type="radio"
                                            name="${field.id}"
                                            value="${value}"
                                             onchange="
                                            const wrap =
                                                this.closest('.public-rating-wrap');

                                            const valueBox =
                                                wrap.querySelector(
                                                    '.public-rating-value'
                                                );

                                            valueBox.textContent =
                                                this.value + ' / 5';
                                        "

                                        >

                                        <span>
                                            ★
                                        </span>

                                    </label>
                                `;

                            }
                        )
                        .join("")}

                </div>

                <div class="public-rating-info">

                    <span class="public-rating-value">
                        Not rated
                    </span>

                    <small>
                        Select from 1 to 5 stars
                    </small>

                </div>

            </div>

        </div>
    `;
   case "checkboxgroup":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-checkboxgroup-grid">

                ${
                    Array.isArray(field.options)
                        ? field.options.map(
                            function(option) {

                                const value =
                                    typeof option === "object"
                                        ? option.label ||
                                          option.value ||
                                          ""
                                        : option;

                                return `
                                    <label class="public-checkbox-card">

                                        <input
                                            type="checkbox"
                                            name="${field.id}"
                                            value="${escapePublicHtml(value)}"
                                        >

                                        <span class="public-checkbox-box">
                                            ✓
                                        </span>

                                        <strong>
                                            ${escapePublicHtml(value)}
                                        </strong>

                                    </label>
                                `;

                            }
                        ).join("")
                        : ""
                }

            </div>

        </div>
    `;


case "range":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-range-control">

                <div class="public-range-bubble">
                    ${field.min ?? 0}
                </div>

                <input
                    type="range"
                    name="${field.id}"
                    min="${field.min ?? 0}"
                    max="${field.max ?? 100}"
                    value="${field.min ?? 0}"
                    class="public-range-input"
                     style="--range-progress: 0%;"
                    oninput="
    const wrap =
        this.closest('.public-range-control');

    const bubble =
        wrap.querySelector(
            '.public-range-bubble'
        );

    const min =
        Number(this.min);

    const max =
        Number(this.max);

    const value =
        Number(this.value);

    const percent =
        ((value - min) /
        (max - min)) * 100;

    bubble.textContent =
        this.value;

    const safePercent =
        Math.max(
            4,
            Math.min(
                96,
                percent
            )
        );

    bubble.style.left =
        safePercent + '%';

    this.style.setProperty(
        '--range-progress',
        percent + '%'
    );
"
                >

                <div class="public-range-limits">

                    <span>
                        ${field.min ?? 0}
                    </span>

                    <span>
                        ${field.max ?? 100}
                    </span>

                </div>

            </div>

        </div>
    `;


case "yesno":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-yesno-group">

                <label class="public-yesno-option">

                    <input
                        type="radio"
                        name="${field.id}"
                        value="Yes"
                    >

                    <span class="public-yesno-icon">
                        ✓
                    </span>

                    <strong>
                        Yes
                    </strong>

                </label>


                <label class="public-yesno-option">

                    <input
                        type="radio"
                        name="${field.id}"
                        value="No"
                    >

                    <span class="public-yesno-icon">
                        ✕
                    </span>

                    <strong>
                        No
                    </strong>

                </label>

            </div>

        </div>
    `;

case "imagechoice":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-image-choice-grid">

                ${
                    Array.isArray(field.options)
                        ? field.options.map(
                            function(option) {

                                const optionLabel =
                                    typeof option === "object"
                                        ? option.label ||
                                          option.value ||
                                          ""
                                        : option;

                                const imageUrl =
                                    typeof option === "object"
                                        ? option.image ||
                                          option.imageUrl ||
                                          ""
                                        : "";

                                return `
                                    <label class="public-image-choice">

                                        <input
                                            type="radio"
                                            name="${field.id}"
                                            value="${escapePublicHtml(optionLabel)}"
                                        >

                                        <div class="public-image-choice-media">

                                            ${
                                                imageUrl
                                                    ? `
                                                        <img
                                                            src="${escapePublicHtml(imageUrl)}"
                                                            alt="${escapePublicHtml(optionLabel)}"
                                                        >
                                                    `
                                                    : `
                                                        <div class="public-image-choice-placeholder">

                                                            <span class="public-image-choice-placeholder-icon">
                                                                🖼
                                                            </span>

                                                            <span>
                                                                No image
                                                            </span>

                                                        </div>
                                                    `
                                            }

                                        </div>

                                        <div class="public-image-choice-footer">

                                            <span class="public-image-choice-radio"></span>

                                            <strong>
                                                ${escapePublicHtml(optionLabel)}
                                            </strong>

                                        </div>

                                    </label>
                                `;

                            }
                        ).join("")
                        : ""
                }

            </div>

        </div>
    `;


case "matrix":

    const matrixRows =
        Array.isArray(field.rows)
            ? field.rows
            : [];

    const matrixColumns =
        Array.isArray(field.columns)
            ? field.columns
            : [];

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-matrix-wrap">

                <table class="public-matrix-table">

                    <thead>
                        <tr>
                            <th></th>

                            ${
                                matrixColumns
                                    .map(
                                        function(column) {

                                            const columnLabel =
                                                typeof column === "object"
                                                    ? column.label ||
                                                      column.value ||
                                                      ""
                                                    : column;

                                            return `
                                                <th>
                                                    ${escapePublicHtml(
                                                        columnLabel
                                                    )}
                                                </th>
                                            `;

                                        }
                                    )
                                    .join("")
                            }

                        </tr>
                    </thead>

                    <tbody>

                        ${
                            matrixRows
                                .map(
                                    function(row, rowIndex) {

                                        const rowLabel =
                                            typeof row === "object"
                                                ? row.label ||
                                                  row.value ||
                                                  ""
                                                : row;

                                        return `
                                            <tr>

                                                <td>
                                                    ${escapePublicHtml(
                                                        rowLabel
                                                    )}
                                                </td>

                                                ${
                                                    matrixColumns
                                                        .map(
                                                            function(column) {

                                                                const columnLabel =
                                                                    typeof column === "object"
                                                                        ? column.label ||
                                                                          column.value ||
                                                                          ""
                                                                        : column;

                                                                return `
                                                                    <td>
                                                                        <input
                                                                            type="radio"
                                                                            name="${field.id}_${rowIndex}"
                                                                            value="${escapePublicHtml(
                                                                                columnLabel
                                                                            )}"
                                                                            data-matrix-field="${field.id}"
                                                                            data-matrix-row="${escapePublicHtml(
                                                                                rowLabel
                                                                            )}"
                                                                        >
                                                                    </td>
                                                                `;

                                                            }
                                                        )
                                                        .join("")
                                                }

                                            </tr>
                                        `;

                                    }
                                )
                                .join("")
                        }

                    </tbody>

                </table>

            </div>

        </div>
    `;


case "signature":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-signature-box">

                <div class="public-signature-tabs">

                    <button
                        type="button"
                        class="public-signature-tab active"
                        data-mode="draw"
                        data-field-id="${field.id}"
                    >
                        Draw
                    </button>

                    <button
                        type="button"
                        class="public-signature-tab"
                        data-mode="upload"
                        data-field-id="${field.id}"
                    >
                        Upload
                    </button>

                </div>

                <div
                    class="public-signature-panel active"
                    data-panel="draw"
                    data-field-id="${field.id}"
                >

                    <div class="public-signature-canvas-wrap">

                        <canvas
                            class="public-signature-canvas"
                            data-field-id="${field.id}"
                            width="600"
                            height="180"
                        ></canvas>

                        <span class="public-signature-placeholder">
                            Sign here
                        </span>

                    </div>

                    <div class="public-signature-actions">

                    <button
                        type="button"
                        class="public-signature-undo"
                        data-field-id="${field.id}"
                    >
                        ↶ Undo
                    </button>

                    <button
                        type="button"
                        class="public-signature-clear"
                        data-field-id="${field.id}"
                    >
                        Clear
                    </button>

                </div>
                     </div>

                <div
                    class="public-signature-panel"
                    data-panel="upload"
                    data-field-id="${field.id}"
                >

                    <label class="public-signature-upload-box">

                        <input
                            type="file"
                            accept="image/*"
                            class="public-signature-upload"
                            data-field-id="${field.id}"
                        >

                        <span class="public-signature-upload-icon">
                            ↑
                        </span>

                        <strong>
                            Upload signature image
                        </strong>

                        <small>
                            PNG, JPG or JPEG
                        </small>

                    </label>

                </div>

            </div>

        </div>
    `;
  case "datetime":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div
                class="public-datetime-control"
                onclick="
                    const input =
                        this.querySelector(
                            '.public-datetime-input'
                        );

                    if (
                        input &&
                        typeof input.showPicker === 'function'
                    ) {
                        input.showPicker();
                    }
                "
            >

                <div class="public-datetime-icon">
                    📅
                </div>

                <div class="public-datetime-text">

                    <strong>
                        Select date & time
                    </strong>

                    <span class="public-datetime-value">
                        Choose appointment date and time
                    </span>

                </div>

                <span class="public-datetime-arrow">
                    ▾
                </span>

                <input
                    type="datetime-local"
                    name="${field.id}"
                    class="public-datetime-input"
                    onclick="
                        event.stopPropagation();
                    "
                    onchange="
                        const valueBox =
                            this.parentElement
                                .querySelector(
                                    '.public-datetime-value'
                                );

                        valueBox.textContent =
                            this.value
                                ? this.value.replace(
                                    'T',
                                    ' '
                                )
                                : 'Choose appointment date and time';
                    "
                >

            </div>

        </div>
    `;


case "multiselect":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-multiselect-grid">

                ${
                    Array.isArray(field.options)
                        ? field.options.map(
                            function(option) {

                                const value =
                                    typeof option === "object"
                                        ? option.label ||
                                          option.value ||
                                          ""
                                        : option;

                                return `
                                    <label class="public-multiselect-card">

                                        <input
                                            type="checkbox"
                                            name="${field.id}"
                                            value="${escapePublicHtml(value)}"
                                        >

                                        <span class="public-multiselect-box"></span>

                                        <strong>
                                            ${escapePublicHtml(value)}
                                        </strong>

                                    </label>
                                `;

                            }
                        ).join("")
                        : ""
                }

            </div>

        </div>
    `;


case "address":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-address-grid">

                <div class="public-address-full">

                    <span class="public-address-label">
                        ADDRESS LINE
                    </span>

                    <input
                        type="text"
                        name="${field.id}_line"
                        placeholder="House no., street, area"
                    >

                </div>


                <div class="public-address-part">

                    <span class="public-address-label">
                        CITY
                    </span>

                    <select
                        name="${field.id}_city"
                        class="public-address-city"
                        data-field-id="${field.id}"
                        disabled
                    >
                        <option value="">
                            Select state first
                        </option>
                    </select>

                </div>


                <div class="public-address-part">

                    <span class="public-address-label">
                        STATE
                    </span>

                    <select
                        name="${field.id}_state"
                        class="public-address-state"
                        data-field-id="${field.id}"
                    >
                        <option value="">
                            Loading states...
                        </option>
                    </select>

                </div>


                <div class="public-address-part">

                    <span class="public-address-label">
                        PINCODE
                    </span>

                    <input
                        type="text"
                        inputmode="numeric"
                        maxlength="6"
                        name="${field.id}_pincode"
                        placeholder="Enter pincode"
                    >

                </div>


                <div class="public-address-part">

                    <span class="public-address-label">
                        COUNTRY
                    </span>

                    <select
                        name="${field.id}_country"
                    >
                        <option value="">
                            Select country
                        </option>

                        <option value="India">
                            India
                        </option>

                        <option value="United States">
                            United States
                        </option>

                        <option value="United Kingdom">
                            United Kingdom
                        </option>

                        <option value="Canada">
                            Canada
                        </option>

                        <option value="Australia">
                            Australia
                        </option>
                    </select>

                </div>

            </div>

        </div>
    `;


case "name":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-name-grid">

                <div class="public-name-part">

                    <span>
                        FIRST NAME
                    </span>

                    <input
                        type="text"
                        name="${field.id}_first"
                        placeholder="First name"
                    >

                </div>

                <div class="public-name-part">

                    <span>
                        MIDDLE NAME
                        <small>
                            (Optional)
                        </small>
                    </span>

                    <input
                        type="text"
                        name="${field.id}_middle"
                        placeholder="Middle name"
                    >

                </div>

                <div class="public-name-part">

                    <span>
                        LAST NAME
                    </span>

                    <input
                        type="text"
                        name="${field.id}_last"
                        placeholder="Last name"
                    >

                </div>

            </div>

        </div>
    `;


case "scale":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-scale-group">

                ${[1,2,3,4,5,6,7,8,9,10]
                    .map(
                        function(value) {

                            return `
                                <label class="public-scale-option">

                                    <input
                                        type="radio"
                                        name="${field.id}"
                                        value="${value}"
                                    >

                                    <span>
                                        ${value}
                                    </span>

                                </label>
                            `;

                        }
                    )
                    .join("")}

            </div>

        </div>
    `;


case "currency":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-currency-wrap">

                <span>
                    ₹
                </span>

                <input
                    type="number"
                    step="0.01"
                    name="${field.id}"
                    placeholder="0.00"
                >

            </div>

        </div>
    `;


case "password":

    return `
        <div class="public-field">

            <label>
                ${label}
                ${requiredMark}
            </label>

            <div class="public-password-wrap">

                <input
                    type="password"
                    name="${field.id}"
                    class="public-password-input"
                    placeholder="${escapePublicHtml(
                        field.placeholder ||
                        "Enter password"
                    )}"
                >

                <button
                    type="button"
                    class="public-password-toggle"
                    aria-label="Show password"
                    onclick="
                        const input =
                            this.previousElementSibling;

                        const showing =
                            input.type === 'text';

                        input.type =
                            showing
                                ? 'password'
                                : 'text';

                        this.textContent =
                            showing
                                ? '👁'
                                : '🙈';

                        this.setAttribute(
                            'aria-label',
                            showing
                                ? 'Show password'
                                : 'Hide password'
                        );
                    "
                >
                    👁
                </button>

            </div>

        </div>
    `;


                        default:

                            return `
                                <div class="public-field public-field-pending">

                                    <label>
                                        ${label}
                                    </label>

                                    <p>
                                        ${escapePublicHtml(
                                            field.type
                                        )}
                                    </p>

                                </div>
                            `;

                    }

                }
            )
            .join("");

}
publicForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const fields =
    Array.isArray(
        window.currentPublicForm?.fields
    )
        ? window.currentPublicForm.fields
        : [];


for (const field of fields) {

    if (
        field.type === "section" ||
        !field.required
    ) {
        continue;
    }

    let hasValue = false;

    if (
        field.type === "checkbox"
    ) {

        const checkbox =
            publicForm.querySelector(
                `[name="${field.id}"]`
            );

        hasValue =
            Boolean(
                checkbox?.checked
            );

    }

    else if (
        field.type === "radio" ||
        field.type === "rating" ||
        field.type === "yesno" ||
        field.type === "imagechoice" ||
        field.type === "scale"
    ) {

        hasValue =
            Boolean(
                publicForm.querySelector(
                    `[name="${field.id}"]:checked`
                )
            );

    }

    else if (
        field.type === "checkboxgroup" ||
        field.type === "multiselect"
    ) {

        hasValue =
            Boolean(
                publicForm.querySelector(
                    `[name="${field.id}"]:checked`
                )
            );

    }

    else if (
        field.type === "time"
    ) {

        const hour =
            publicForm.querySelector(
                `[name="${field.id}_hour"]`
            )?.value;

        const minute =
            publicForm.querySelector(
                `[name="${field.id}_minute"]`
            )?.value;

        hasValue =
            Boolean(
                hour &&
                minute
            );

    }

    else if (
        field.type === "name"
    ) {

        const first =
            publicForm.querySelector(
                `[name="${field.id}_first"]`
            )?.value?.trim();

        const last =
            publicForm.querySelector(
                `[name="${field.id}_last"]`
            )?.value?.trim();

        hasValue =
            Boolean(
                first &&
                last
            );

    }

    else if (
        field.type === "address"
    ) {

        const line =
            publicForm.querySelector(
                `[name="${field.id}_line"]`
            )?.value?.trim();

        const city =
            publicForm.querySelector(
                `[name="${field.id}_city"]`
            )?.value;

        const state =
            publicForm.querySelector(
                `[name="${field.id}_state"]`
            )?.value;

        hasValue =
            Boolean(
                line &&
                city &&
                state
            );

    }

    else if (
        field.type === "matrix"
    ) {

        const rows =
            Array.isArray(field.rows)
                ? field.rows
                : [];

        const checkedRows =
            publicForm.querySelectorAll(
                `[data-matrix-field="${field.id}"]:checked`
            );

        hasValue =
            checkedRows.length ===
            rows.length;

    }

    else if (
        field.type === "signature"
    ) {

        const canvas =
            publicForm.querySelector(
                `.public-signature-canvas[data-field-id="${field.id}"]`
            );

        hasValue =
            Boolean(
                canvas &&
                !isCanvasBlank(canvas)
            );

    }

    else {

        const input =
            publicForm.querySelector(
                `[name="${field.id}"]`
            );

        hasValue =
            Boolean(
                input?.value?.trim()
            );

    }


    if (!hasValue) {

        alert(
            `${field.label || "Required field"} is required.`
        );

        return;

    }

}

        const formData =
            new FormData(
                publicForm
            );

        const answers = [];


       for (const field of fields) {

    if (
        field.type === "section"
    ) {
        continue;
    }

    let value = "";

    if (
        field.type === "checkbox"
    ) {

        const checkbox =
            publicForm.querySelector(
                `[name="${field.id}"]`
            );

        value =
            checkbox?.checked
                ? "Yes"
                : "No";

    }

    else if (
    field.type === "radio" ||
    field.type === "rating" ||
    field.type === "yesno" ||
    field.type === "imagechoice" ||
    field.type === "scale"
) {

    const checked =
        publicForm.querySelector(
            `[name="${field.id}"]:checked`
        );

    value =
        checked?.value ||
        "";

} 

    else if (
        field.type === "file"
    ) {

        const fileInput =
            publicForm.querySelector(
                `[name="${field.id}"]`
            );

        const file =
            fileInput?.files?.[0];

        if (file) {

            const uploadResult =
                await uploadPublicFile(
                    file
                );

            value =
                uploadResult?.data?.url ||
                uploadResult?.url ||
                "";

        }

    }

    else if (
    field.type === "name"
) {

    const first =
        formData.get(
            `${field.id}_first`
        ) || "";

    const middle =
        formData.get(
            `${field.id}_middle`
        ) || "";

    const last =
        formData.get(
            `${field.id}_last`
        ) || "";

    value = {
        firstName: first,
        middleName: middle,
        lastName: last,
        fullName:
            [first, middle, last]
                .filter(Boolean)
                .join(" ")
    };

}

else if (
    field.type === "address"
) {

    const addressLine =
        formData.get(
            `${field.id}_line`
        ) || "";

    const city =
        formData.get(
            `${field.id}_city`
        ) || "";

    const stateSelect =
        publicForm.querySelector(
            `[name="${field.id}_state"]`
        );

    const stateCode =
        stateSelect?.value ||
        "";

    const stateName =
        stateSelect
            ?.selectedOptions?.[0]
            ?.textContent
            ?.trim() ||
        "";

    const pincode =
        formData.get(
            `${field.id}_pincode`
        ) || "";

    const country =
        formData.get(
            `${field.id}_country`
        ) || "";

    value = {
        addressLine:
            addressLine,

        city:
            city,

        state:
            stateName,

        stateCode:
            stateCode,

        pincode:
            pincode,

        country:
            country,

        fullAddress:
            [
                addressLine,
                city,
                stateName,
                pincode,
                country
            ]
                .filter(Boolean)
                .join(", ")
    };

}
else if (
    field.type === "time"
) {

    const hour =
        formData.get(
            `${field.id}_hour`
        ) || "";

    const minute =
        formData.get(
            `${field.id}_minute`
        ) || "";

    const period =
        formData.get(
            `${field.id}_period`
        ) || "";

    value =
        hour && minute
            ? `${hour}:${minute} ${period}`
            : "";

}

else if (
    field.type === "multiselect" ||
    field.type === "checkboxgroup"
) {

    value =
        formData.getAll(
            String(field.id)
        );

}
else if (
    field.type === "matrix"
) {

    const matrixAnswers = {};

    const matrixInputs =
        publicForm.querySelectorAll(
            `[data-matrix-field="${field.id}"]:checked`
        );

    matrixInputs.forEach(
        function(input) {

            const rowName =
                input.dataset.matrixRow ||
                "";

            matrixAnswers[rowName] =
                input.value;

        }
    );

    value =
        matrixAnswers;

}
else if (
    field.type === "signature"
) {

    const canvas =
        publicForm.querySelector(
            `.public-signature-canvas[data-field-id="${field.id}"]`
        );

    if (canvas) {

        const signatureBlob =
            await new Promise(
                function (resolve) {

                    canvas.toBlob(
                        resolve,
                        "image/png"
                    );

                }
            );

        const signatureFile =
            new File(
                [signatureBlob],
                `signature-${Date.now()}.png`,
                {
                    type: "image/png"
                }
            );

        const uploadResult =
            await uploadPublicFile(
                signatureFile
            );

        value =
            uploadResult?.data?.url ||
            uploadResult?.url ||
            "";

    }

}

    else {

        value =
            formData.get(
                String(field.id)
            ) || "";

    }

    answers.push({
        fieldId:
            field.id,

        label:
            field.label ||
            "Untitled Field",

        value:
            value
    });

}

        try {

            const response =
                await fetch(
                    RESPONSES_API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                formId:
                                    formId,

                                answers:
                                    answers
                            })
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to submit response"
                );

            }

            alert(
                "Response submitted successfully"
            );

            publicForm.reset();

        }

        catch (error) {

            console.error(
                "Public form submit error:",
                error
            );

            alert(
                error.message ||
                "Unable to submit response"
            );

        }

    }
);

async function uploadPublicFile(file) {

    const uploadData =
        new FormData();

    uploadData.append(
        "file",
        file
    );

    const response =
        await fetch(
            UPLOADS_API_URL,
            {
                method: "POST",
                body: uploadData
            }
        );

    const result =
        await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "File upload failed"
        );
    }

    return result;
}

function initializePublicSignatures() {

    document
    .querySelectorAll(".public-signature-tab")
    .forEach(function(tab) {

        tab.addEventListener(
            "click",
            function() {

                const fieldId =
                    tab.dataset.fieldId;

                const mode =
                    tab.dataset.mode;

                document
                    .querySelectorAll(
                        `.public-signature-tab[data-field-id="${fieldId}"]`
                    )
                    .forEach(function(button) {
                        button.classList.remove("active");
                    });

                document
                    .querySelectorAll(
                        `.public-signature-panel[data-field-id="${fieldId}"]`
                    )
                    .forEach(function(panel) {
                        panel.classList.remove("active");
                    });

                tab.classList.add("active");

                const selectedPanel =
                    document.querySelector(
                        `.public-signature-panel[data-field-id="${fieldId}"][data-panel="${mode}"]`
                    );

                if (selectedPanel) {
                    selectedPanel.classList.add("active");
                }
            }
        );

    });


    const canvases =
        document.querySelectorAll(
            ".public-signature-canvas"
        );

    canvases.forEach(
        function(canvas) {

            const ctx =
                canvas.getContext("2d");

            let drawing = false;
            const history = [];
            canvas._signatureHistory = history;

            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#111827";

            canvas.addEventListener(
                "mousedown",
                function(event) {

                    drawing = true;

                    history.push(
                            ctx.getImageData(
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            )
                        );

                        if (history.length > 20) {
                            history.shift();
                        }

                    const placeholder =
                        canvas.parentElement.querySelector(
                            ".public-signature-placeholder"
                        );

                    if (placeholder) {
                        placeholder.style.display = "none";
                    }

                    const rect =
                        canvas.getBoundingClientRect();

                    ctx.beginPath();

                    ctx.moveTo(
                        event.clientX - rect.left,
                        event.clientY - rect.top
                    );

                }
            );

            canvas.addEventListener(
                "mousemove",
                function(event) {

                    if (!drawing) {
                        return;
                    }

                    const rect =
                        canvas.getBoundingClientRect();

                    ctx.lineTo(
                        event.clientX - rect.left,
                        event.clientY - rect.top
                    );

                    ctx.stroke();

                }
            );

            canvas.addEventListener(
                "mouseup",
                function() {
                    drawing = false;
                }
            );

            canvas.addEventListener(
                "mouseleave",
                function() {
                    drawing = false;
                }
            );

        }
    );

    document
    .querySelectorAll(
        ".public-signature-undo"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const fieldId =
                        button.dataset.fieldId;

                    const canvas =
                        document.querySelector(
                            `.public-signature-canvas[data-field-id="${fieldId}"]`
                        );

                    if (!canvas) {
                        return;
                    }

                    const history =
                        canvas._signatureHistory || [];

                    if (!history.length) {
                        return;
                    }

                    const ctx =
                        canvas.getContext("2d");

                    const previousState =
                        history.pop();

                    ctx.putImageData(
                        previousState,
                        0,
                        0
                    );

                    const placeholder =
                        canvas.parentElement.querySelector(
                            ".public-signature-placeholder"
                        );

                    if (placeholder) {

                        placeholder.style.display =
                            isCanvasBlank(canvas)
                                ? ""
                                : "none";
                    }
                }
            );
        }
    );


    document
        .querySelectorAll(
            ".public-signature-clear"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const fieldId =
                            button.dataset.fieldId;

                        const canvas =
                            document.querySelector(
                                `.public-signature-canvas[data-field-id="${fieldId}"]`
                            );

                        if (!canvas) {
                            return;
                        }

                        const ctx =
                            canvas.getContext("2d");

                            const history =
                                canvas._signatureHistory || [];

                            history.push(
                                ctx.getImageData(
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height
                                )
                            );

                            if (history.length > 20) {
                                history.shift();
                            }

                        ctx.clearRect(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );
                        const placeholder =
                            canvas.parentElement.querySelector(
                                ".public-signature-placeholder"
                            );

                        if (placeholder) {
                            placeholder.style.display = "";
                        }

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".public-signature-upload"
        )
        .forEach(
            function(input) {

                input.addEventListener(
                    "change",
                    function() {

                        const file =
                            input.files?.[0];

                        if (!file) {
                            return;
                        }

                        const fieldId =
                            input.dataset.fieldId;

                        const canvas =
                            document.querySelector(
                                `.public-signature-canvas[data-field-id="${fieldId}"]`
                            );

                        if (!canvas) {
                            return;
                        }

                        const reader =
                            new FileReader();

                        reader.onload =
                            function(event) {

                                const img =
                                    new Image();

                                img.onload =
                                    function() {

                                        const ctx =
                                            canvas.getContext("2d");

                                            const history =
                                            canvas._signatureHistory || [];

                                        history.push(
                                            ctx.getImageData(
                                                0,
                                                0,
                                                canvas.width,
                                                canvas.height
                                            )
                                        );

                                        if (history.length > 20) {
                                            history.shift();
                                        }

                                        ctx.clearRect(
                                            0,
                                            0,
                                            canvas.width,
                                            canvas.height
                                        );

                                        ctx.drawImage(
                                            img,
                                            0,
                                            0,
                                            canvas.width,
                                            canvas.height
                                        );

                                        const placeholder =
                                        canvas.parentElement.querySelector(
                                            ".public-signature-placeholder"
                                        );

                                    if (placeholder) {
                                        placeholder.style.display = "none";
                                    }
                                    const fieldId =
                                        input.dataset.fieldId;

                                    const drawTab =
                                        document.querySelector(
                                            `.public-signature-tab[data-field-id="${fieldId}"][data-mode="draw"]`
                                        );

                                    const uploadTab =
                                        document.querySelector(
                                            `.public-signature-tab[data-field-id="${fieldId}"][data-mode="upload"]`
                                        );

                                    const drawPanel =
                                        document.querySelector(
                                            `.public-signature-panel[data-field-id="${fieldId}"][data-panel="draw"]`
                                        );

                                    const uploadPanel =
                                        document.querySelector(
                                            `.public-signature-panel[data-field-id="${fieldId}"][data-panel="upload"]`
                                        );

                                    uploadTab?.classList.remove("active");
                                    uploadPanel?.classList.remove("active");

                                    drawTab?.classList.add("active");
                                    drawPanel?.classList.add("active");

                                    };

                                img.src =
                                    event.target.result;

                            };

                        reader.readAsDataURL(
                            file
                        );

                    }
                );

            }
        );

}
async function initializeAddressDropdowns() {

    const stateSelects =
        document.querySelectorAll(
            ".public-address-state"
        );

    try {

        const response =
            await fetch(
                "https://dynamic-form-builder-backend-1jjb.onrender.com/api/locations/states"
            );

        const result =
            await response.json();

        const states =
            Array.isArray(result.data)
                ? result.data
                : [];


        stateSelects.forEach(
            function(stateSelect) {

                stateSelect.innerHTML = `
                    <option value="">
                        Select state
                    </option>
                `;

                states.forEach(
                    function(state) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            state.isoCode;

                        option.textContent =
                            state.name;

                        option.dataset.stateName =
                            state.name;

                        stateSelect.appendChild(
                            option
                        );

                    }
                );


                stateSelect.addEventListener(
                    "change",
                    async function() {

                        const fieldId =
                            stateSelect.dataset.fieldId;

                        const citySelect =
                            document.querySelector(
                                `.public-address-city[data-field-id="${fieldId}"]`
                            );

                        if (!citySelect) {
                            return;
                        }

                        const stateCode =
                            stateSelect.value;

                        if (!stateCode) {

                            citySelect.innerHTML = `
                                <option value="">
                                    Select state first
                                </option>
                            `;

                            citySelect.disabled =
                                true;

                            return;
                        }

                        citySelect.disabled =
                            true;

                        citySelect.innerHTML = `
                            <option value="">
                                Loading cities...
                            </option>
                        `;

                        try {

                            const cityResponse =
                                await fetch(
                                    `https://dynamic-form-builder-backend-1jjb.onrender.com/api/locations/cities/${stateCode}`
                                );

                            const cityResult =
                                await cityResponse.json();

                            const cities =
                                Array.isArray(
                                    cityResult.data
                                )
                                    ? cityResult.data
                                    : [];

                            citySelect.innerHTML = `
                                <option value="">
                                    Select city
                                </option>
                            `;

                            cities.forEach(
                                function(city) {

                                    const option =
                                        document.createElement(
                                            "option"
                                        );

                                    option.value =
                                        city.name;

                                    option.textContent =
                                        city.name;

                                    citySelect.appendChild(
                                        option
                                    );

                                }
                            );

                            citySelect.disabled =
                                false;

                        }

                        catch (error) {

                            console.error(
                                "City loading error:",
                                error
                            );

                            citySelect.innerHTML = `
                                <option value="">
                                    Unable to load cities
                                </option>
                            `;

                        }

                    }
                );

            }
        );

    }

    catch (error) {

        console.error(
            "State loading error:",
            error
        );

    }

}
function isCanvasBlank(canvas) {

    const blankCanvas =
        document.createElement(
            "canvas"
        );

    blankCanvas.width =
        canvas.width;

    blankCanvas.height =
        canvas.height;

    return (
        canvas.toDataURL() ===
        blankCanvas.toDataURL()
    );

}