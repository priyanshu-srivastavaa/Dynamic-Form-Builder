function escapeHtml(value) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}




// ==========================================
// RENDER PREVIEW
// ==========================================

function renderPreview() {

    previewArea.innerHTML =
        "";


    if (
        form.length === 0
    ) {

        previewArea.innerHTML = `

            <div class="preview-empty">

                <div class="preview-empty-icon">
                    📄
                </div>

                <h3>
                    No fields added
                </h3>

                <p>
                    Add fields in the builder
                    to see the live form preview.
                </p>

            </div>

        `;


        return;

    }


    form.forEach(
        function (field) {

            const rule =
                checkRule(
                    field
                );


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "preview-field";


            wrapper.dataset.fieldId =
                field.id;


            const label =
                escapeHtml(
                    field.label ||
                    "Untitled Field"
                );


            const placeholder =
                escapeHtml(
                    field.placeholder ||
                    ""
                );


            let html =
                "";
                




            // ======================================
            // CUSTOM TIME PICKER
            // ======================================

            previewArea
                .querySelectorAll(
                    ".custom-time-picker"
                )
                .forEach(
                    function (picker) {

                        const hourSelect =
                            picker.querySelector(
                                ".time-hour"
                            );

                        const minuteSelect =
                            picker.querySelector(
                                ".time-minute"
                            );

                        const periodSelect =
                            picker.querySelector(
                                ".time-period"
                            );

                        const hiddenInput =
                            picker.querySelector(
                                'input[type="hidden"]'
                            );


                        function updateTimeValue() {

                            const hour =
                                hourSelect.value;

                            const minute =
                                minuteSelect.value;

                            const period =
                                periodSelect.value;


                            if (
                                !hour ||
                                !minute
                            ) {

                                hiddenInput.value =
                                    "";

                                return;

                            }


                            let hour24 =
                                Number(hour);


                            if (
                                period === "AM" &&
                                hour24 === 12
                            ) {

                                hour24 = 0;

                            }


                            if (
                                period === "PM" &&
                                hour24 !== 12
                            ) {

                                hour24 += 12;

                            }


                            hiddenInput.value =

                                String(hour24)
                                    .padStart(2, "0")

                                + ":"

                                + minute;


                            hiddenInput.dispatchEvent(
                                new Event(
                                    "change",
                                    {
                                        bubbles: true
                                    }
                                )
                            );

                        }


                        hourSelect.addEventListener(
                            "change",
                            updateTimeValue
                        );


                        minuteSelect.addEventListener(
                            "change",
                            updateTimeValue
                        );


                        periodSelect.addEventListener(
                            "change",
                            updateTimeValue
                        );

                    }
                );


            // ======================================
            // SECTION HEADING
            // ======================================

            if (
                field.type ===
                "section"
            ) {

                wrapper.classList.add(
                    "preview-section-heading"
                );


                html = `

                    <div class="section-heading-content">

                        <span class="section-heading-line"></span>

                        <div>

                            <span class="section-heading-kicker">
                                Section
                            </span>

                            <h2>
                                ${label}
                            </h2>

                        </div>

                    </div>

                `;


                wrapper.innerHTML =
                    html;


                if (
                    !rule.visible
                ) {

                    wrapper.style.display =
                        "none";

                }


                previewArea.appendChild(
                    wrapper
                );


                return;

            }


            // ======================================
            // NORMAL FIELD LABEL
            // ======================================

            if (
                field.type !==
                "checkbox"
            ) {

                html += `

                    <label>

                        ${label}

                        ${
                            field.required

                                ? '<span class="required-star">*</span>'

                                : ""
                        }

                    </label>

                `;

            }


            switch (
                field.type
            ) {

                case "text":

                    html += `

                        <input
                            id="preview-field-${field.id}"
                            type="text"
                            name="${field.id}"
                            placeholder="${placeholder}"
                            minlength="${field.minLength ?? 0}"
                            maxlength="${field.maxLength ?? 100}"
                            ${field.required ? "required" : ""}
                            ${rule.disabled ? "disabled" : ""}
                        >

                    `;

                    break;


                case "email":

                    html += `

                        <input
                            id="preview-field-${field.id}"
                            type="email"
                            name="${field.id}"
                            placeholder="${placeholder}"
                            minlength="${field.minLength ?? 0}"
                            maxlength="${field.maxLength ?? 100}"
                            autocomplete="email"
                            ${field.required ? "required" : ""}
                            ${rule.disabled ? "disabled" : ""}
                        >

                    `;

                    break;


                case "phone":

                    html += `

                        <input
                            id="preview-field-${field.id}"
                            type="tel"
                            name="${field.id}"
                            placeholder="${placeholder}"
                            minlength="${field.minLength ?? 7}"
                            maxlength="${field.maxLength ?? 20}"
                            autocomplete="tel"
                            inputmode="tel"
                            ${field.required ? "required" : ""}
                            ${rule.disabled ? "disabled" : ""}
                        >

                    `;

                    break;


                case "url":

                    html += `

                        <input
                            id="preview-field-${field.id}"
                            type="url"
                            name="${field.id}"
                            placeholder="${placeholder || "https://example.com"}"
                            autocomplete="url"
                            inputmode="url"
                            ${field.required ? "required" : ""}
                            ${rule.disabled ? "disabled" : ""}
                        >

                    `;

                    break;


                case "time":

                    html += `

                        <div
                            class="custom-time-picker"
                            data-time-picker="${field.id}"
                        >

                            <div class="time-select-box">

                                <span class="time-small-label">
                                    Hour
                                </span>

                                <select
                                    class="time-hour"
                                    ${rule.disabled ? "disabled" : ""}
                                >

                                    <option value="">
                                        HH
                                    </option>

                                    ${Array.from(
                                        { length: 12 },
                                        (_, i) => i + 1
                                    ).map(hour => `

                                        <option value="${hour}">
                                            ${String(hour).padStart(2, "0")}
                                        </option>

                                    `).join("")}

                                </select>

                            </div>


                            <span class="time-separator">
                                :
                            </span>


                            <div class="time-select-box">

                                <span class="time-small-label">
                                    Minute
                                </span>

                                <select
                                    class="time-minute"
                                    ${rule.disabled ? "disabled" : ""}
                                >

                                    <option value="">
                                        MM
                                    </option>

                                    ${[
                                        "00",
                                        "05",
                                        "10",
                                        "15",
                                        "20",
                                        "25",
                                        "30",
                                        "35",
                                        "40",
                                        "45",
                                        "50",
                                        "55"
                                    ].map(minute => `

                                        <option value="${minute}">
                                            ${minute}
                                        </option>

                                    `).join("")}

                                </select>

                            </div>


                            <div class="time-select-box time-period-box">

                                <span class="time-small-label">
                                    Period
                                </span>

                                <select
                                    class="time-period"
                                    ${rule.disabled ? "disabled" : ""}
                                >

                                    <option value="AM">
                                        AM
                                    </option>

                                    <option value="PM">
                                        PM
                                    </option>

                                </select>

                            </div>


                            <div class="time-picker-icon">
                                🕒
                            </div>


                            <input
                                type="hidden"
                                id="preview-field-${field.id}"
                                name="${field.id}"
                                value=""
                            >

                        </div>

                    `;

                    break;


                case "datetime":

                    html += `

                        <div
                            class="professional-datetime"
                            data-datetime-picker="${field.id}"
                        >

                            <button
                                type="button"
                                class="datetime-display"
                                ${rule.disabled ? "disabled" : ""}
                            >

                                <span class="datetime-display-icon">
                                    📅
                                </span>

                                <span class="datetime-display-content">

                                    <strong class="datetime-display-value">
                                        Select date & time
                                    </strong>

                                    <small>
                                        Choose appointment date and time
                                    </small>

                                </span>

                                <span class="datetime-display-arrow">
                                    ▾
                                </span>

                            </button>


                            <div class="datetime-popover">

                                <div class="datetime-calendar-header">

                                    <button
                                        type="button"
                                        class="datetime-prev-month"
                                    >
                                        ‹
                                    </button>

                                    <strong class="datetime-current-month">
                                    </strong>

                                    <button
                                        type="button"
                                        class="datetime-next-month"
                                    >
                                        ›
                                    </button>

                                </div>


                                <div class="datetime-weekdays">

                                    <span>Su</span>
                                    <span>Mo</span>
                                    <span>Tu</span>
                                    <span>We</span>
                                    <span>Th</span>
                                    <span>Fr</span>
                                    <span>Sa</span>

                                </div>


                                <div class="datetime-days"></div>


                                <div class="datetime-time-section">

                                    <div class="datetime-time-title">

                                        <span>🕒</span>

                                        <div>

                                            <strong>
                                                Time
                                            </strong>

                                            <small>
                                                Select preferred time
                                            </small>

                                        </div>

                                    </div>


                                    <div class="datetime-time-controls">

                                        <select class="datetime-hour">

                                            ${Array.from(
                                                { length: 12 },
                                                (_, i) => i + 1
                                            ).map(hour => `

                                                <option value="${hour}">
                                                    ${String(hour).padStart(2, "0")}
                                                </option>

                                            `).join("")}

                                        </select>


                                        <span class="datetime-colon">
                                            :
                                        </span>


                                        <select class="datetime-minute">

                                            ${[
                                                "00",
                                                "05",
                                                "10",
                                                "15",
                                                "20",
                                                "25",
                                                "30",
                                                "35",
                                                "40",
                                                "45",
                                                "50",
                                                "55"
                                            ].map(minute => `

                                                <option value="${minute}">
                                                    ${minute}
                                                </option>

                                            `).join("")}

                                        </select>


                                        <select class="datetime-period">

                                            <option value="AM">
                                                AM
                                            </option>

                                            <option value="PM">
                                                PM
                                            </option>

                                        </select>

                                    </div>

                                </div>


                                <div class="datetime-footer">

                                    <button
                                        type="button"
                                        class="datetime-today-btn"
                                    >
                                        Today
                                    </button>


                                    <button
                                        type="button"
                                        class="datetime-apply-btn"
                                    >
                                        Apply
                                    </button>

                                </div>

                            </div>


                            <input
                                type="hidden"
                                id="preview-field-${field.id}"
                                name="${field.id}"
                                value=""
                                ${rule.disabled ? "disabled" : ""}
                            >

                        </div>

                    `;

                    break;

                    case "multiselect":

                    const multiOptions =
                        Array.isArray(
                            field.options
                        )
                            ? field.options
                            : [];


                    html += `

                        <div class="multi-select-group">

                            ${
                                multiOptions.map(
                                    function (
                                        option,
                                        index
                                    ) {

                                        const safeOption =
                                            escapeHtml(
                                                option
                                            );


                                        return `

                                            <label
                                                class="multi-select-option"
                                                for="preview-field-${field.id}-${index}"
                                            >

                                                <input
                                                    id="preview-field-${field.id}-${index}"
                                                    type="checkbox"
                                                    name="${field.id}"
                                                    value="${safeOption}"
                                                    ${rule.disabled ? "disabled" : ""}
                                                >

                                                <span class="multi-select-check">
                                                    ✓
                                                </span>

                                                <span class="multi-select-text">
                                                    ${safeOption}
                                                </span>

                                            </label>

                                        `;

                                    }
                                ).join("")
                            }

                        </div>

                    `;

                    break;

                    case "address":

    html += `

        <div
            class="address-field-group"
            data-address-field="${field.id}"
        >

            <div class="address-full">

                <span class="address-sub-label">
                    Address Line
                </span>

                <input
                    type="text"
                    name="${field.id}-addressLine"
                    class="address-line-input"
                    placeholder="House no., street, area"
                    ${rule.disabled ? "disabled" : ""}
                >

            </div>


            <div>

                <span class="address-sub-label">
                    City
                </span>

                <input
                    type="text"
                    name="${field.id}-city"
                    class="address-city-input"
                    placeholder="City"
                    ${rule.disabled ? "disabled" : ""}
                >

            </div>


            <div>

                <span class="address-sub-label">
                    State
                </span>

                <input
                    type="text"
                    name="${field.id}-state"
                    class="address-state-input"
                    placeholder="State"
                    ${rule.disabled ? "disabled" : ""}
                >

            </div>


            <div>

                <span class="address-sub-label">
                    Pincode
                </span>

                <input
                    type="text"
                    name="${field.id}-pincode"
                    class="address-pincode-input"
                    placeholder="Pincode"
                    inputmode="numeric"
                    maxlength="10"
                    ${rule.disabled ? "disabled" : ""}
                >

            </div>


            <div>

                <span class="address-sub-label">
                    Country
                </span>

                <input
                    type="text"
                    name="${field.id}-country"
                    class="address-country-input"
                    placeholder="Country"
                    ${rule.disabled ? "disabled" : ""}
                >

            </div>


            <input
                type="hidden"
                id="preview-field-${field.id}"
                name="${field.id}"
                value=""
                ${rule.disabled ? "disabled" : ""}
            >

        </div>

    `;

    break;

   case "name":

    html += `

        <div
            class="name-field-group ${
                field.includeMiddleName
                    ? "with-middle-name"
                    : "without-middle-name"
            }"
            data-name-field="${field.id}"
        >

            <div>

                <span class="name-sub-label">
                    First Name
                </span>

                <input
                    type="text"
                    name="${field.id}-firstName"
                    class="name-first-input"
                    placeholder="First name"
                    autocomplete="given-name"
                    ${rule.disabled ? "disabled" : ""}
                >

            </div>


            ${
                field.includeMiddleName

                    ? `

                        <div>

                            <span class="name-sub-label">
                                Middle Name
                                <small>
                                    (Optional)
                                </small>
                            </span>

                            <input
                                type="text"
                                name="${field.id}-middleName"
                                class="name-middle-input"
                                placeholder="Middle name"
                                autocomplete="additional-name"
                                ${rule.disabled ? "disabled" : ""}
                            >

                        </div>

                    `

                    : ""
            }


            <div>

                <span class="name-sub-label">
                    Last Name
                </span>

                <input
                    type="text"
                    name="${field.id}-lastName"
                    class="name-last-input"
                    placeholder="Last name"
                    autocomplete="family-name"
                    ${rule.disabled ? "disabled" : ""}
                >

            </div>


            <input
                type="hidden"
                id="preview-field-${field.id}"
                name="${field.id}"
                value=""
                ${rule.disabled ? "disabled" : ""}
            >

        </div>

    `;

    break;

    case "scale":

    html += `

        <div
            class="scale-field-group"
            data-scale-field="${field.id}"
        >

            <div class="scale-options">

                ${
                    Array.from(
                        {
                            length:
                                (field.maxValue ?? 10)
                                -
                                (field.minValue ?? 1)
                                +
                                1
                        },
                        (_, index) =>
                            (field.minValue ?? 1) + index
                    )
                    .map(
                        function (value) {

                            return `

                                <label
                                    class="scale-option"
                                    for="preview-field-${field.id}-${value}"
                                >

                                    <input
                                        id="preview-field-${field.id}-${value}"
                                        type="radio"
                                        name="${field.id}"
                                        value="${value}"
                                        ${field.required ? "required" : ""}
                                        ${rule.disabled ? "disabled" : ""}
                                    >

                                    <span>
                                        ${value}
                                    </span>

                                </label>

                            `;

                        }
                    )
                    .join("")
                }

            </div>

        </div>

    `;

    break;

    
    case "range":

    const rangeMin =
        Number(
            field.minValue ?? 0
        );

    const rangeMax =
        Number(
            field.maxValue ?? 100
        );

    let rangeValue =
        Number(
            field.placeholder ?? 50
        );

    if (
        rangeValue < rangeMin
    ) {
        rangeValue =
            rangeMin;
    }

    if (
        rangeValue > rangeMax
    ) {
        rangeValue =
            rangeMax;
    }

    html += `
    <div
        class="range-field-group"
        data-range-field="${field.id}"
    >

        <div class="range-slider-wrap">

            <input
                id="preview-field-${field.id}"
                class="range-input"
                type="range"
                name="${field.id}"
                min="${rangeMin}"
                max="${rangeMax}"
                value="${rangeValue}"
                step="1"
                data-range-touched="false"
                ${rule.disabled ? "disabled" : ""}
            >

            <span class="range-current-value">
                ${rangeValue}
            </span>

        </div>

        <div class="range-limits">
            <span>${rangeMin}</span>
            <span>${rangeMax}</span>
        </div>

    </div>
`;

    break;

    case "yesno":

    html += `
        <div
            class="yesno-field-group"
            data-yesno-field="${field.id}"
        >

            <input
                type="radio"
                id="preview-field-${field.id}-yes"
                name="${field.id}"
                value="Yes"
                class="yesno-input"
                ${field.required ? "required" : ""}
                ${rule.disabled ? "disabled" : ""}
            >

            <label
                for="preview-field-${field.id}-yes"
                class="yesno-option yes-option"
            >
                ✓ Yes
            </label>


            <input
                type="radio"
                id="preview-field-${field.id}-no"
                name="${field.id}"
                value="No"
                class="yesno-input"
                ${field.required ? "required" : ""}
                ${rule.disabled ? "disabled" : ""}
            >

            <label
                for="preview-field-${field.id}-no"
                class="yesno-option no-option"
            >
                ✕ No
            </label>

        </div>
    `;

    break;

    case "imagechoice":

    const imageOptions =
        Array.isArray(field.options)
            ? field.options
            : [];

    html += `
        <div
            class="image-choice-group"
            data-image-choice-field="${field.id}"
        >

            ${imageOptions.map(
                function(option, index) {

                    const safeLabel =
                        escapeHtml(
                            option.label || `Option ${index + 1}`
                        );

                    const imageUrl =
                        escapeHtml(
                            option.image || ""
                        );

                    return `
                        <label
                            class="image-choice-option"
                            for="preview-field-${field.id}-${index}"
                        >

                            <input
                                id="preview-field-${field.id}-${index}"
                                type="radio"
                                name="${field.id}"
                                value="${safeLabel}"
                                class="image-choice-input"
                                ${field.required ? "required" : ""}
                                ${rule.disabled ? "disabled" : ""}
                            >

                            <div class="image-choice-card">

                                ${
                                    imageUrl
                                        ? `
                                            <img
                                                src="${imageUrl}"
                                                alt="${safeLabel}"
                                                class="image-choice-img"
                                            >
                                        `
                                        : `
                                            <div class="image-choice-placeholder">
                                                🖼
                                            </div>
                                        `
                                }

                                <span class="image-choice-label">
                                    ${safeLabel}
                                </span>

                            </div>

                        </label>
                    `;

                }
            ).join("")}

        </div>
    `;

    break;

    case "currency":

    html += `

        <div
            class="currency-field-group"
            data-currency-field="${field.id}"
        >

            <span class="currency-symbol">
                ₹
            </span>

            <input
                id="preview-field-${field.id}"
                type="number"
                name="${field.id}"
                class="currency-input"
                placeholder="${placeholder || "Enter amount"}"
                min="${field.minValue ?? 0}"
                max="${field.maxValue ?? 1000000}"
                step="0.01"
                inputmode="decimal"
                ${field.required ? "required" : ""}
                ${rule.disabled ? "disabled" : ""}
            >

        </div>

    `;

    break;

    case "password":

    html += `

        <div
            class="password-field-group"
            data-password-field="${field.id}"
        >

            <input
                id="preview-field-${field.id}"
                type="password"
                name="${field.id}"
                class="password-input"
                placeholder="${placeholder || "Enter password"}"
                minlength="${field.minLength ?? 6}"
                maxlength="${field.maxLength ?? 50}"
                autocomplete="current-password"
                ${field.required ? "required" : ""}
                ${rule.disabled ? "disabled" : ""}
            >

            <button
                type="button"
                class="password-toggle"
                aria-label="Show password"
                ${rule.disabled ? "disabled" : ""}
            >
                👁
            </button>

        </div>

    `;

    break;

    case "signature":

    html += `

        <div
            class="signature-field-group"
            data-signature-field="${field.id}"
        >

            <div class="signature-mode-tabs">

                <button
                    type="button"
                    class="signature-mode-btn active"
                    data-mode="draw"
                >
                    Draw
                </button>

                <button
                    type="button"
                    class="signature-mode-btn"
                    data-mode="upload"
                >
                    Upload
                </button>

            </div>


            <div
                class="signature-draw-panel"
            >

                <div class="signature-canvas-wrap">

                    <canvas
                        class="signature-canvas"
                        width="600"
                        height="180"
                    ></canvas>

                    <span class="signature-placeholder">
                        Sign here
                    </span>

                </div>

                <div class="signature-actions">

                    <button
                        type="button"
                        class="signature-clear-btn"
                        ${rule.disabled ? "disabled" : ""}
                    >
                        Clear
                    </button>

                </div>

            </div>


            <div
                class="signature-upload-panel"
                style="display:none;"
            >

                <input
                    type="file"
                    class="signature-upload-input"
                    accept=".png,.jpg,.jpeg"
                    ${rule.disabled ? "disabled" : ""}
                >

                <small>
                    Upload PNG, JPG or JPEG signature image
                </small>

            </div>


            <input
                type="hidden"
                id="preview-field-${field.id}"
                name="${field.id}"
                value=""
                data-signature-mode="draw"
                ${rule.disabled ? "disabled" : ""}
            >

        </div>

    `;

    break;

    case "matrix":

    const matrixRows =
        Array.isArray(field.rows) &&
        field.rows.length
            ? field.rows
            : [
                "Service",
                "Quality",
                "Support"
            ];

    const matrixColumns =
        Array.isArray(field.columns) &&
        field.columns.length
            ? field.columns
            : [
                "Poor",
                "Average",
                "Good",
                "Excellent"
            ];

    html += `

        <div
            class="matrix-field-group"
            data-matrix-field="${field.id}"
        >

            <div class="matrix-scroll">

                <table class="matrix-table">

                    <thead>

                        <tr>

                            <th></th>

                            ${matrixColumns
                                .map(
                                    column => `
                                        <th>
                                            ${column}
                                        </th>
                                    `
                                )
                                .join("")}

                        </tr>

                    </thead>


                    <tbody>

                        ${matrixRows
                            .map(
                                (row, rowIndex) => `

                                    <tr>

                                        <th>
                                            ${row}
                                        </th>

                                        ${matrixColumns
                                            .map(
                                                column => `

                                                    <td>

                                                        <label
                                                            class="matrix-option"
                                                        >

                                                            <input
                                                                type="radio"
                                                                name="${field.id}-${rowIndex}"
                                                                value="${column}"
                                                                data-matrix-row="${row}"
                                                                ${rule.disabled ? "disabled" : ""}
                                                            >

                                                            <span></span>

                                                        </label>

                                                    </td>

                                                `
                                            )
                                            .join("")}

                                    </tr>

                                `
                            )
                            .join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

    break;
    case "checkboxgroup":

    const checkboxOptions =
        Array.isArray(field.options)
            ? field.options
            : [];

    html += `
        <div class="checkbox-group">

            ${checkboxOptions.map(
                function(option, index) {

                    const safeOption =
                        escapeHtml(option);

                    return `
                        <label
                            class="checkbox-group-option"
                            for="preview-field-${field.id}-${index}"
                        >

                            <input
                                id="preview-field-${field.id}-${index}"
                                type="checkbox"
                                name="${field.id}"
                                value="${safeOption}"
                                ${rule.disabled ? "disabled" : ""}
                            >

                            <span>
                                ${safeOption}
                            </span>

                        </label>
                    `;

                }
            ).join("")}

        </div>
    `;

    break;


                case "textarea":

                    html += `

                        <textarea
                            id="preview-field-${field.id}"
                            name="${field.id}"
                            placeholder="${placeholder}"
                            minlength="${field.minLength ?? 0}"
                            maxlength="${field.maxLength ?? 500}"
                            rows="5"
                            ${field.required ? "required" : ""}
                            ${rule.disabled ? "disabled" : ""}
                        ></textarea>

                    `;

                    break;


                case "radio":

                    const radioOptions =
                        Array.isArray(
                            field.options
                        )
                            ? field.options
                            : [];


                    html += `

                        <div
                            class="radio-group"
                            role="radiogroup"
                        >

                            ${
                                radioOptions.map(
                                    function (
                                        option,
                                        index
                                    ) {

                                        const safeOption =
                                            escapeHtml(
                                                option
                                            );


                                        return `

                                            <label
                                                class="checkbox-label"
                                                for="preview-field-${field.id}-${index}"
                                            >

                                                <input
                                                    id="preview-field-${field.id}-${index}"
                                                    type="radio"
                                                    name="${field.id}"
                                                    value="${safeOption}"
                                                    ${
                                                        field.required
                                                            ? "required"
                                                            : ""
                                                    }
                                                    ${
                                                        rule.disabled
                                                            ? "disabled"
                                                            : ""
                                                    }
                                                >

                                                <span>
                                                    ${safeOption}
                                                </span>

                                            </label>

                                        `;

                                    }
                                ).join("")
                            }

                        </div>

                    `;

                    break;


                case "file":

                    html += `

                        <input
                            id="preview-field-${field.id}"
                            type="file"
                            name="${field.id}"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                            ${field.required ? "required" : ""}
                            ${rule.disabled ? "disabled" : ""}
                        >

                        <small
                            style="
                                display:block;
                                margin-top:7px;
                                color:var(--muted);
                                font-size:10px;
                            "
                        >
                            PDF, DOC, DOCX, JPG, PNG or TXT.
                            Maximum file size: 10 MB.
                        </small>

                    `;

                    break;


                case "rating":

                    html += `

                        <div
                            class="rating-group"
                            role="radiogroup"
                            aria-label="${label}"
                        >

                            ${
                                [1, 2, 3, 4, 5]
                                    .map(
                                        function (
                                            rating
                                        ) {

                                            return `

                                                <input
                                                    id="preview-field-${field.id}-${rating}"
                                                    class="rating-input"
                                                    type="radio"
                                                    name="${field.id}"
                                                    value="${rating}"
                                                    ${
                                                        rule.disabled
                                                            ? "disabled"
                                                            : ""
                                                    }
                                                >

                                                <label
                                                    class="rating-star"
                                                    for="preview-field-${field.id}-${rating}"
                                                    title="${rating} star${rating > 1 ? "s" : ""}"
                                                >
                                                    ★
                                                </label>

                                            `;

                                        }
                                    )
                                    .join("")
                            }

                        </div>

                        <small class="rating-hint">
                            Select a rating from 1 to 5
                        </small>

                    `;

                    break;


                case "number":

                    html += `

                        <input
                            id="preview-field-${field.id}"
                            type="number"
                            name="${field.id}"
                            placeholder="${placeholder}"
                            min="${field.minValue ?? 0}"
                            max="${field.maxValue ?? 100}"
                            ${field.required ? "required" : ""}
                            ${rule.disabled ? "disabled" : ""}
                        >

                    `;

                    break;


                case "date":

                    html += `

                        <input
                            id="preview-field-${field.id}"
                            type="date"
                            name="${field.id}"
                            ${field.required ? "required" : ""}
                            ${rule.disabled ? "disabled" : ""}
                        >

                    `;

                    break;


                case "checkbox":

                    html += `

                        <label
                            class="checkbox-label"
                            for="preview-field-${field.id}"
                        >

                            <input
                                id="preview-field-${field.id}"
                                type="checkbox"
                                name="${field.id}"
                                ${field.required ? "required" : ""}
                                ${rule.disabled ? "disabled" : ""}
                            >

                            <span>

                                ${label}

                                ${
                                    field.required

                                        ? '<span class="required-star">*</span>'

                                        : ""
                                }

                            </span>

                        </label>

                    `;

                    break;


                case "dropdown":

                    const options =
                        Array.isArray(
                            field.options
                        )
                            ? field.options
                            : [];


                    html += `

                        <select
                            id="preview-field-${field.id}"
                            name="${field.id}"
                            ${field.required ? "required" : ""}
                            ${rule.disabled ? "disabled" : ""}
                        >

                            <option value="">
                                Select an option
                            </option>

                            ${
                                options.map(
                                    function (
                                        option
                                    ) {

                                        const safeOption =
                                            escapeHtml(
                                                option
                                            );


                                        return `

                                            <option
                                                value="${safeOption}"
                                            >
                                                ${safeOption}
                                            </option>

                                        `;

                                    }
                                ).join("")
                            }

                        </select>

                    `;

                    break;

            }


            if (
                !rule.visible
            ) {

                wrapper.style.display =
                    "none";

            }


            wrapper.innerHTML =
                html;


            previewArea.appendChild(
                wrapper
            );

        }
    );

    // ==========================================
// RANGE SLIDER LIVE VALUE
// ==========================================

previewArea
    .querySelectorAll(
        ".range-field-group"
    )
    .forEach(
        function (group) {

            const rangeInput =
                group.querySelector(
                    ".range-input"
                );

            const valueText =
                group.querySelector(
                    ".range-current-value"
                );

            if (
                !rangeInput ||
                !valueText
            ) {
                return;
            }

            const initialMin =
    Number(rangeInput.min);

const initialMax =
    Number(rangeInput.max);

const initialValue =
    Number(rangeInput.value);

const initialPercent =
    ((initialValue - initialMin) /
    (initialMax - initialMin)) * 100;

valueText.style.left =
    `${initialPercent}%`;

rangeInput.style.setProperty(
    "--range-progress",
    `${initialPercent}%`
);

           rangeInput.addEventListener(
    "input",
    function () {

        valueText.textContent =
            this.value;

            const min =
    Number(this.min);

const max =
    Number(this.max);

const value =
    Number(this.value);

const percent =
    ((value - min) /
    (max - min)) * 100;

valueText.style.left =
    `${percent}%`;

this.style.setProperty(
    "--range-progress",
    `${percent}%`
);

        this.dataset.rangeTouched =
            "true";

        group.classList.add(
            "range-selected"
        );

    }
);

 }
   
);

    applyRules();


    previewArea
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(
            function (input) {

                input.addEventListener(
                    "input",
                    applyRules
                );


                input.addEventListener(
                    "change",
                    applyRules
                );

            }
        );

        previewArea
    .querySelectorAll(
        ".password-field-group"
    )
    .forEach(
        function (group) {

            const input =
                group.querySelector(
                    ".password-input"
                );

            const toggle =
                group.querySelector(
                    ".password-toggle"
                );


            if (
                !input ||
                !toggle
            ) {

                return;

            }


            toggle.addEventListener(
                "click",
                function () {

                    const hidden =
                        input.type ===
                        "password";


                    input.type =
                        hidden
                            ? "text"
                            : "password";


                    toggle.textContent =
                        hidden
                            ? "🙈"
                            : "👁";


                    toggle.setAttribute(
                        "aria-label",
                        hidden
                            ? "Hide password"
                            : "Show password"
                    );

                }
            );

        }
    );

    // =====================================================
// SIGNATURE DRAWING
// =====================================================

previewArea
    .querySelectorAll(
        ".signature-field-group"
    )
    .forEach(
        function (group) {

            const canvas =
                group.querySelector(
                    ".signature-canvas"
                );

            const clearBtn =
                group.querySelector(
                    ".signature-clear-btn"
                );

            const hiddenInput =
                group.querySelector(
                    'input[type="hidden"]'
                );

            const placeholder =
                group.querySelector(
                    ".signature-placeholder"
                );
                const modeButtons =
    group.querySelectorAll(
        ".signature-mode-btn"
    );

const drawPanel =
    group.querySelector(
        ".signature-draw-panel"
    );

const uploadPanel =
    group.querySelector(
        ".signature-upload-panel"
    );

const uploadInput =
    group.querySelector(
        ".signature-upload-input"
    );


            if (
                !canvas ||
                !hiddenInput
            ) {

                return;

            }


            const ctx =
                canvas.getContext("2d");


            let drawing =
                false;


            function getPosition(event) {

                const rect =
                    canvas.getBoundingClientRect();


                const point =
                    event.touches
                        ? event.touches[0]
                        : event;


                return {

                    x:
                        (
                            point.clientX -
                            rect.left
                        ) *
                        (
                            canvas.width /
                            rect.width
                        ),

                    y:
                        (
                            point.clientY -
                            rect.top
                        ) *
                        (
                            canvas.height /
                            rect.height
                        )

                };

            }


            function startDrawing(event) {

                event.preventDefault();

                drawing =
                    true;


                const pos =
                    getPosition(
                        event
                    );


                ctx.beginPath();

                ctx.moveTo(
                    pos.x,
                    pos.y
                );


                if (placeholder) {

                    placeholder.style.display =
                        "none";

                }

            }


            function draw(event) {

                if (
                    !drawing
                ) {

                    return;

                }


                event.preventDefault();


                const pos =
                    getPosition(
                        event
                    );


                ctx.lineWidth =
                    2;

                ctx.lineCap =
                    "round";

                ctx.lineJoin =
                    "round";

                ctx.strokeStyle =
                    "#111827";


                ctx.lineTo(
                    pos.x,
                    pos.y
                );


                ctx.stroke();

            }


            function stopDrawing() {

                if (
                    !drawing
                ) {

                    return;

                }


                drawing =
                    false;


                ctx.closePath();


                hiddenInput.value =
                    canvas.toDataURL(
                        "image/png"
                    );


                hiddenInput.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles:
                                true
                        }
                    )
                );

            }


            canvas.addEventListener(
                "mousedown",
                startDrawing
            );

            canvas.addEventListener(
                "mousemove",
                draw
            );

            canvas.addEventListener(
                "mouseup",
                stopDrawing
            );

            canvas.addEventListener(
                "mouseleave",
                stopDrawing
            );


            canvas.addEventListener(
                "touchstart",
                startDrawing,
                {
                    passive:
                        false
                }
            );

            canvas.addEventListener(
                "touchmove",
                draw,
                {
                    passive:
                        false
                }
            );

            canvas.addEventListener(
                "touchend",
                stopDrawing
            );


            if (clearBtn) {

                clearBtn.addEventListener(
                    "click",
                    function () {

                        ctx.clearRect(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );


                        hiddenInput.value =
                            "";


                        if (placeholder) {

                            placeholder.style.display =
                                "";

                        }


                        hiddenInput.dispatchEvent(
                            new Event(
                                "change",
                                {
                                    bubbles:
                                        true
                                }
                            )
                        );

                    }
                     
                );

            }

            modeButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const mode =
                    this.dataset.mode;


                modeButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                hiddenInput.dataset.signatureMode =
                    mode;


                if (
                    mode === "draw"
                ) {

                    drawPanel.style.display =
                        "";

                    uploadPanel.style.display =
                        "none";


                    if (uploadInput) {

                        uploadInput.value =
                            "";

                    }

                }

                else {

                    drawPanel.style.display =
                        "none";

                    uploadPanel.style.display =
                        "";

                    hiddenInput.value =
                        "";

                }

            }
        );

    }
);

        }
    );
    


    // =====================================================
    // PROFESSIONAL DATE & TIME PICKER
    // =====================================================

    previewArea
        .querySelectorAll(
            ".professional-datetime"
        )
        .forEach(
            function (picker) {

                const displayButton =
                    picker.querySelector(
                        ".datetime-display"
                    );


                const displayValue =
                    picker.querySelector(
                        ".datetime-display-value"
                    );


                const popover =
                    picker.querySelector(
                        ".datetime-popover"
                    );


                const monthTitle =
                    picker.querySelector(
                        ".datetime-current-month"
                    );


                const daysContainer =
                    picker.querySelector(
                        ".datetime-days"
                    );


                const previousButton =
                    picker.querySelector(
                        ".datetime-prev-month"
                    );


                const nextButton =
                    picker.querySelector(
                        ".datetime-next-month"
                    );


                const todayButton =
                    picker.querySelector(
                        ".datetime-today-btn"
                    );


                const applyButton =
                    picker.querySelector(
                        ".datetime-apply-btn"
                    );


                const hourSelect =
                    picker.querySelector(
                        ".datetime-hour"
                    );


                const minuteSelect =
                    picker.querySelector(
                        ".datetime-minute"
                    );


                const periodSelect =
                    picker.querySelector(
                        ".datetime-period"
                    );


                const hiddenInput =
                    picker.querySelector(
                        'input[type="hidden"]'
                    );


                const monthNames = [

                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"

                ];


                const shortMonthNames = [

                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"

                ];


                const now =
                    new Date();


                let currentMonth =
                    now.getMonth();


                let currentYear =
                    now.getFullYear();


                let selectedDate =
                    null;


                // ======================================
                // RENDER CALENDAR
                // ======================================

                function renderCalendar() {

                    monthTitle.textContent =

                        monthNames[
                            currentMonth
                        ]

                        + " "

                        + currentYear;


                    daysContainer.innerHTML =
                        "";


                    const firstDay =
                        new Date(

                            currentYear,

                            currentMonth,

                            1

                        ).getDay();


                    const totalDays =
                        new Date(

                            currentYear,

                            currentMonth + 1,

                            0

                        ).getDate();


                    for (
                        let i = 0;
                        i < firstDay;
                        i++
                    ) {

                        const empty =
                            document.createElement(
                                "span"
                            );


                        empty.className =
                            "datetime-empty-day";


                        daysContainer.appendChild(
                            empty
                        );

                    }


                    for (
                        let day = 1;
                        day <= totalDays;
                        day++
                    ) {

                        const button =
                            document.createElement(
                                "button"
                            );


                        button.type =
                            "button";


                        button.className =
                            "datetime-day";


                        button.textContent =
                            day;


                        const currentDate =
                            new Date(

                                currentYear,

                                currentMonth,

                                day

                            );


                        const isToday =

                            day ===
                                now.getDate()

                            &&

                            currentMonth ===
                                now.getMonth()

                            &&

                            currentYear ===
                                now.getFullYear();


                        if (
                            isToday
                        ) {

                            button.classList.add(
                                "today"
                            );

                        }


                        if (
                            selectedDate

                            &&

                            day ===
                                selectedDate.getDate()

                            &&

                            currentMonth ===
                                selectedDate.getMonth()

                            &&

                            currentYear ===
                                selectedDate.getFullYear()
                        ) {

                            button.classList.add(
                                "selected"
                            );

                        }


                        /*
                            IMPORTANT FIX:
                            Date click popup ko close nahi karega.
                        */

                        button.addEventListener(
                            "click",
                            function (event) {

                                event.stopPropagation();


                                selectedDate =
                                    currentDate;


                                renderCalendar();

                            }
                        );


                        daysContainer.appendChild(
                            button
                        );

                    }

                    // ======================================
                    // ADDRESS FIELD SYNC
                    // ======================================

                    previewArea
                        .querySelectorAll(
                            ".address-field-group"
                        )
                        .forEach(
                            function (group) {

                                const addressLine =
                                    group.querySelector(
                                        ".address-line-input"
                                    );

                                const city =
                                    group.querySelector(
                                        ".address-city-input"
                                    );

                                const state =
                                    group.querySelector(
                                        ".address-state-input"
                                    );

                                const pincode =
                                    group.querySelector(
                                        ".address-pincode-input"
                                    );

                                const country =
                                    group.querySelector(
                                        ".address-country-input"
                                    );

                                const hiddenInput =
                                    group.querySelector(
                                        'input[type="hidden"]'
                                    );


                                function updateAddressValue() {

                                    hiddenInput.value =
                                        JSON.stringify({

                                            addressLine:
                                                addressLine.value.trim(),

                                            city:
                                                city.value.trim(),

                                            state:
                                                state.value.trim(),

                                            pincode:
                                                pincode.value.trim(),

                                            country:
                                                country.value.trim()

                                        });


                                    hiddenInput.dispatchEvent(

                                        new Event(
                                            "change",
                                            {
                                                bubbles:
                                                    true
                                            }
                                        )

                                    );

                                }


                                [
                                    addressLine,
                                    city,
                                    state,
                                    pincode,
                                    country
                                ].forEach(
                                    function (input) {

                                        input.addEventListener(
                                            "input",
                                            updateAddressValue
                                        );

                                    }
                                );

                            }
                        );

                }


                // ======================================
                // CLOSE PICKER
                // ======================================

                function closePicker() {

                    popover.classList.remove(
                        "show"
                    );


                    picker.classList.remove(
                        "open"
                    );

                }


                // ======================================
                // OPEN / CLOSE BUTTON
                // ======================================

                displayButton.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        popover.classList.toggle(
                            "show"
                        );


                        picker.classList.toggle(
                            "open"
                        );

                    }
                );


                /*
                    Popup ke andar click karne se
                    document outside click fire nahi karega.
                */

                popover.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                    }
                );


                // ======================================
                // PREVIOUS MONTH
                // ======================================

                previousButton.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        currentMonth--;


                        if (
                            currentMonth < 0
                        ) {

                            currentMonth =
                                11;


                            currentYear--;

                        }


                        renderCalendar();

                    }
                );


                // ======================================
                // NEXT MONTH
                // ======================================

                nextButton.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        currentMonth++;


                        if (
                            currentMonth > 11
                        ) {

                            currentMonth =
                                0;


                            currentYear++;

                        }


                        renderCalendar();

                    }
                );


                // ======================================
                // TODAY
                // ======================================

                todayButton.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        selectedDate =
                            new Date();


                        currentMonth =
                            selectedDate.getMonth();


                        currentYear =
                            selectedDate.getFullYear();


                        renderCalendar();

                    }
                );


                // ======================================
                // APPLY DATE + TIME
                // ======================================

                applyButton.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        if (
                            !selectedDate
                        ) {

                            showToast(

                                "Please select a date",

                                "warning"

                            );


                            return;

                        }


                        let hour =
                            Number(
                                hourSelect.value
                            );


                        const minute =
                            minuteSelect.value;


                        const period =
                            periodSelect.value;


                        if (
                            period === "AM" &&
                            hour === 12
                        ) {

                            hour =
                                0;

                        }


                        if (
                            period === "PM" &&
                            hour !== 12
                        ) {

                            hour +=
                                12;

                        }


                        const year =
                            selectedDate
                                .getFullYear();


                        const month =
                            String(

                                selectedDate
                                    .getMonth()

                                + 1

                            )
                                .padStart(
                                    2,
                                    "0"
                                );


                        const day =
                            String(

                                selectedDate
                                    .getDate()

                            )
                                .padStart(
                                    2,
                                    "0"
                                );


                        const hour24 =
                            String(
                                hour
                            )
                                .padStart(
                                    2,
                                    "0"
                                );


                        // MongoDB / Response value
                        // Example: 2026-08-22T15:30

                        hiddenInput.value =

                            `${year}-${month}-${day}T${hour24}:${minute}`;


                        // User visible value

                        displayValue.textContent =

                            `${day} `

                            + shortMonthNames[
                                selectedDate
                                    .getMonth()
                            ]

                            + ` ${year}`

                            + "  •  "

                            + String(
                                hourSelect.value
                            ).padStart(
                                2,
                                "0"
                            )

                            + ":"

                            + minute

                            + " "

                            + period;


                        hiddenInput.dispatchEvent(

                            new Event(
                                "change",
                                {
                                    bubbles:
                                        true
                                }
                            )

                        );


                        /*
                            Sirf Apply par popup
                            automatically close hoga.
                        */

                        closePicker();

                    }
                );


                // ======================================
                // CLICK OUTSIDE → CLOSE
                // ======================================

                document.addEventListener(
                    "click",
                    function (event) {

                        if (
                            !picker.contains(
                                event.target
                            )
                        ) {

                            closePicker();

                        }

                    }
                );


                // First calendar render

                renderCalendar();

            }
        );

}