const exportResponsesBtn =
    document.getElementById(
        "exportResponsesBtn"
    );

let currentSelectedResponses = [];
let currentSelectedForm = null;
let currentResponseFilter = "all";

const RESPONSES_API_URL =
    "https://dynamic-form-builder-backend-1jjb.onrender.com/api/responses";

const FORMS_API_URL =
    "https://dynamic-form-builder-backend-1jjb.onrender.com/api/forms";

const responsesList =
    document.getElementById(
        "responsesList"
    );

const responsesPageTitle =
    document.getElementById(
        "responsesPageTitle"
    );

const responsesPageSubtitle =
    document.getElementById(
        "responsesPageSubtitle"
    );

const selectedFormId =
    localStorage.getItem(
        "selectedResponsesFormId"
    );


// ==========================================
// START
// ==========================================

if (!selectedFormId) {

    responsesList.innerHTML = `
        <div class="dashboard-empty-state">

            <h2>
                No form selected
            </h2>

            <p>
                Please return to the dashboard and choose a form.
            </p>

        </div>
    `;

}
else {

    loadSelectedFormResponses();

}


// ==========================================
// LOAD SELECTED FORM RESPONSES
// ==========================================

async function loadSelectedFormResponses() {

    try {

        const [
            responsesResponse,
            formResponse
        ] =
            await Promise.all([

                fetch(
    RESPONSES_API_URL,
    {
        headers: {
            Authorization:
                `Bearer ${localStorage.getItem(
                    "authToken"
                )}`
        }
    }
),

               fetch(
                `${FORMS_API_URL}/${selectedFormId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem(
                                "authToken"
                            )}`
                    }
                }
            )

            ]);

            if (handleAuthFailure(responsesResponse)) return;
            if (handleAuthFailure(formResponse)) return;


        const responsesResult =
            await responsesResponse.json();

        const formResult =
            await formResponse.json();


        if (!responsesResponse.ok) {

            throw new Error(
                responsesResult.message ||
                "Unable to load responses"
            );

        }


        if (!formResponse.ok) {

            throw new Error(
                formResult.message ||
                "Unable to load form"
            );

        }


        const allResponses =
            Array.isArray(
                responsesResult.data
            )
                ? responsesResult.data
                : [];


        const selectedResponses =
            allResponses.filter(
                responseItem =>
                    String(responseItem.formId) ===
                    String(selectedFormId)
            );

            const selectedForm =
            formResult.data;

            currentSelectedResponses =
    selectedResponses;

currentSelectedForm =
    selectedForm;

responsesPageTitle.textContent =
    selectedForm?.title ||
    "Form Responses";

applyResponseFilter();

    }

    catch (error) {

        console.error(
            "Responses page error:",
            error
        );

        responsesList.innerHTML = `
            <div class="dashboard-empty-state">

                <h2>
                    Unable to load responses
                </h2>

                <p>
                    ${escapeResponsesHtml(
                        error.message ||
                        "Something went wrong"
                    )}
                </p>

            </div>
        `;

    }

}


// ==========================================
// RENDER RESPONSES
// ==========================================

function renderResponses(
    selectedResponses
) {

    if (!selectedResponses.length) {

        responsesList.innerHTML = `
            <div class="dashboard-empty-state">

                <h2>
                    No responses yet
                </h2>

                <p>
                    Submitted responses will appear here.
                </p>

            </div>
        `;

        return;

    }


    responsesList.innerHTML =
        selectedResponses
            .map(
                function(responseItem, index) {

                    const answers =
                        Array.isArray(
                            responseItem.answers
                        )
                            ? responseItem.answers
                            : [];


                   const createdAt =
                    responseItem.createdAt
                        ? new Date(
                            responseItem.createdAt
                        ).toLocaleString(
                            "en-GB",
                            {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true
                            }
                        )
                        : "Unknown time";

                    return `
                        <article class="response-card">

                            <div class="response-card-header">

                                <div>

                                    <h2>
                                        Response ${index + 1}
                                    </h2>

                                    <p>
                                        ${escapeResponsesHtml(
                                            createdAt
                                        )}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    class="delete-response-btn"
                                    data-response-id="${responseItem._id}"
                                >
                                    🗑 Delete
                                </button>

                            </div>

                            <div class="response-answers">

                                ${
                                    answers
                                        .map(
                                            function(answer) {

                                                return `
                                                    <div class="response-answer-row">

                                                        <strong>
                                                            ${
                                                                escapeResponsesHtml(
                                                                    answer.label ||
                                                                    "Untitled Field"
                                                                )
                                                            }
                                                        </strong>

                                                       <div class="response-answer-value">
                                                                ${
                                                                    formatResponseValue(
                                                                        answer.value,
                                                                        answer.fieldId
                                                                    )
                                                                }
                                                            </div>

                                                    </div>
                                                `;

                                            }
                                        )
                                        .join("")
                                }

                            </div>

                        </article>
                    `;

                }
            )
            .join("");

}


