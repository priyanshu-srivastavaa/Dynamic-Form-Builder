const exportResponsesBtn =
    document.getElementById(
        "exportResponsesBtn"
    );

    const responsesSearchInput =
    document.getElementById(
        "responsesSearchInput"
    );

    const responsesPagination =
    document.getElementById(
        "responsesPagination"
    );

    const recentResponsesActivity =
    document.getElementById(
        "recentResponsesActivity"
    );

const responseFileStats =
    document.getElementById(
        "responseFileStats"
    );

    const deviceBreakdownChart =
    document.getElementById(
        "deviceBreakdownChart"
    );

const browserUsageChart =
    document.getElementById(
        "browserUsageChart"
    );

    const topLocationsChart =
    document.getElementById(
        "topLocationsChart"
    );

const previewResponseFormBtn =
    document.getElementById(
        "previewResponseFormBtn"
    );

const shareResponseFormBtn =
    document.getElementById(
        "shareResponseFormBtn"
    );

const responsesVisibleCount =
    document.getElementById(
        "responsesVisibleCount"
    );

const responsesFormStatus =
    document.getElementById(
        "responsesFormStatus"
    );

const responsesCreatedAt =
    document.getElementById(
        "responsesCreatedAt"
    );

const responsesUpdatedAt =
    document.getElementById(
        "responsesUpdatedAt"
    );
 const responsesTableSearchInput =
    document.getElementById(
        "responsesTableSearchInput"
    );

const responsesTableExportBtn =
    document.getElementById(
        "responsesTableExportBtn"
    );

const responsesShowingSummary =
    document.getElementById(
        "responsesShowingSummary"
    );

const responsesFilterMenuBtn =
    document.getElementById(
        "responsesFilterMenuBtn"
    );



let currentSelectedResponses = [];
let currentSelectedForm = null;
let currentResponseFilter = "all";
let currentResponseSearch = "";

let currentResponsePage = 1;

const responsesPerPage = 5;

let currentFilteredResponses = [];

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


if (responsesFormStatus) {

    const formStatus =
        selectedForm?.status ||
        "draft";

    responsesFormStatus.textContent =
        formStatus === "published"
            ? "Active"
            : "Draft";

    responsesFormStatus.classList.toggle(
        "active",
        formStatus === "published"
    );

    responsesFormStatus.classList.toggle(
        "draft",
        formStatus !== "published"
    );

}


if (responsesCreatedAt) {

    const createdDate =
        selectedForm?.createdAt
            ? new Date(
                selectedForm.createdAt
            )
            : null;


    responsesCreatedAt.textContent =
        createdDate &&
        !Number.isNaN(
            createdDate.getTime()
        )
            ? `Created on ${createdDate.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            )}`
            : "Created date unavailable";

}


if (responsesUpdatedAt) {

    const updatedDate =
        selectedForm?.updatedAt
            ? new Date(
                selectedForm.updatedAt
            )
            : null;


    responsesUpdatedAt.textContent =
        updatedDate &&
        !Number.isNaN(
            updatedDate.getTime()
        )
            ? `Last updated ${updatedDate.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            )}`
            : "Last updated date unavailable";

}


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

       const uniqueVisitorIds = new Set(
    selectedResponses
        .map(function(responseItem) {
            return responseItem?.metadata?.visitorId || "";
        })
        .filter(Boolean)
);

const uniqueVisitors = uniqueVisitorIds.size;


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
                                ? Object.keys(value)
                                    .length > 0
                                : value !== null &&
                                  value !== undefined &&
                                  String(value)
                                    .trim() !== "";


                    if (hasValue) {

                        totalAnsweredFields++;

                    }

                }
            );

        }
    );


    const completionRate =
        totalAvailableFields > 0
            ? Math.round(
                (
                    totalAnsweredFields /
                    totalAvailableFields
                ) * 100
            )
            : 0;


    const latestResponse =
        [...selectedResponses]
            .filter(
                function(item) {

                    return item.createdAt;

                }
            )
            .sort(
                function(a, b) {

                    return (
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                    );

                }
            )[0];


    const latestDate =
        latestResponse?.createdAt
            ? new Date(
                latestResponse.createdAt
            )
            : null;


    const latestDay =
        latestDate &&
        !Number.isNaN(
            latestDate.getTime()
        )
            ? latestDate.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            )
            : "No submissions";


    const latestTime =
        latestDate &&
        !Number.isNaN(
            latestDate.getTime()
        )
            ? latestDate.toLocaleTimeString(
                "en-GB",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }
            )
            : "";


    responsesStats.innerHTML = `

        <article class="response-stat-card response-stat-purple">

            <div class="response-stat-top">

                <div class="response-stat-icon">
                    👥
                </div>

                <span>
                    Total Responses
                </span>

            </div>

            <div class="response-stat-content">

                <strong>
                    ${totalResponses}
                </strong>

                <div class="response-mini-chart response-mini-purple">

                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>

                </div>

            </div>

            <p class="response-stat-helper">
                Submitted responses
            </p>

        </article>


        <article class="response-stat-card response-stat-orange">

            <div class="response-stat-top">

                <div class="response-stat-icon">
                    📄
                </div>

                <span>
                    Answered Fields
                </span>

            </div>

            <div class="response-stat-content">

                <strong>
                    ${totalAnsweredFields}
                </strong>

                <div class="response-mini-bars">

                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>

                </div>

            </div>

            <p class="response-stat-helper">
                Fields containing answers
            </p>

        </article>


        <article class="response-stat-card response-stat-green">

            <div class="response-stat-top">

                <div class="response-stat-icon">
                    ✓
                </div>

                <span>
                    Completion Rate
                </span>

            </div>


            <div class="response-completion-layout">

                <strong>
                    ${completionRate}%
                </strong>


                <div
                    class="response-completion-ring"
                    style="--completion:${completionRate * 3.6}deg"
                >

                    <div class="response-completion-ring-inner">

                        <b>
                            ${completionRate}%
                        </b>

                    </div>

                </div>

            </div>


            <p class="response-stat-helper">
                Average field completion
            </p>

        </article>


       <article class="response-stat-card response-stat-blue">

    <div class="response-stat-top">

        <div class="response-stat-icon">
            👥
        </div>

        <span>
            Unique Visitors
        </span>

    </div>


    <div class="response-latest-value">

        <strong>
            ${uniqueVisitors}
        </strong>

    </div>


    <p class="response-stat-helper">
        Based on unique browsers
    </p>

</article>
    `;

}