// ==========================================
// FORMAT RESPONSE VALUE
// ==========================================

function formatResponseValue(
    value,
    fieldId
) {

    const field =
        Array.isArray(
            currentSelectedForm?.fields
        )
            ? currentSelectedForm.fields.find(
                item =>
                    String(item.id) ===
                    String(fieldId)
            )
            : null;

    const fieldType =
        field?.type || "";


    // ===============================
    // EMPTY VALUE
    // ===============================

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return `
            <span class="response-empty-value">
                No answer
            </span>
        `;

    }


    // ===============================
    // PASSWORD
    // ===============================

    if (
        fieldType === "password"
    ) {

        return `
            <span class="response-password-value">
                ••••••••
            </span>
        `;

    }


    // ===============================
    // SIGNATURE
    // ===============================
    if (
    fieldType === "signature" &&
    typeof value === "string" &&
    (
        value.startsWith("http://") ||
        value.startsWith("https://")
    )
) {

    return `
        <a
            href="${escapeResponsesHtml(value)}"
            target="_blank"
            rel="noopener noreferrer"
            class="response-file-link"
        >
            View Signature
        </a>
    `;

}

    if (
        fieldType === "signature" &&
        typeof value === "string" &&
        value.startsWith(
            "data:image/"
        )
    ) {

        return `
            <div class="response-signature-preview">

                <img
                    src="${escapeResponsesHtml(value)}"
                    alt="Signature"
                >

            </div>
        `;

    }


    // ===============================
    // FULL NAME
    // ===============================

    if (
        fieldType === "name" &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {

        const fullName =
            value.fullName ||
            [
                value.firstName,
                value.middleName,
                value.lastName
            ]
                .filter(Boolean)
                .join(" ");

        return escapeResponsesHtml(
            fullName || "No answer"
        );

    }


    // ===============================
    // ADDRESS
    // ===============================

    if (
        fieldType === "address" &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {

        const addressLine =
            value.addressLine || "";

        const cityState =
            [
                value.city,
                value.state
            ]
                .filter(Boolean)
                .join(", ");

        const pinLine =
            [
                cityState,
                value.pincode
                    ? `- ${value.pincode}`
                    : ""
            ]
                .filter(Boolean)
                .join(" ");

        return `
            <div class="response-address-value">

                ${
                    addressLine
                        ? `
                            <div>
                                ${escapeResponsesHtml(
                                    addressLine
                                )}
                            </div>
                        `
                        : ""
                }

                ${
                    pinLine
                        ? `
                            <div>
                                ${escapeResponsesHtml(
                                    pinLine
                                )}
                            </div>
                        `
                        : ""
                }

                ${
                    value.country
                        ? `
                            <div>
                                ${escapeResponsesHtml(
                                    value.country
                                )}
                            </div>
                        `
                        : ""
                }

            </div>
        `;

    }


    // ===============================
    // MATRIX
    // ===============================

    if (
        fieldType === "matrix" &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {

        return `
            <div class="response-matrix-value">

                ${
                    Object.entries(value)
                        .map(
                            function([
                                row,
                                answer
                            ]) {

                                return `
                                    <div class="response-matrix-row">

                                        <span>
                                            ${escapeResponsesHtml(
                                                row
                                            )}
                                        </span>

                                        <strong>
                                            ${escapeResponsesHtml(
                                                answer
                                            )}
                                        </strong>

                                    </div>
                                `;

                            }
                        )
                        .join("")
                }

            </div>
        `;

    }


    // ===============================
    // DATETIME
    // ===============================

    if (
        fieldType === "datetime" &&
        typeof value === "string"
    ) {

        const date =
            new Date(value);

        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {

            return escapeResponsesHtml(
                date.toLocaleString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }
                )
            );

        }

    }


    // ===============================
    // CURRENCY
    // ===============================

    if (
        fieldType === "currency"
    ) {

        return `
            ₹${escapeResponsesHtml(
                value
            )}
        `;

    }


    // ===============================
    // ARRAYS
    // ===============================

    if (
        Array.isArray(value)
    ) {

        return escapeResponsesHtml(
            value.join(", ")
        );

    }


    // ===============================
    // FILE UPLOAD OBJECT
    // ===============================

    if (
        typeof value === "object" &&
        value.url
    ) {

        return `
            <a
                href="${escapeResponsesHtml(
                    value.url
                )}"
                target="_blank"
                rel="noopener noreferrer"
                class="response-file-link"
            >
                View File
            </a>
        `;

    }

    // ===============================
// FILE UPLOAD STRING URL
// ===============================

if (
    fieldType === "file" &&
    typeof value === "string" &&
    (
        value.startsWith("http://") ||
        value.startsWith("https://")
    )
) {

    return `
        <a
            href="${escapeResponsesHtml(value)}"
            target="_blank"
            rel="noopener noreferrer"
            class="response-file-link"
        >
            View File
        </a>
    `;

}


    // ===============================
    // WEBSITE URL
    // ===============================

    if (
        fieldType === "url" &&
        typeof value === "string"
    ) {

        let url =
            value.trim();

        if (
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ) {

            url =
                "https://" + url;

        }

        return `
            <a
                href="${escapeResponsesHtml(
                    url
                )}"
                target="_blank"
                rel="noopener noreferrer"
                class="response-url-link"
            >
                ${escapeResponsesHtml(
                    url
                )}
            </a>
        `;

    }


    // ===============================
    // FALLBACK OBJECT
    // ===============================

    if (
        typeof value === "object"
    ) {

        return escapeResponsesHtml(
            JSON.stringify(value)
        );

    }


    // ===============================
    // NORMAL VALUE
    // ===============================

    return escapeResponsesHtml(
        String(value)
    );

}