function renderResponses(
    selectedResponses,
    startIndex = 0
) {

    if (!responsesList) {
        return;
    }


    if (!selectedResponses.length) {

        responsesList.innerHTML = `
            <div class="dashboard-empty-state">

                <h2>
                    No responses found
                </h2>

                <p>
                    No submitted responses match the current filters.
                </p>

            </div>
        `;

        return;

    }


    const formFields =
        Array.isArray(
            currentSelectedForm?.fields
        )
            ? currentSelectedForm.fields.filter(
                function(field) {

                    return (
                        field.type !== "section"
                    );

                }
            )
            : [];


    const tableHeaders =
        formFields
            .map(
                function(field) {

                    return `
                        <th>
                            ${
                                escapeResponsesHtml(
                                    field.label ||
                                    "Untitled Field"
                                )
                            }
                        </th>
                    `;

                }
            )
            .join("");


    const tableRows =
        selectedResponses
            .map(
                function(
                    responseItem,
                    index
                ) {

                    const answers =
                        Array.isArray(
                            responseItem.answers
                        )
                            ? responseItem.answers
                            : [];


                    const submittedAt =
                        responseItem.createdAt
                            ? new Date(
                                responseItem.createdAt
                            ).toLocaleString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true
                                }
                            )
                            : "—";


                    const answerCells =
                        formFields
                            .map(
                                function(field) {

                                    const answer =
                                        answers.find(
                                            function(item) {

                                                return (
                                                    String(item.fieldId) ===
                                                    String(field.id)
                                                );

                                            }
                                        );


                                    return `
                                        <td class="response-table-value">
                                            ${
                                                formatResponseValue(
                                                    answer?.value,
                                                    field.id
                                                )
                                            }
                                        </td>
                                    `;

                                }
                            )
                            .join("");


                    return `
                        <tr>

                            <td class="response-number-cell">
                                ${
                                    startIndex +
                                    index +
                                    1
                                }
                            </td>

                            <td class="response-date-cell">
                                ${
                                    escapeResponsesHtml(
                                        submittedAt
                                    )
                                }
                            </td>

                            ${answerCells}

                            <td class="response-table-actions">



    <button
        type="button"
        class="delete-response-btn response-table-delete-btn"
        data-response-id="${
            escapeResponsesHtml(
                responseItem._id
            )
        }"
        title="Delete response"
        aria-label="Delete response"
    >
        🗑
    </button>

</td>

                        </tr>
                    `;

                }
            )
            .join("");


    responsesList.innerHTML = `

        <div class="responses-table-card">

            <div class="responses-table-scroll">

                <table class="responses-data-table">

                    <thead>

                        <tr>

                            <th>
                                #
                            </th>

                            <th>
                                Submitted At
                            </th>

                            ${tableHeaders}

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>
                        ${tableRows}
                    </tbody>

                </table>

            </div>

        </div>
    `;

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
    fieldType === "name" &&
    typeof value === "object" &&
    value !== null
) {

    value =
        value.fullName ||
        [
            value.firstName,
            value.middleName,
            value.lastName
        ]
            .filter(Boolean)
            .join(" ");

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
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return;
            }


            const dateKey =
                date.toISOString()
                    .slice(
                        0,
                        10
                    );


            dateCounts[dateKey] =
                (
                    dateCounts[dateKey] ||
                    0
                ) + 1;

        }
    );


    const entries =
        Object.entries(
            dateCounts
        )
            .sort(
                function(a, b) {

                    return (
                        new Date(a[0]) -
                        new Date(b[0])
                    );

                }
            );


    if (!entries.length) {

        chart.innerHTML = `
            <p class="chart-empty-text">
                No response data available
            </p>
        `;

        return;

    }


    const maxCount =
        Math.max(
            ...entries.map(
                function(item) {

                    return item[1];

                }
            ),
            1
        );


    const chartWidth = 720;
    const chartHeight = 220;

    const paddingLeft = 34;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 34;


    const usableWidth =
        chartWidth -
        paddingLeft -
        paddingRight;


    const usableHeight =
        chartHeight -
        paddingTop -
        paddingBottom;


    const points =
        entries.map(
            function(
                [date, count],
                index
            ) {

                const x =
                    entries.length === 1
                        ? paddingLeft +
                          usableWidth / 2
                        : paddingLeft +
                          (
                              index /
                              (
                                  entries.length -
                                  1
                              )
                          ) *
                          usableWidth;


                const y =
                    paddingTop +
                    usableHeight -
                    (
                        count /
                        maxCount
                    ) *
                    usableHeight;


                return {
                    date,
                    count,
                    x,
                    y
                };

            }
        );


    const linePoints =
        points
            .map(
                function(point) {

                    return `${point.x},${point.y}`;

                }
            )
            .join(" ");


    const firstPoint =
        points[0];

    const lastPoint =
        points[
            points.length - 1
        ];


    const areaPoints = `
        ${firstPoint.x},${paddingTop + usableHeight}
        ${linePoints}
        ${lastPoint.x},${paddingTop + usableHeight}
    `;


    const labels =
        points
            .map(
                function(point) {

                    const label =
                        new Date(
                            point.date
                        ).toLocaleDateString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short"
                            }
                        );


                    return `
                        <div
                            class="responses-line-label"
                            style="
                                left:${
                                    (
                                        point.x /
                                        chartWidth
                                    ) * 100
                                }%;
                            "
                        >
                            ${escapeResponsesHtml(
                                label
                            )}
                        </div>
                    `;

                }
            )
            .join("");


    const dots =
        points
            .map(
                function(point) {

                    return `
                        <g
                            class="responses-line-point"
                        >

                            <circle
                                cx="${point.x}"
                                cy="${point.y}"
                                r="5"
                                class="responses-line-dot"
                            ></circle>

                            <title>
                                ${escapeResponsesHtml(
                                    point.date
                                )}: ${point.count} response${
                                    point.count === 1
                                        ? ""
                                        : "s"
                                }
                            </title>

                        </g>
                    `;

                }
            )
            .join("");


    chart.innerHTML = `

        <div class="responses-line-chart-wrap">

            <svg
                class="responses-line-chart-svg"
                viewBox="
                    0 0
                    ${chartWidth}
                    ${chartHeight}
                "
                preserveAspectRatio="none"
                role="img"
                aria-label="Responses over time"
            >

                <defs>

                    <linearGradient
                        id="responseAreaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >

                        <stop
                            offset="0%"
                            stop-color="#8b5cf6"
                            stop-opacity=".42"
                        ></stop>

                        <stop
                            offset="60%"
                            stop-color="#3b82f6"
                            stop-opacity=".14"
                        ></stop>

                        <stop
                            offset="100%"
                            stop-color="#06b6d4"
                            stop-opacity="0"
                        ></stop>

                    </linearGradient>


                    <linearGradient
                        id="responseLineGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                    >

                        <stop
                            offset="0%"
                            stop-color="#a78bfa"
                        ></stop>

                        <stop
                            offset="55%"
                            stop-color="#60a5fa"
                        ></stop>

                        <stop
                            offset="100%"
                            stop-color="#22d3ee"
                        ></stop>

                    </linearGradient>

                </defs>


                <line
                    x1="${paddingLeft}"
                    y1="${paddingTop + usableHeight}"
                    x2="${chartWidth - paddingRight}"
                    y2="${paddingTop + usableHeight}"
                    class="responses-chart-axis"
                ></line>


                <line
                    x1="${paddingLeft}"
                    y1="${
                        paddingTop +
                        usableHeight * .66
                    }"
                    x2="${chartWidth - paddingRight}"
                    y2="${
                        paddingTop +
                        usableHeight * .66
                    }"
                    class="responses-chart-grid-line"
                ></line>


                <line
                    x1="${paddingLeft}"
                    y1="${
                        paddingTop +
                        usableHeight * .33
                    }"
                    x2="${chartWidth - paddingRight}"
                    y2="${
                        paddingTop +
                        usableHeight * .33
                    }"
                    class="responses-chart-grid-line"
                ></line>


                <polygon
                    points="${areaPoints}"
                    fill="url(#responseAreaGradient)"
                    class="responses-line-area"
                ></polygon>


                <polyline
                    points="${linePoints}"
                    fill="none"
                    stroke="url(#responseLineGradient)"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="responses-line-path"
                ></polyline>


                ${dots}

            </svg>


            <div class="responses-line-labels">
                ${labels}
            </div>

        </div>
    `;

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

                    const field =
                        formFields.find(
                            function(formField) {

                                return (
                                    String(
                                        formField.id
                                    ) ===
                                    String(
                                        answer.fieldId
                                    )
                                );

                            }
                        );


                    if (
                        !field ||
                        !allowedTypes.includes(
                            field.type
                        )
                    ) {
                        return;
                    }


                    const label =
                        field.label ||
                        answer.label ||
                        "Untitled Question";


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
            <div class="question-analytics-empty">

                <div class="question-empty-icon">
                    ◫
                </div>

                <strong>
                    No question analytics yet
                </strong>

                <p>
                    Choice-based responses will appear here.
                </p>

            </div>
        `;

        return;

    }


    const selectOptions =
        questions
            .map(
                function(
                    [label],
                    index
                ) {

                    return `
                        <option value="${index}">
                            ${
                                escapeResponsesHtml(
                                    label
                                )
                            }
                        </option>
                    `;

                }
            )
            .join("");


    container.innerHTML = `

        <div class="question-analytics-selector">

            <label for="questionAnalyticsSelect">
                Choose a question
            </label>

            <div class="question-select-wrap">

                <select
                    id="questionAnalyticsSelect"
                    class="question-analytics-select"
                >
                    ${selectOptions}
                </select>

                <span class="question-select-arrow">
                   ⌄
                </span>

            </div>

        </div>


        <div
            id="questionAnalyticsResult"
            class="question-analytics-result"
        ></div>
    `;


    const select =
        document.getElementById(
            "questionAnalyticsSelect"
        );


    const result =
        document.getElementById(
            "questionAnalyticsResult"
        );


    function renderSelectedQuestion(
        questionIndex
    ) {

        const selectedQuestion =
            questions[
                questionIndex
            ];


        if (!selectedQuestion) {
            return;
        }


        const [
            label,
            counts
        ] =
            selectedQuestion;


        const entries =
            Object.entries(
                counts
            )
                .sort(
                    function(a, b) {

                        return (
                            b[1] -
                            a[1]
                        );

                    }
                );


        const totalAnswers =
            entries.reduce(
                function(
                    total,
                    item
                ) {

                    return (
                        total +
                        item[1]
                    );

                },
                0
            );


        const bars =
            entries
                .map(
                    function(
                        [option, count],
                        index
                    ) {

                        const percentage =
                            totalAnswers > 0
                                ? Math.round(
                                    (
                                        count /
                                        totalAnswers
                                    ) * 100
                                )
                                : 0;


                        return `
                            <div class="question-result-row">

                                <div class="question-result-info">

                                    <span>
                                        ${
                                            escapeResponsesHtml(
                                                option
                                            )
                                        }
                                    </span>

                                    <div>

                                        <strong>
                                            ${percentage}%
                                        </strong>

                                        <small>
                                            ${count}
                                            response${
                                                count === 1
                                                    ? ""
                                                    : "s"
                                            }
                                        </small>

                                    </div>

                                </div>


                                <div class="question-result-track">

                                    <div
                                        class="
                                            question-result-bar
                                            question-result-bar-${
                                                (
                                                    index %
                                                    4
                                                ) + 1
                                            }
                                        "
                                        style="
                                            width:${percentage}%;
                                        "
                                    ></div>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");


        result.innerHTML = `

            <div class="question-selected-header">

                <div>

                    <span>
                        Selected question
                    </span>

                    <h3>
                        ${
                            escapeResponsesHtml(
                                label
                            )
                        }
                    </h3>

                </div>


                <div class="question-total-badge">

                    <strong>
                        ${totalAnswers}
                    </strong>

                    <span>
                        answers
                    </span>

                </div>

            </div>


            <div class="question-results-list">
                ${bars}
            </div>
        `;

    }


    renderSelectedQuestion(
        0
    );


    if (select) {

        select.addEventListener(
            "change",
            function() {

                renderSelectedQuestion(
                    Number(
                        select.value
                    )
                );

            }
        );

    }

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

        currentResponsePage = 1;

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

    if (
    currentResponseSearch
) {

    filteredResponses =
        filteredResponses.filter(
            function(responseItem) {

                const searchableText =
                    JSON.stringify(
                        responseItem
                    )
                        .toLowerCase();

                return searchableText.includes(
                    currentResponseSearch
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

    renderRecentActivity(
        filteredResponses
    );

    renderFileUploadStats(
        filteredResponses
    );

    renderDeviceBreakdown(filteredResponses);
     renderBrowserUsage(filteredResponses);
     renderTopLocations(filteredResponses);

    currentFilteredResponses =
    filteredResponses;

    renderPaginatedResponses();


    responsesPageSubtitle.textContent =
        `${filteredResponses.length} response(s) shown`;

        if (responsesVisibleCount) {

    responsesVisibleCount.textContent =
        `${filteredResponses.length} shown`;

}


}

// ==========================================
// RECENT RESPONSE ACTIVITY
// ==========================================

function renderRecentActivity(
    selectedResponses
) {

    if (!recentResponsesActivity) {
        return;
    }


    if (!selectedResponses.length) {

        recentResponsesActivity.innerHTML = `
            <div class="response-insight-empty">
                No recent activity
            </div>
        `;

        return;

    }


    const formFields =
        Array.isArray(
            currentSelectedForm?.fields
        )
            ? currentSelectedForm.fields
            : [];


    const recentResponses =
        [...selectedResponses]
            .filter(
                function(responseItem) {
                    return responseItem.createdAt;
                }
            )
            .sort(
                function(a, b) {

                    return (
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                    );

                }
            )
            .slice(
                0,
                5
            );


    recentResponsesActivity.innerHTML =
        recentResponses
            .map(
                function(responseItem) {

                    const answers =
                        Array.isArray(
                            responseItem.answers
                        )
                            ? responseItem.answers
                            : [];


                    const responseDate =
                        new Date(
                            responseItem.createdAt
                        );


                    const formattedDate =
                        responseDate.toLocaleString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                            }
                        );


                    let respondentName = "";
                    let respondentEmail = "";
                    let respondentPhone = "";


                    answers.forEach(
                        function(answer) {

                            const field =
                                formFields.find(
                                    function(formField) {

                                        return (
                                            String(
                                                formField.id
                                            ) ===
                                            String(
                                                answer.fieldId
                                            )
                                        );

                                    }
                                );


                            if (!field) {
                                return;
                            }


                            const value =
                                answer.value;


                            if (
                                field.type === "name" &&
                                !respondentName
                            ) {

                                if (
                                    typeof value === "object" &&
                                    value !== null
                                ) {

                                    respondentName =
                                        value.fullName ||
                                        [
                                            value.firstName,
                                            value.middleName,
                                            value.lastName
                                        ]
                                            .filter(Boolean)
                                            .join(" ");

                                }
                                else if (
                                    typeof value === "string"
                                ) {

                                    respondentName =
                                        value;

                                }

                            }


                            if (
                                field.type === "email" &&
                                !respondentEmail &&
                                typeof value === "string"
                            ) {

                                respondentEmail =
                                    value;

                            }


                            if (
                                field.type === "phone" &&
                                !respondentPhone &&
                                typeof value === "string"
                            ) {

                                respondentPhone =
                                    value;

                            }

                        }
                    );


                    const primaryLabel =
                        respondentName ||
                        respondentEmail ||
                        respondentPhone ||
                        "Anonymous response";


                    const secondaryLabel =
                        respondentName &&
                        respondentEmail
                            ? respondentEmail
                            : respondentPhone
                                ? respondentPhone
                                : "New submission";


                    const initials =
                        respondentName
                            ? respondentName
                                .split(" ")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map(
                                    function(part) {

                                        return part
                                            .charAt(0)
                                            .toUpperCase();

                                    }
                                )
                                .join("")
                            : respondentEmail
                                ? respondentEmail
                                    .charAt(0)
                                    .toUpperCase()
                                : "R";


                    return `
                        <div class="recent-activity-item">

                            <div class="recent-activity-avatar">
                                ${
                                    escapeResponsesHtml(
                                        initials
                                    )
                                }
                            </div>


                            <div class="recent-activity-content">

                                <strong>
                                    ${
                                        escapeResponsesHtml(
                                            primaryLabel
                                        )
                                    }
                                </strong>

                                <span>
                                    ${
                                        escapeResponsesHtml(
                                            secondaryLabel
                                        )
                                    }
                                </span>

                            </div>


                            <time>
                                ${
                                    escapeResponsesHtml(
                                        formattedDate
                                    )
                                }
                            </time>

                        </div>
                    `;

                }
            )
            .join("");

}

// ==========================================
// FILE UPLOAD STATS
// ==========================================



function renderFileUploadStats(
    selectedResponses
) {

    if (!responseFileStats) {
        return;
    }


    const formFields =
        Array.isArray(
            currentSelectedForm?.fields
        )
            ? currentSelectedForm.fields
            : [];


    let totalFiles = 0;
    let imageFiles = 0;
    let documentFiles = 0;
    let spreadsheetFiles = 0;
    let textFiles = 0;
    let otherFiles = 0;


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

                    const field =
                        formFields.find(
                            function(formField) {

                                return (
                                    String(formField.id) ===
                                    String(answer.fieldId)
                                );

                            }
                        );


                    if (
                        field?.type !== "file"
                    ) {
                        return;
                    }


                    const value =
                        answer.value;


                    if (!value) {
                        return;
                    }


                    let fileName = "";


                    if (
                        typeof value === "object"
                    ) {

                        fileName =
                            value.originalName ||
                            value.url ||
                            "";

                    }
                    else {

                        fileName =
                            String(value);

                    }


                    if (!fileName) {
                        return;
                    }


                    totalFiles++;


                    const cleanFileName =
                        fileName
                            .split("?")[0]
                            .toLowerCase();


                    const extension =
                        cleanFileName.includes(".")
                            ? cleanFileName
                                .split(".")
                                .pop()
                            : "";


                    if (
                        [
                            "jpg",
                            "jpeg",
                            "png",
                            "gif",
                            "webp"
                        ].includes(extension)
                    ) {

                        imageFiles++;

                    }
                    else if (
                        [
                            "pdf",
                            "doc",
                            "docx"
                        ].includes(extension)
                    ) {

                        documentFiles++;

                    }
                    else if (
                        [
                            "xls",
                            "xlsx",
                            "csv"
                        ].includes(extension)
                    ) {

                        spreadsheetFiles++;

                    }
                    else if (
                        extension === "txt"
                    ) {

                        textFiles++;

                    }
                    else {

                        otherFiles++;

                    }

                }
            );

        }
    );


    const safeTotal =
        totalFiles || 1;


    const imagePercent =
        (
            imageFiles /
            safeTotal
        ) * 100;


    const documentPercent =
        (
            documentFiles /
            safeTotal
        ) * 100;


    const spreadsheetPercent =
        (
            spreadsheetFiles /
            safeTotal
        ) * 100;


    const textPercent =
        (
            textFiles /
            safeTotal
        ) * 100;


    const imageEnd =
        imagePercent;


    const documentEnd =
        imageEnd +
        documentPercent;


    const spreadsheetEnd =
        documentEnd +
        spreadsheetPercent;


    const textEnd =
        spreadsheetEnd +
        textPercent;

        const donutBackground =
    totalFiles === 0
        ? "rgba(71, 85, 105, 0.25)"
        : `conic-gradient(
            #8b5cf6 0% ${imageEnd}%,
            #3b82f6 ${imageEnd}% ${documentEnd}%,
            #06b6d4 ${documentEnd}% ${spreadsheetEnd}%,
            #f59e0b ${spreadsheetEnd}% ${textEnd}%,
            #64748b ${textEnd}% 100%
        )`;


    responseFileStats.innerHTML = `

        <div class="file-upload-dashboard">

            <div class="file-upload-chart-side">

                <div
                    class="file-upload-donut"
                    style="
                        background:${donutBackground};
                    "
                >

                    <div class="file-upload-donut-inner">

                        <strong>
                            ${totalFiles}
                        </strong>

                        <span>
                            Total Files
                        </span>

                    </div>

                </div>

            </div>


            <div class="file-upload-legend">

                <div class="file-upload-legend-item">

                    <span class="file-legend-dot file-dot-images"></span>

                    <div>
                        <p>
                            Images
                        </p>

                        <strong>
                            ${imageFiles}
                        </strong>
                    </div>

                </div>


                <div class="file-upload-legend-item">

                    <span class="file-legend-dot file-dot-documents"></span>

                    <div>
                        <p>
                            Documents
                        </p>

                        <strong>
                            ${documentFiles}
                        </strong>
                    </div>

                </div>


                <div class="file-upload-legend-item">

                    <span class="file-legend-dot file-dot-sheets"></span>

                    <div>
                        <p>
                            Spreadsheets
                        </p>

                        <strong>
                            ${spreadsheetFiles}
                        </strong>
                    </div>

                </div>


                <div class="file-upload-legend-item">

                    <span class="file-legend-dot file-dot-text"></span>

                    <div>
                        <p>
                            Text Files
                        </p>

                        <strong>
                            ${textFiles}
                        </strong>
                    </div>

                </div>


                <div class="file-upload-legend-item">

                    <span class="file-legend-dot file-dot-other"></span>

                    <div>
                        <p>
                            Others
                        </p>

                        <strong>
                            ${otherFiles}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    `;

}