// ==========================================
// SAFE HTML
// ==========================================

function escapeResponsesHtml(
    value
) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
exportResponsesBtn.addEventListener(
    "click",
    function () {

        if (
            !currentSelectedResponses.length
        ) {

            alert(
                "No responses available to export"
            );

            return;

        }

        const headers =
            [
                "Response Number",
                "Submitted At"
            ];

        const allLabels =
            [];

        currentSelectedResponses.forEach(
            function(responseItem) {

                const answers =
                    Array.isArray(
                        responseItem.answers
                    )
                        ? responseItem.answers
                        : [];

                answers.forEach(
                    function(answer) {

                        const label =
                            answer.label ||
                            "Untitled Field";

                        if (
                            !allLabels.includes(
                                label
                            )
                        ) {

                            allLabels.push(
                                label
                            );

                        }

                    }
                );

            }
        );

        headers.push(
            ...allLabels
        );

        const rows = [
            headers
        ];

        currentSelectedResponses.forEach(
            function(responseItem, index) {

                const row = [
                    index + 1,
                   responseItem.createdAt
                    ? new Date(
                        responseItem.createdAt
                    ).toLocaleString(
                        "en-GB",
                         {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                    }
                    )
                    : ""
                ];

                allLabels.forEach(
                    function(label) {

                        const answer =
                            responseItem.answers?.find(
                                item =>
                                    item.label === label
                            );

                        let value =
                                answer?.value ?? "";

                            const field =
                                Array.isArray(
                                    currentSelectedForm?.fields
                                )
                                    ? currentSelectedForm.fields.find(
                                        item =>
                                            String(item.id) ===
                                            String(answer?.fieldId)
                                    )
                                    : null;

                            const fieldType =
                                field?.type || "";

                            if (
    fieldType === "signature" &&
    typeof value === "string"
) {

    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {

        value =
            "View Signature";

    }

    else if (
        value.startsWith("data:image/")
    ) {

        value =
            "Signature captured";

    }

}

                            else if (
                                fieldType === "file" &&
                                typeof value === "string" &&
                                (
                                    value.startsWith("http://") ||
                                    value.startsWith("https://")
                                )
                            ) {

                                value =
                                    "View File";

                            }

                            else if (
                                Array.isArray(value)
                            ) {

                            value =
                                value.join(", ");

                        }

                        else if (
                            typeof value ===
                            "object" &&
                            value !== null
                        ) {

                            value =
                        value.originalName ||
                        value.url ||
                        JSON.stringify(value);

                        }

                        row.push(value);

                    }
                );

                rows.push(row);

            }
        );

       const worksheet =
    XLSX.utils.aoa_to_sheet(
        rows
    );
    currentSelectedResponses.forEach(
    function (responseItem, responseIndex) {

        allLabels.forEach(
            function (label, labelIndex) {

                const answer =
                    responseItem.answers?.find(
                        item =>
                            item.label === label
                    );

                const field =
                    Array.isArray(
                        currentSelectedForm?.fields
                    )
                        ? currentSelectedForm.fields.find(
                            item =>
                                String(item.id) ===
                                String(answer?.fieldId)
                        )
                        : null;

               if (
                    (
                        field?.type === "file" ||
                        field?.type === "signature"
                    ) &&
                    typeof answer?.value === "string" &&
                    (
                        answer.value.startsWith("http://") ||
                        answer.value.startsWith("https://")
                    )
                ) {

                    const cellAddress =
                        XLSX.utils.encode_cell({
                            r: responseIndex + 1,
                            c: labelIndex + 2
                        });

                    if (
                        worksheet[cellAddress]
                    ) {

                        worksheet[cellAddress].l = {
                            Target:
                                answer.value,
                            Tooltip:
                                "Open uploaded file"
                        };

                    }

                }

            }
        );

    }
);

const columnWidths =
    headers.map(
        function (header, columnIndex) {

            let maxLength =
                String(header).length;

            rows.forEach(
                function (row) {

                    const cellValue =
                        row[columnIndex] ?? "";

                    const cellLength =
                        String(cellValue).length;

                    if (
                        cellLength >
                        maxLength
                    ) {

                        maxLength =
                            cellLength;

                    }

                }
            );

            return {
                wch:
                    Math.min(
                        Math.max(
                            maxLength + 2,
                            12
                        ),
                        35
                    )
            };

        }
    );

worksheet["!cols"] =
    columnWidths;

const workbook =
    XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Responses"
);

const fileName =
    (
        currentSelectedForm?.title ||
        "form"
    )
        .replace(
            /[^a-z0-9]/gi,
            "_"
        )
        .toLowerCase();

XLSX.writeFile(
    workbook,
    `${fileName}_responses.xlsx`
);

    }
);
// ==========================================
// DELETE RESPONSE CLICK
// ==========================================