function renderDeviceBreakdown(responses) {

    if (!deviceBreakdownChart) {
        return;
    }


    const counts = {
        Desktop: 0,
        Mobile: 0,
        Tablet: 0,
        Other: 0
    };


    responses.forEach(function(responseItem) {

        const device =
            responseItem?.metadata?.deviceType ||
            "Unknown";


        if (
            Object.prototype.hasOwnProperty.call(
                counts,
                device
            )
        ) {

            counts[device]++;

        }
        else if (
            device !== "Unknown"
        ) {

            counts.Other++;

        }

    });


    const total =
        counts.Desktop +
        counts.Mobile +
        counts.Tablet +
        counts.Other;


    if (total === 0) {

        deviceBreakdownChart.innerHTML = `
            <p class="analytics-empty-state">
                No device data available
            </p>
        `;

        return;

    }


    const desktopPercent =
        (counts.Desktop / total) * 100;

    const mobilePercent =
        (counts.Mobile / total) * 100;

    const tabletPercent =
        (counts.Tablet / total) * 100;

    const otherPercent =
        (counts.Other / total) * 100;


    const desktopEnd =
        desktopPercent;

    const mobileEnd =
        desktopEnd +
        mobilePercent;

    const tabletEnd =
        mobileEnd +
        tabletPercent;


    const donutBackground = `
        conic-gradient(
            #38bdf8 0% ${desktopEnd}%,
            #ec4899 ${desktopEnd}% ${mobileEnd}%,
            #8b5cf6 ${mobileEnd}% ${tabletEnd}%,
            #64748b ${tabletEnd}% 100%
        )
    `;


    const deviceItems = [
        {
            name: "Desktop",
            count: counts.Desktop,
            percentage:
                Math.round(desktopPercent),
            className: "desktop"
        },
        {
            name: "Mobile",
            count: counts.Mobile,
            percentage:
                Math.round(mobilePercent),
            className: "mobile"
        },
        {
            name: "Tablet",
            count: counts.Tablet,
            percentage:
                Math.round(tabletPercent),
            className: "tablet"
        },
        {
            name: "Other",
            count: counts.Other,
            percentage:
                Math.round(otherPercent),
            className: "other"
        }
    ]
        .filter(function(item) {
            return item.count > 0;
        });


    deviceBreakdownChart.innerHTML = `

        <div class="device-breakdown-layout">


            <div
                class="device-breakdown-donut"
                style="
                    background:
                    ${donutBackground};
                "
            >

                <div class="device-breakdown-donut-inner">

                    <strong>
                        ${total}
                    </strong>

                    <span>
                        Responses
                    </span>

                </div>

            </div>


            <div class="device-breakdown-legend">

                ${deviceItems
                    .map(function(item) {

                        return `

                            <div class="device-breakdown-legend-item">

                                <span
                                    class="
                                        device-breakdown-dot
                                        ${item.className}
                                    "
                                ></span>

                                <div>

                                    <strong>
                                        ${item.name}
                                    </strong>

                                    <span>
                                        ${item.percentage}%
                                    </span>

                                </div>

                            </div>

                        `;

                    })
                    .join("")}

            </div>


        </div>
    `;

}