responsesList.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(
                ".delete-response-btn"
            );

        if (!deleteButton) {
            return;
        }

        const responseId =
            deleteButton.dataset.responseId;

        const confirmed =
            confirm(
                "Are you sure you want to delete this response?"
            );

        if (!confirmed) {
            return;
        }

        deleteResponseById(
            responseId
        );

    }
);


// ==========================================
// DELETE RESPONSE FROM DATABASE
// ==========================================

async function deleteResponseById(
    responseId
) {

    try {

       const response =
    await fetch(
        `${RESPONSES_API_URL}/${responseId}`,
        {
            method:
                "DELETE",

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
                "Unable to delete response"
            );

        }

        await loadSelectedFormResponses();

    }

    catch (error) {

        console.error(
            "Delete response error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete response"
        );

    }

}
// ==========================================
// RESPONSE ANALYTICS STATS
// ==========================================

function renderResponseStats(
    selectedResponses
) {

    const responsesStats =
        document.getElementById(
            "responsesStats"
        );

    if (!responsesStats) {
        return;
    }

    const totalResponses =
        selectedResponses.length;

   let totalAnsweredFields = 0;

const formFields =
    Array.isArray(
        currentSelectedForm?.fields
    )
        ? currentSelectedForm.fields
        : [];

const fillableFields =
    formFields.filter(
        function(field) {

            return (
                field.type !== "section"
            );

        }
    );

const totalAvailableFields =
    fillableFields.length *
    selectedResponses.length;

    selectedResponses.forEach(
        function(responseItem) {

            const answers =
                Array.isArray(
                    responseItem.answers
                )
                    ? responseItem.answers
                    : [];
                    

            answers.forEach(
                function(answer) {

                    const value =
                        answer.value;

                    const hasValue =
                        Array.isArray(value)
                            ? value.length > 0
                            : value &&
                              typeof value === "object"
                                ? Object.keys(value).length > 0
                                : value !== null &&
                                  value !== undefined &&
                                  String(value).trim() !== "";

                    if (hasValue) {
                        totalAnsweredFields++;
                    }

                }
            );

        }
    );

    const latestResponse =
        selectedResponses
            .filter(
                item =>
                    item.createdAt
            )
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )[0];

           const latestSubmission =
    latestResponse
        ? new Date(
            latestResponse.createdAt
        ).toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        )
        : "No submissions";
        const completionRate =
    totalAvailableFields > 0
        ? Math.round(
            (
                totalAnsweredFields /
                totalAvailableFields
            ) * 100
        )
        : 0;
   responsesStats.innerHTML = `
    <div class="response-stat-card">

        <span>
            Total Responses
        </span>

        <strong>
            ${totalResponses}
        </strong>

    </div>

    <div class="response-stat-card">

        <span>
            Answered Fields
        </span>

        <strong>
            ${totalAnsweredFields}
        </strong>

    </div>

    <div class="response-stat-card">

        <span>
            Completion Rate
        </span>

        <strong>
            ${completionRate}%
        </strong>

    </div>

    <div class="response-stat-card">

        <span>
            Latest Submission
        </span>

        <strong class="response-stat-date">
            ${escapeResponsesHtml(
                latestSubmission
            )}
        </strong>

    </div>
`;

}
// ==========================================
// RESPONSES OVER TIME CHART
// ==========================================