function renderBrowserUsage(responses) {

    if (!browserUsageChart) {
        return;
    }

    const counts = {
        Chrome: 0,
        Edge: 0,
        Firefox: 0,
        Safari: 0,
        Other: 0
    };

    responses.forEach(function(responseItem) {

        const browser =
            responseItem?.metadata?.browser ||
            "Unknown";

        if (
            Object.prototype.hasOwnProperty.call(
                counts,
                browser
            )
        ) {
            counts[browser]++;
        }
        else if (browser !== "Unknown") {
            counts.Other++;
        }

    });

    const total =
        counts.Chrome +
        counts.Edge +
        counts.Firefox +
        counts.Safari +
        counts.Other;

    if (total === 0) {

        browserUsageChart.innerHTML = `
            <p class="analytics-empty-state">
                No browser data available
            </p>
        `;

        return;
    }

    const browserItems = [
        {
            name: "Chrome",
            icon: "🌐",
            count: counts.Chrome
        },
        {
            name: "Edge",
            icon: "🔵",
            count: counts.Edge
        },
        {
            name: "Firefox",
            icon: "🦊",
            count: counts.Firefox
        },
        {
            name: "Safari",
            icon: "🧭",
            count: counts.Safari
        },
        {
            name: "Other",
            icon: "💻",
            count: counts.Other
        }
    ]
        .filter(function(item) {
            return item.count > 0;
        });

    browserUsageChart.innerHTML = `
        <div class="browser-usage-list">

            ${browserItems
                .map(function(item) {

                    const percentage =
                        Math.round(
                            (item.count / total) * 100
                        );

                    return `
                        <div class="browser-usage-item">

                            <div class="browser-usage-row">

                                <div class="browser-usage-name">

                                    <span class="browser-usage-icon">
                                        ${item.icon}
                                    </span>

                                    <strong>
                                        ${item.name}
                                    </strong>

                                </div>

                                <span class="browser-usage-percentage">
                                    ${percentage}%
                                </span>

                            </div>

                            <div class="browser-usage-track">

                                <div
                                    class="browser-usage-fill"
                                    style="width:${percentage}%"
                                ></div>

                            </div>

                        </div>
                    `;

                })
                .join("")}

        </div>
    `;
}
function renderTopLocations(responses) {
    if (!topLocationsChart) return;

    const locationCounts = {};

    responses.forEach(function(responseItem) {
        const location =
            responseItem?.metadata?.location;

        if (!location) {
            return;
        }

        const city =
            String(location.city || "").trim();

        const region =
            String(location.region || "").trim();

        const country =
            String(location.country || "").trim();

        if (
            !city &&
            !region &&
            !country
        ) {
            return;
        }

        const locationLabel =
            country ||
            region ||
            city;

        locationCounts[locationLabel] =
            (
                locationCounts[locationLabel] ||
                0
            ) + 1;
    });

   const allLocationEntries =
    Object.entries(locationCounts)
        .sort(function(a, b) {
            return b[1] - a[1];
        });

const total =
    allLocationEntries.reduce(
        function(sum, item) {
            return sum + item[1];
        },
        0
    );

const entries =
    allLocationEntries.slice(0, 5);

if (!entries.length) {
    topLocationsChart.innerHTML = `
        <p class="analytics-empty-state">
            No location data available
        </p>
    `;
    return;
}

    topLocationsChart.innerHTML = `
        <div class="analytics-breakdown-list">

            ${entries
                .map(function(item) {
                    const locationName = item[0];
                    const count = item[1];

                    const percentage =
                        total > 0
                            ? Math.round(
                                (count / total) * 100
                            )
                            : 0;

                   const locationIcon =
    locationName === "India"
        ? "🇮🇳"
        : locationName === "United States"
            ? "🇺🇸"
            : locationName === "United Kingdom"
                ? "🇬🇧"
                : "📍";

return `
    <div class="location-usage-item">

        <div class="location-usage-row">

            <div class="location-usage-name">

                <span class="location-usage-icon">
                    ${locationIcon}
                </span>

                <strong>
                    ${escapeResponsesHtml(
                        locationName
                    )}
                </strong>

            </div>

            <span class="location-usage-percentage">
                ${percentage}%
            </span>

        </div>

        <div class="location-usage-track">

            <div
                class="location-usage-fill"
                style="width:${percentage}%"
            ></div>

        </div>

        </div>
                    `;
                })
                .join("")}

        </div>
    `;
}
// ==========================================
// RESPONSE PAGINATION
// ==========================================

function renderPaginatedResponses() {

    const totalResponses =
        currentFilteredResponses.length;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalResponses /
                responsesPerPage
            )
        );

    if (
        currentResponsePage >
        totalPages
    ) {
        currentResponsePage =
            totalPages;
    }


    const startIndex =
        (
            currentResponsePage - 1
        ) * responsesPerPage;


    const endIndex =
        startIndex +
        responsesPerPage;


    const pageResponses =
        currentFilteredResponses.slice(
            startIndex,
            endIndex
        );

        if (responsesShowingSummary) {

    if (totalResponses === 0) {

        responsesShowingSummary.textContent =
            "Showing 0 responses";

    }
    else {

        const visibleStart =
            startIndex + 1;

        const visibleEnd =
            Math.min(
                endIndex,
                totalResponses
            );

        responsesShowingSummary.textContent =
            `Showing ${visibleStart} to ${visibleEnd} of ${totalResponses} responses`;

    }

}


    renderResponses(
        pageResponses,
        startIndex
    );


    renderResponsesPagination(
        totalPages
    );

}


function renderResponsesPagination(
    totalPages
) {

    if (!responsesPagination) {
        return;
    }


    if (
        totalPages <= 1
    ) {

        responsesPagination.innerHTML =
            "";

        return;

    }


    let pageButtons = "";


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        pageButtons += `
            <button
                type="button"
                class="response-page-btn ${
                    page ===
                    currentResponsePage
                        ? "active"
                        : ""
                }"
                data-page="${page}"
            >
                ${page}
            </button>
        `;

    }


    responsesPagination.innerHTML = `
        <button
            type="button"
            class="response-page-nav"
            data-page-action="previous"
            ${
                currentResponsePage === 1
                    ? "disabled"
                    : ""
            }
        >
            ← Previous
        </button>

        <div class="response-page-numbers">
            ${pageButtons}
        </div>

        <button
            type="button"
            class="response-page-nav"
            data-page-action="next"
            ${
                currentResponsePage ===
                totalPages
                    ? "disabled"
                    : ""
            }
        >
            Next →
        </button>
    `;

}
// ==========================================
// RESPONSE SEARCH
// ==========================================