function renderResponsesTimeChart(
    selectedResponses
) {

    const chart =
        document.getElementById(
            "responsesTimeChart"
        );

    if (!chart) {
        return;
    }

    if (!selectedResponses.length) {

        chart.innerHTML = `
            <p class="chart-empty-text">
                No response data available
            </p>
        `;

        return;
    }

    const dateCounts = {};

    selectedResponses.forEach(
        function(responseItem) {

            if (!responseItem.createdAt) {
                return;
            }

            const date =
                new Date(
                    responseItem.createdAt
                ).toLocaleDateString(
                    "en-GB",
                     {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                   
                }
                );

            dateCounts[date] =
                (dateCounts[date] || 0) + 1;

        }
    );

    const entries =
        Object.entries(
            dateCounts
        );

    const maxCount =
        Math.max(
            ...entries.map(
                item => item[1]
            )
        );

    chart.innerHTML =
        entries
            .map(
                function([date, count]) {

                    const height =
                        Math.max(
                            20,
                            (count / maxCount) * 160
                        );

                    return `
                        <div class="time-chart-item">

                            <span class="time-chart-count">
                                ${count}
                            </span>

                            <div
                                class="time-chart-bar"
                                style="height:${height}px"
                            ></div>

                            <span class="time-chart-date">
                                ${escapeResponsesHtml(
                                    date
                                )}
                            </span>

                        </div>
                    `;

                }
            )
            .join("");

}
// ==========================================
// QUESTION-WISE ANALYTICS
// ==========================================