if (responsesSearchInput) {

    responsesSearchInput.addEventListener(
        "input",
        function() {

            currentResponseSearch =
                responsesSearchInput
                    .value
                    .trim()
                    .toLowerCase();


                    currentResponsePage = 1;

                      if (responsesTableSearchInput) {

                responsesTableSearchInput.value =
                    responsesSearchInput.value;

            }

            applyResponseFilter();

        }
    );

}

if (responsesTableSearchInput) {

    responsesTableSearchInput.addEventListener(
        "input",
        function() {

            currentResponseSearch =
                responsesTableSearchInput
                    .value
                    .trim()
                    .toLowerCase();

            currentResponsePage = 1;

            if (responsesSearchInput) {

                responsesSearchInput.value =
                    responsesTableSearchInput.value;

            }

            applyResponseFilter();

        }
    );

}

if (responsesFilterMenuBtn) {

    responsesFilterMenuBtn.addEventListener(
        "click",
        function() {

            const filterGroup =
                document.querySelector(
                    ".responses-filter-group"
                );

            if (!filterGroup) {
                return;
            }


            filterGroup.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            filterGroup.classList.add(
                "responses-filter-highlight"
            );


            setTimeout(
                function() {

                    filterGroup.classList.remove(
                        "responses-filter-highlight"
                    );

                },
                1200
            );

        }
    );

}

document.addEventListener(
    "click",
    function(event) {

        const pageButton =
            event.target.closest(
                ".response-page-btn"
            );


        if (pageButton) {

            currentResponsePage =
                Number(
                    pageButton.dataset.page
                );

            renderPaginatedResponses();

            return;

        }


        const navButton =
            event.target.closest(
                ".response-page-nav"
            );


        if (
            !navButton ||
            navButton.disabled
        ) {
            return;
        }


        const action =
            navButton.dataset.pageAction;


        if (
            action === "previous"
        ) {

            currentResponsePage =
                Math.max(
                    1,
                    currentResponsePage - 1
                );

        }


        if (
            action === "next"
        ) {

            const totalPages =
                Math.ceil(
                    currentFilteredResponses.length /
                    responsesPerPage
                );

            currentResponsePage =
                Math.min(
                    totalPages,
                    currentResponsePage + 1
                );

        }


        renderPaginatedResponses();

    }
);

// ==========================================
// PREVIEW + SHARE FORM
// ==========================================

function getPublicFormUrl() {

    return new URL(
        `public-form.html?formId=${encodeURIComponent(
            selectedFormId
        )}`,
        window.location.href
    ).href;

}


// ==========================================
// PREVIEW FORM
// ==========================================

if (previewResponseFormBtn) {

    previewResponseFormBtn.addEventListener(
        "click",
        function() {

            if (
                !currentSelectedForm
            ) {

                alert(
                    "Form is still loading."
                );

                return;

            }


            if (
                currentSelectedForm.status !==
                "published"
            ) {

                alert(
                    "Publish this form first to preview the public form."
                );

                return;

            }


            window.open(
                getPublicFormUrl(),
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


// ==========================================
// SHARE FORM
// ==========================================

if (shareResponseFormBtn) {

    shareResponseFormBtn.addEventListener(
        "click",
        async function() {

            if (
                !currentSelectedForm
            ) {

                alert(
                    "Form is still loading."
                );

                return;

            }


            if (
                currentSelectedForm.status !==
                "published"
            ) {

                alert(
                    "Publish this form first before sharing it."
                );

                return;

            }


            const publicUrl =
                getPublicFormUrl();


            try {

                await navigator.clipboard.writeText(
                    publicUrl
                );


                const oldText =
                    shareResponseFormBtn.textContent;


                shareResponseFormBtn.textContent =
                    "✓ Link Copied";


                setTimeout(
                    function() {

                        shareResponseFormBtn.textContent =
                            oldText;

                    },
                    1800
                );

            }

            catch (error) {

                console.error(
                    "Share link copy error:",
                    error
                );


                prompt(
                    "Copy this form link:",
                    publicUrl
                );

            }

        }
    );

}

if (
    responsesTableExportBtn &&
    exportResponsesBtn
) {

    responsesTableExportBtn.addEventListener(
        "click",
        function() {

            exportResponsesBtn.click();

        }
    );

}