function renderQuestionAnalytics(
    selectedResponses
) {

    const container =
        document.getElementById(
            "questionAnalytics"
        );

    if (!container) {
        return;
    }

    const allowedTypes = [
        "checkbox",
        "dropdown",
        "radio",
        "rating",
        "multiselect",
        "scale",
        "checkboxgroup",
        "range",
        "yesno",
        "imagechoice"
    ];

    const formFields =
        Array.isArray(
            currentSelectedForm?.fields
        )
            ? currentSelectedForm.fields
            : [];

    const questionMap = {};

    selectedResponses.forEach(
        function(responseItem) {

            const answers =
                Array.isArray(
                    responseItem.answers
                )
                    ? responseItem.answers
                    : [];

            answers.forEach(
                function(answer) {

                    const label =
                        answer.label ||
                        "Untitled Field";

                    const field =
                        formFields.find(
                            function(formField) {

                                return (
                                    formField.label ===
                                    label
                                );

                            }
                        );

                    if (!field) {
                        return;
                    }

                    if (
                        !allowedTypes.includes(
                            field.type
                        )
                    ) {
                        return;
                    }

                    const value =
                        answer.value;

                    if (
                        value === null ||
                        value === undefined ||
                        value === ""
                    ) {
                        return;
                    }

                    if (!questionMap[label]) {
                        questionMap[label] = {};
                    }

                    if (Array.isArray(value)) {

                        value.forEach(
                            function(item) {

                                const text =
                                    String(item);

                                questionMap[label][text] =
                                    (
                                        questionMap[label][text] ||
                                        0
                                    ) + 1;

                            }
                        );

                    }

                    else if (
                        typeof value !== "object"
                    ) {

                        const text =
                            String(value);

                        questionMap[label][text] =
                            (
                                questionMap[label][text] ||
                                0
                            ) + 1;

                    }

                }
            );

        }
    );

    const questions =
        Object.entries(
            questionMap
        );

    if (!questions.length) {

        container.innerHTML = `
            <p class="chart-empty-text">
                No choice-based analytics available
            </p>
        `;

        return;
    }

    container.innerHTML =
        questions
            .map(
                function([label, counts]) {

                    const maxCount =
                        Math.max(
                            ...Object.values(counts)
                        );

                    const rows =
                        Object.entries(counts)
                            .map(
                                function([option, count]) {

                                    const width =
                                        Math.max(
                                            8,
                                            (
                                                count /
                                                maxCount
                                            ) * 100
                                        );

                                    return `
                                        <div class="question-analytics-row">

                                            <div class="question-analytics-label">

                                                <span>
                                                    ${escapeResponsesHtml(
                                                        option
                                                    )}
                                                </span>

                                                <strong>
                                                    ${count}
                                                </strong>

                                            </div>

                                            <div class="question-analytics-track">

                                                <div
                                                    class="question-analytics-bar"
                                                    style="width:${width}%"
                                                ></div>

                                            </div>

                                        </div>
                                    `;

                                }
                            )
                            .join("");

                    return `
                        <div class="question-analytics-card">

                            <h3>
                                ${escapeResponsesHtml(
                                    label
                                )}
                            </h3>

                            ${rows}

                        </div>
                    `;

                }
            )
            .join("");

}
// ==========================================
// RESPONSE DATE FILTER
// ==========================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".response-filter-btn"
            );

        if (!button) {
            return;
        }

        currentResponseFilter =
            button.dataset.range;

        document
            .querySelectorAll(
                ".response-filter-btn"
            )
            .forEach(
                function(item) {
                    item.classList.remove(
                        "active"
                    );
                }
            );

        button.classList.add(
            "active"
        );

        applyResponseFilter();

    }
);


function applyResponseFilter() {

    let filteredResponses = [
        ...currentSelectedResponses
    ];

    if (
        currentResponseFilter !==
        "all"
    ) {

        const days =
            Number(
                currentResponseFilter
            );

        const now =
            new Date();

        const startDate =
            new Date();

        startDate.setDate(
            now.getDate() - days
        );

        filteredResponses =
            currentSelectedResponses.filter(
                function(responseItem) {

                    if (
                        !responseItem.createdAt
                    ) {
                        return false;
                    }

                    const responseDate =
                        new Date(
                            responseItem.createdAt
                        );

                    return (
                        responseDate >=
                        startDate
                    );

                }
            );

    }


    renderResponseStats(
        filteredResponses
    );

    renderResponsesTimeChart(
        filteredResponses
    );

    renderQuestionAnalytics(
        filteredResponses
    );

    renderResponses(
        filteredResponses
    );


    responsesPageSubtitle.textContent =
        `${filteredResponses.length} response(s) shown`;

}
