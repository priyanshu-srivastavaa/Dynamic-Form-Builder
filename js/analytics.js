// ==========================================
// FORMIFY ANALYTICS
// ==========================================

const ANALYTICS_FORMS_API_URL =
    `${FORMIFY_API_BASE_URL}/api/forms`;

const ANALYTICS_RESPONSES_API_URL =
    `${FORMIFY_API_BASE_URL}/api/responses`;


let analyticsForms = [];
let analyticsResponses = [];

let analyticsSelectedDays = 30;


// ==========================================
// LOAD ANALYTICS DATA
// ==========================================

async function loadAnalyticsData() {

    const token =
        localStorage.getItem(
            "authToken"
        );


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    try {

        const [
            formsResponse,
            responsesResponse
        ] =
            await Promise.all([

                fetch(
                    ANALYTICS_FORMS_API_URL,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                ),

                fetch(
                    ANALYTICS_RESPONSES_API_URL,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                )

            ]);


        if (handleAuthFailure(formsResponse)) {
            return;
        }

        if (handleAuthFailure(responsesResponse)) {
            return;
        }


        const formsResult =
            await formsResponse.json();

        const responsesResult =
            await responsesResponse.json();


        if (!formsResponse.ok) {

            throw new Error(
                formsResult.message ||
                "Unable to load forms"
            );
        }


        if (!responsesResponse.ok) {

            throw new Error(
                responsesResult.message ||
                "Unable to load responses"
            );
        }


        analyticsForms =
            Array.isArray(formsResult.data)
                ? formsResult.data
                : [];


        analyticsResponses =
            Array.isArray(responsesResult.data)
                ? responsesResult.data
                : [];


        updateAnalyticsKpis();
        renderAnalyticsPerformanceChart();
        renderAnalyticsTopForms();
        renderAnalyticsAudience();
        renderAnalyticsFormHealth();
        renderAnalyticsFormsTable();
        renderAnalyticsKeyInsights();

    }

    catch (error) {

        console.error(
            "Analytics load error:",
            error
        );

    }

}


// ==========================================
// DATE FILTER
// ==========================================

function getAnalyticsPeriodResponses(
    days,
    previousPeriod = false
) {

    if (days === "all") {

        return previousPeriod
            ? []
            : analyticsResponses;
    }


    const now =
        new Date();


    const currentStart =
        new Date();

    currentStart.setDate(
        now.getDate() - days
    );


    if (!previousPeriod) {

        return analyticsResponses.filter(
            function(responseItem) {

                const responseDate =
                    new Date(
                        responseItem.createdAt
                    );


                return (
                    !Number.isNaN(
                        responseDate.getTime()
                    )
                    &&
                    responseDate >= currentStart
                    &&
                    responseDate <= now
                );

            }
        );

    }


    const previousStart =
        new Date();

    previousStart.setDate(
        now.getDate() - (days * 2)
    );


    return analyticsResponses.filter(
        function(responseItem) {

            const responseDate =
                new Date(
                    responseItem.createdAt
                );


            return (
                !Number.isNaN(
                    responseDate.getTime()
                )
                &&
                responseDate >= previousStart
                &&
                responseDate < currentStart
            );

        }
    );

}


// ==========================================
// CHECK ANSWER VALUE
// ==========================================

function analyticsHasValue(value) {

    if (Array.isArray(value)) {

        return value.length > 0;
    }


    if (
        value &&
        typeof value === "object"
    ) {

        return (
            Object.keys(value).length > 0
        );
    }


    return (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    );

}


// ==========================================
// COMPLETION RATE
// ==========================================

function calculateAnalyticsCompletion(
    responses
) {

    if (!responses.length) {
        return 0;
    }


    let answeredFields = 0;
    let availableFields = 0;


    responses.forEach(
        function(responseItem) {

            const formItem =
                analyticsForms.find(
                    function(form) {

                        return (
                            String(form._id) ===
                            String(responseItem.formId)
                        );

                    }
                );


            if (!formItem) {
                return;
            }


            const fields =
                Array.isArray(formItem.fields)
                    ? formItem.fields.filter(
                        function(field) {

                            return (
                                field.type !==
                                "section"
                            );

                        }
                    )
                    : [];


            availableFields +=
                fields.length;


            const answers =
                Array.isArray(
                    responseItem.answers
                )
                    ? responseItem.answers
                    : [];


            answers.forEach(
                function(answer) {

                    if (
                        analyticsHasValue(
                            answer.value
                        )
                    ) {

                        answeredFields++;

                    }

                }
            );

        }
    );


    if (availableFields === 0) {
        return 0;
    }


    return Math.round(
        (
            answeredFields /
            availableFields
        ) * 100
    );

}

// ==========================================
// FORM PERFORMANCE CHART
// ==========================================

function renderAnalyticsPerformanceChart() {

    const chart =
        document.getElementById(
            "analyticsPerformanceChart"
        );

    const legend =
        document.getElementById(
            "analyticsChartLegend"
        );


    if (!chart || !legend) {
        return;
    }


    const responses =
        getAnalyticsPeriodResponses(
            analyticsSelectedDays
        );


    // Count responses for every form
    const formPerformance =
        analyticsForms.map(
            function(formItem) {

                const responseCount =
                    responses.filter(
                        function(responseItem) {

                            return (
                                String(responseItem.formId) ===
                                String(formItem._id)
                            );

                        }
                    ).length;


                return {
                    id: formItem._id,

                    title:
                        formItem.title ||
                        "Untitled Form",

                    responses:
                        responseCount
                };

            }
        );


    // Highest response count first
    formPerformance.sort(
        function(a, b) {

            return (
                b.responses -
                a.responses
            );

        }
    );


    // Keep chart readable
    const visibleForms =
        formPerformance.slice(0, 6);


    const maxResponses =
        Math.max(
            ...visibleForms.map(
                function(formItem) {

                    return formItem.responses;

                }
            ),
            1
        );


    // ======================================
    // EMPTY STATE
    // ======================================

    if (
        visibleForms.length === 0 ||
        responses.length === 0
    ) {

        legend.innerHTML = "";


        chart.innerHTML = `
            <div class="analytics-chart-empty">

                <div class="analytics-chart-empty-icon analytics-floating-chart-icon">

                    <div class="analytics-float-card analytics-float-card-back"></div>

                    <div class="analytics-float-card analytics-float-card-middle"></div>

                    <div class="analytics-float-card analytics-float-card-main">

                        <div class="analytics-float-line">

                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>

                            <svg
                                viewBox="0 0 100 45"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                            >
                                <polyline
                                    points="8,34 34,18 58,27 88,8"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></polyline>
                            </svg>

                        </div>

                        <div class="analytics-float-bars">
                            <i></i>
                            <i></i>
                            <i></i>
                            <i></i>
                            <i></i>
                        </div>

                    </div>

                </div>

                <strong>
                    No response activity yet
                </strong>

                <span>
                    Responses in this period will appear here.
                </span>

            </div>
        `;

        return;
    }


    // ======================================
    // LEGEND
    // ======================================

    legend.innerHTML =
        `
            <div class="analytics-chart-summary">

                <strong>
                    ${responses.length}
                </strong>

                <span>
                    ${
                        responses.length === 1
                            ? "response"
                            : "responses"
                    }
                </span>

            </div>
        `;


    // ======================================
    // BAR CHART
    // ======================================

    chart.innerHTML =
        `
            <div class="analytics-performance-bars">

                ${visibleForms.map(
                    function(formItem, index) {

                        const height =
                            formItem.responses === 0
                                ? 4
                                : Math.max(
                                    12,
                                    (
                                        formItem.responses /
                                        maxResponses
                                    ) * 100
                                );


                        return `
                            <div class="analytics-performance-column">

                                <div class="analytics-bar-value">
                                    ${formItem.responses}
                                </div>

                                <div class="analytics-bar-track">

                                    <div
                                        class="analytics-bar-fill analytics-bar-${(index % 6) + 1}"
                                        style="height: ${height}%"
                                        title="${formItem.title}: ${formItem.responses} responses"
                                    ></div>

                                </div>

                                <div
                                    class="analytics-bar-label"
                                    title="${formItem.title}"
                                >
                                    ${escapeAnalyticsHtml(formItem.title)}
                                </div>

                            </div>
                        `;

                    }
                ).join("")}

            </div>
        `;

}


// ==========================================
// SAFE HTML
// ==========================================

function escapeAnalyticsHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

// ==========================================
// TOP PERFORMING FORMS
// ==========================================

function renderAnalyticsTopForms() {

    const container =
        document.getElementById(
            "analyticsTopFormsList"
        );

    const periodLabel =
        document.getElementById(
            "analyticsTopFormsPeriod"
        );


    if (!container) {
        return;
    }


    const responses =
        getAnalyticsPeriodResponses(
            analyticsSelectedDays
        );


    // ======================================
    // PERIOD LABEL
    // ======================================

    if (periodLabel) {

        if (analyticsSelectedDays === "all") {

            periodLabel.textContent =
                "All Time";

        }

        else {

            periodLabel.textContent =
                `Last ${analyticsSelectedDays} Days`;

        }

    }


    // ======================================
    // COUNT RESPONSES PER FORM
    // ======================================

    const rankedForms =
        analyticsForms
            .map(
                function(formItem) {

                    const responseCount =
                        responses.filter(
                            function(responseItem) {

                                return (
                                    String(responseItem.formId) ===
                                    String(formItem._id)
                                );

                            }
                        ).length;


                    return {

                        id:
                            formItem._id,

                        title:
                            formItem.title ||
                            "Untitled Form",

                        responses:
                            responseCount

                    };

                }
            )
            .filter(
                function(formItem) {

                    return (
                        formItem.responses > 0
                    );

                }
            )
            .sort(
                function(a, b) {

                    return (
                        b.responses -
                        a.responses
                    );

                }
            )
            .slice(0, 5);


    // ======================================
    // EMPTY STATE
    // ======================================

    if (rankedForms.length === 0) {

        container.innerHTML = `

            <div class="analytics-top-forms-loading">

                <div class="analytics-leaderboard-visual">

                    <div class="analytics-podium analytics-podium-second">
                        <span>2</span>
                    </div>

                    <div class="analytics-podium analytics-podium-first">
                        <span>1</span>
                    </div>

                    <div class="analytics-podium analytics-podium-third">
                        <span>3</span>
                    </div>

                </div>

                <strong>
                    No ranked forms yet
                </strong>

                <span>
                    Forms receiving responses will appear here.
                </span>

            </div>
        `;

        return;
    }


    const highestResponses =
        rankedForms[0].responses;


    // ======================================
    // REAL RANKING
    // ======================================

    container.innerHTML =
        `
            <div class="analytics-ranking-list">

                ${rankedForms.map(
                    function(formItem, index) {

                        const percentage =
                            highestResponses > 0
                                ? (
                                    formItem.responses /
                                    highestResponses
                                ) * 100
                                : 0;


                        return `
                            <div class="analytics-ranking-row">

                                <div class="analytics-ranking-position">
                                    ${index + 1}
                                </div>


                                <div class="analytics-ranking-info">

                                    <div class="analytics-ranking-title-row">

                                        <strong title="${escapeAnalyticsHtml(formItem.title)}">
                                            ${escapeAnalyticsHtml(formItem.title)}
                                        </strong>

                                        <span>
                                            ${formItem.responses}
                                            ${
                                                formItem.responses === 1
                                                    ? "response"
                                                    : "responses"
                                            }
                                        </span>

                                    </div>


                                    <div class="analytics-ranking-progress">

                                        <div
                                            class="analytics-ranking-progress-fill"
                                            style="width: ${percentage}%"
                                        ></div>

                                    </div>

                                </div>

                            </div>
                        `;

                    }
                ).join("")}

            </div>
        `;

}

// ==========================================
// ALL FORMS PERFORMANCE TABLE
// ==========================================

function renderAnalyticsFormsTable() {

    const tableBody =
        document.getElementById("analyticsFormsTableBody");

    const periodElement =
        document.getElementById("analyticsTablePeriod");


    if (!tableBody) {
        return;
    }


    const periodResponses =
        getAnalyticsPeriodResponses(
            analyticsSelectedDays
        );


    // PERIOD LABEL
    if (periodElement) {

        periodElement.textContent =
            analyticsSelectedDays === "all"
                ? "All Time"
                : `Last ${analyticsSelectedDays} Days`;

    }


    // NO FORMS
    if (!analyticsForms.length) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="analytics-table-loading"
                >
                    No forms available.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        analyticsForms.map(function(form) {

            const formId =
                String(form._id || form.id || "");


            const formResponses =
                periodResponses.filter(function(response) {

                    const responseFormId =
                        String(
                            response.form?._id ||
                            response.form ||
                            response.formId ||
                            ""
                        );

                    return responseFormId === formId;

                });


            // -----------------------------
            // RESPONSE COUNT
            // -----------------------------

            const responseCount =
                formResponses.length;


            // -----------------------------
            // COMPLETION RATE
            // -----------------------------

            const totalFields =
                Array.isArray(form.fields)
                    ? form.fields.filter(function(field) {
                        return field.type !== "section";
                    }).length
                    : 0;


            let answeredFields = 0;


            formResponses.forEach(function(response) {

                const answers =
                    response.answers || {};

                if (Array.isArray(answers)) {

                    answers.forEach(function(answer) {

                        const value =
                            answer?.value ??
                            answer?.answer;

                        if (
                            value !== undefined &&
                            value !== null &&
                            String(value).trim() !== ""
                        ) {
                            answeredFields++;
                        }

                    });

                } else {

                    Object.values(answers)
                        .forEach(function(value) {

                            if (
                                value !== undefined &&
                                value !== null &&
                                String(value).trim() !== ""
                            ) {
                                answeredFields++;
                            }

                        });

                }

            });


            const possibleAnswers =
                totalFields * responseCount;


            const completionRate =
                possibleAnswers > 0
                    ? Math.round(
                        (answeredFields / possibleAnswers) * 100
                    )
                    : 0;


            // -----------------------------
            // UNIQUE VISITORS
            // -----------------------------

            const visitorIds =
                new Set();


            formResponses.forEach(function(response) {

                const visitorId =
                    response.metadata?.visitorId;

                if (visitorId) {
                    visitorIds.add(visitorId);
                }

            });


            const uniqueVisitors =
                visitorIds.size;


            // -----------------------------
            // LAST RESPONSE
            // -----------------------------

            let lastResponseText = "—";


            if (formResponses.length) {

                const dates =
                    formResponses
                        .map(function(response) {
                            return new Date(
                                response.createdAt
                            );
                        })
                        .filter(function(date) {
                            return !Number.isNaN(
                                date.getTime()
                            );
                        })
                        .sort(function(a, b) {
                            return b - a;
                        });


                if (dates.length) {

                    lastResponseText =
                        dates[0].toLocaleDateString(
                            undefined,
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        );

                }

            }


            // -----------------------------
            // ACTIVITY STATUS
            // -----------------------------

            const activityStatus =
                responseCount > 0
                    ? "Active"
                    : "Inactive";


            const statusClass =
                responseCount > 0
                    ? "active"
                    : "inactive";


            const safeTitle =
                escapeAnalyticsHtml(
                    form.title || "Untitled Form"
                );


            return `
                <tr>

                    <td>

                        <div class="analytics-table-form">

                            <div class="analytics-table-form-icon">

                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M7 3h7l4 4v14H7z"
                                    ></path>

                                    <path
                                        d="M14 3v5h5"
                                    ></path>

                                    <path
                                        d="M10 12h5"
                                    ></path>

                                    <path
                                        d="M10 16h5"
                                    ></path>
                                </svg>

                            </div>

                            <span class="analytics-table-form-name">
                                ${safeTitle}
                            </span>

                        </div>

                    </td>


                    <td>
                        ${responseCount}
                    </td>


                    <td>
                        ${completionRate}%
                    </td>


                    <td>
                        ${uniqueVisitors}
                    </td>


                    <td>
                        ${lastResponseText}
                    </td>


                    <td>

                        <span
                            class="analytics-table-status ${statusClass}"
                        >
                            ${activityStatus}
                        </span>

                    </td>


                    <td>

                        <a
                            class="analytics-view-details"
                            href="responses.html?formId=${encodeURIComponent(formId)}"
                              onclick="localStorage.setItem('selectedResponsesFormId', '${formId}')"
                        >
                            View Details

                            <svg viewBox="0 0 24 24">
                                <path d="M5 12h14"></path>
                                <path d="m14 7 5 5-5 5"></path>
                            </svg>

                        </a>

                    </td>

                </tr>
            `;

        }).join("");
}

// ==========================================
// FORM HEALTH
// ==========================================

function renderAnalyticsFormHealth() {

    const healthyElement =
        document.getElementById("analyticsHealthyForms");

    const attentionElement =
        document.getElementById("analyticsAttentionForms");

    const inactiveElement =
        document.getElementById("analyticsInactiveForms");

    const periodElement =
        document.getElementById("analyticsHealthPeriod");


    if (
        !healthyElement ||
        !attentionElement ||
        !inactiveElement
    ) {
        return;
    }


    const periodResponses =
        getAnalyticsPeriodResponses(
            analyticsSelectedDays
        );


    // Period text
    if (periodElement) {

        periodElement.textContent =
            analyticsSelectedDays === "all"
                ? "All Time"
                : `Last ${analyticsSelectedDays} Days`;

    }


    let performingWell = 0;
    let needsAttention = 0;
    let inactive = 0;


    analyticsForms.forEach(function(form) {

        const formId =
            String(form._id || form.id || "");


        const responseCount =
            periodResponses.filter(function(response) {

                const responseFormId =
                    String(
                        response.form?._id ||
                        response.form ||
                        response.formId ||
                        ""
                    );

                return responseFormId === formId;

            }).length;


        if (responseCount >= 2) {

            performingWell++;

        } else if (responseCount === 1) {

            needsAttention++;

        } else {

            inactive++;

        }

    });


    healthyElement.textContent =
        performingWell;

    attentionElement.textContent =
        needsAttention;

    inactiveElement.textContent =
        inactive;
}

// ==========================================
// AUDIENCE SNAPSHOT
// ==========================================

function renderAnalyticsAudience() {

    const deviceContainer =
        document.getElementById("analyticsDeviceSnapshot");

    const locationContainer =
        document.getElementById("analyticsLocationSnapshot");

    const browserContainer =
        document.getElementById("analyticsBrowserSnapshot");

    const periodLabel =
        document.getElementById("analyticsAudiencePeriod");


    if (
        !deviceContainer ||
        !locationContainer ||
        !browserContainer
    ) {
        return;
    }


    const responses =
        getAnalyticsPeriodResponses(
            analyticsSelectedDays
        );


    // PERIOD LABEL

    if (periodLabel) {

        periodLabel.textContent =
            analyticsSelectedDays === "all"
                ? "All Time"
                : `Last ${analyticsSelectedDays} Days`;

    }


    // ======================================
    // DEVICE DATA
    // ======================================

    const deviceCounts = {};

    responses.forEach(function(response) {

        const device =
            response.metadata?.deviceType;

        if (device) {

            const name =
                String(device).trim();

            if (name) {
                deviceCounts[name] =
                    (deviceCounts[name] || 0) + 1;
            }

        }

    });


    renderAudienceBreakdown(
        deviceContainer,
        deviceCounts,
        "No device data available"
    );


    // ======================================
    // BROWSER DATA
    // ======================================

    const browserCounts = {};

    responses.forEach(function(response) {

        const browser =
            response.metadata?.browser;

        if (browser) {

            const name =
                String(browser).trim();

            if (name) {
                browserCounts[name] =
                    (browserCounts[name] || 0) + 1;
            }

        }

    });


    renderAudienceBreakdown(
        browserContainer,
        browserCounts,
        "No browser data available"
    );


    // ======================================
    // LOCATION DATA
    // ======================================

    const locationCounts = {};

    responses.forEach(function(response) {

        const location =
            response.metadata?.location;

        if (!location) {
            return;
        }


        const city =
            location.city
                ? String(location.city).trim()
                : "";

        const region =
            location.region
                ? String(location.region).trim()
                : "";

        const country =
            location.country
                ? String(location.country).trim()
                : "";


        const locationName =
            city ||
            region ||
            country;


        if (locationName) {

            locationCounts[locationName] =
                (locationCounts[locationName] || 0) + 1;

        }

    });


    renderAudienceBreakdown(
        locationContainer,
        locationCounts,
        "No location data available"
    );

}


// ==========================================
// AUDIENCE BREAKDOWN RENDERER
// ==========================================

function renderAudienceBreakdown(
    container,
    counts,
    emptyMessage
) {

    const entries =
        Object.entries(counts)
            .sort(function(a, b) {
                return b[1] - a[1];
            })
            .slice(0, 4);


    const total =
        Object.values(counts)
            .reduce(function(sum, value) {
                return sum + value;
            }, 0);


    if (
        entries.length === 0 ||
        total === 0
    ) {

        container.innerHTML = `
            <div class="analytics-audience-empty">
                ${emptyMessage}
            </div>
        `;

        return;
    }


    container.innerHTML =
        `
            <div class="analytics-audience-breakdown">

                ${entries.map(
                    function(entry) {

                        const name =
                            entry[0];

                        const count =
                            entry[1];

                        const percentage =
                            Math.round(
                                (count / total) * 100
                            );


                        return `
                            <div class="analytics-audience-row">

                                <div class="analytics-audience-row-top">

                                    <span title="${escapeAnalyticsHtml(name)}">
                                        ${escapeAnalyticsHtml(name)}
                                    </span>

                                    <strong>
                                        ${percentage}%
                                    </strong>

                                </div>

                                <div class="analytics-audience-progress">

                                    <div
                                        class="analytics-audience-progress-fill"
                                        style="width: ${percentage}%"
                                    ></div>

                                </div>

                                <small>
                                    ${count}
                                    ${
                                        count === 1
                                            ? "response"
                                            : "responses"
                                    }
                                </small>

                            </div>
                        `;

                    }
                ).join("")}

            </div>
        `;

}

// ==========================================
// UPDATE KPI CARDS
// ==========================================

function updateAnalyticsKpis() {

    const currentResponses =
        getAnalyticsPeriodResponses(
            analyticsSelectedDays
        );


    const previousResponses =
        getAnalyticsPeriodResponses(
            analyticsSelectedDays,
            true
        );


    // ======================================
    // RESPONSE GROWTH
    // ======================================

    let growth = 0;


    if (
        analyticsSelectedDays !== "all"
    ) {

        if (
            previousResponses.length > 0
        ) {

            growth =
                Math.round(
                    (
                        (
                            currentResponses.length -
                            previousResponses.length
                        )
                        /
                        previousResponses.length
                    ) * 100
                );

        }

        else if (
            currentResponses.length > 0
        ) {

            growth = 100;

        }

    }


    const growthElement =
        document.getElementById(
            "analyticsResponseGrowth"
        );


    const growthBadge =
        document.getElementById(
            "analyticsGrowthBadge"
        );


    if (growthElement) {

        growthElement.textContent =
            analyticsSelectedDays === "all"
                ? "—"
                : `${growth}%`;

    }


    if (growthBadge) {

        if (
            analyticsSelectedDays === "all"
        ) {

            growthBadge.textContent =
                "ALL TIME";

        }

        else if (growth > 0) {

            growthBadge.textContent =
                `+${growth}%`;

        }

        else {

            growthBadge.textContent =
                `${growth}%`;

        }

    }


    // ======================================
    // AVERAGE COMPLETION RATE
    // ======================================

    const completionRate =
        calculateAnalyticsCompletion(
            currentResponses
        );


    const completionElement =
        document.getElementById(
            "analyticsAverageCompletion"
        );


    if (completionElement) {

        completionElement.textContent =
            `${completionRate}%`;

    }


    // ======================================
    // ACTIVE FORMS
    // ======================================

    const activeFormIds =
        new Set(
            currentResponses
                .map(
                    function(responseItem) {

                        return String(
                            responseItem.formId ||
                            ""
                        );

                    }
                )
                .filter(Boolean)
        );


    const activeFormsElement =
        document.getElementById(
            "analyticsActiveForms"
        );


    if (activeFormsElement) {

        activeFormsElement.textContent =
            activeFormIds.size;

    }


    // ======================================
    // BEST PERFORMING FORM
    // Based on highest response count
    // ======================================

    const responseCounts = {};


    currentResponses.forEach(
        function(responseItem) {

            const formId =
                String(
                    responseItem.formId ||
                    ""
                );


            if (!formId) {
                return;
            }


            responseCounts[formId] =
                (
                    responseCounts[formId] ||
                    0
                ) + 1;

        }
    );


    let bestFormId = null;
    let bestFormResponses = 0;


    Object.entries(
        responseCounts
    ).forEach(
        function([
            formId,
            responseCount
        ]) {

            if (
                responseCount >
                bestFormResponses
            ) {

                bestFormId =
                    formId;

                bestFormResponses =
                    responseCount;

            }

        }
    );


    const bestForm =
        analyticsForms.find(
            function(formItem) {

                return (
                    String(formItem._id) ===
                    String(bestFormId)
                );

            }
        );


    const bestFormElement =
        document.getElementById(
            "analyticsBestForm"
        );


    const bestFormText =
        document.getElementById(
            "analyticsBestFormText"
        );


    if (bestFormElement) {

        bestFormElement.textContent =
            bestForm
                ? (
                    bestForm.title ||
                    "Untitled Form"
                )
                : "—";

    }


    if (bestFormText) {

        bestFormText.textContent =
            bestForm
                ? `${bestFormResponses} responses`
                : "No responses in this period";

    }

}

// ==========================================
// ANALYTICS HELPERS
// ==========================================

function getResponseFormId(response) {
    return String(
        response?.form?._id ||
        response?.form ||
        response?.formId ||
        ""
    );
}

function getAnalyticsFormTitle(form) {
    return form?.title || "Untitled Form";
}

function getResponseCompletionRate(response, form) {

    const fields = Array.isArray(form?.fields)
        ? form.fields.filter(function(field) {
            return field.type !== "section";
        })
        : [];

    if (fields.length === 0) {
        return 0;
    }

    const answers = response?.answers || [];

    let answeredCount = 0;

    if (Array.isArray(answers)) {

        answers.forEach(function(answer) {

            const value =
                answer?.value ??
                answer?.answer;

            if (analyticsHasValue(value)) {
                answeredCount++;
            }

        });

    } else if (
        answers &&
        typeof answers === "object"
    ) {

        Object.values(answers).forEach(function(value) {

            if (analyticsHasValue(value)) {
                answeredCount++;
            }

        });
    }

    return Math.round(
        (answeredCount / fields.length) * 100
    );
}

// ==========================================
// KEY INSIGHTS
// ==========================================

function renderAnalyticsKeyInsights() {

   const periodResponses =
    getAnalyticsPeriodResponses(analyticsSelectedDays);

    // ------------------------------------------
    // 1. TOP FORM
    // ------------------------------------------

    let bestForm = null;
    let bestFormResponses = 0;

    analyticsForms.forEach(function (form) {

        const count = periodResponses.filter(function (response) {
            return getResponseFormId(response) === String(form._id);
        }).length;

        if (count > bestFormResponses) {
            bestFormResponses = count;
            bestForm = form;
        }

    });


    // ------------------------------------------
    // 2. AVERAGE COMPLETION
    // ------------------------------------------

    let completionTotal = 0;
    let formsWithResponses = 0;


    analyticsForms.forEach(function (form) {

        const formResponses = periodResponses.filter(function (response) {
            return getResponseFormId(response) === String(form._id);
        });


        if (formResponses.length === 0) {
            return;
        }


        let formCompletionTotal = 0;


        formResponses.forEach(function (response) {

            formCompletionTotal +=
                getResponseCompletionRate(
                    response,
                    form
                );

        });


        completionTotal +=
            formCompletionTotal /
            formResponses.length;


        formsWithResponses++;

    });


    const averageCompletion =
        formsWithResponses > 0
            ? Math.round(
                completionTotal /
                formsWithResponses
            )
            : 0;


    // ------------------------------------------
    // 3. NEEDS ATTENTION
    // ------------------------------------------

    let needsAttention = 0;


    analyticsForms.forEach(function (form) {

        const responseCount =
            periodResponses.filter(function (response) {

                return getResponseFormId(response) ===
                    String(form._id);

            }).length;


        if (responseCount > 0 && responseCount < 3) {
            needsAttention++;
        }

    });


    // ------------------------------------------
    // 4. UNIQUE VISITORS
    // ------------------------------------------

    const visitorIds = new Set();


    periodResponses.forEach(function (response) {

        const visitorId =
            response &&
            response.metadata &&
            response.metadata.visitorId;


        if (visitorId) {
            visitorIds.add(visitorId);
        }

    });


    const uniqueVisitors =
        visitorIds.size;

        const insightsPeriod =
    document.getElementById("insightsPeriod");

            if (insightsPeriod) {
                insightsPeriod.textContent =
                    analyticsSelectedDays === "all"
                        ? "All Time"
                        : `Last ${analyticsSelectedDays} Days`;
            }


    // ------------------------------------------
    // UPDATE TOP FORM
    // ------------------------------------------

    const topFormValue =
        document.getElementById(
           "insightTopForm"
        );

    const topFormText =
        document.getElementById(
            "insightTopFormText"
        );


    if (topFormValue) {

        topFormValue.textContent =
            bestForm
                ? getAnalyticsFormTitle(bestForm)
                : "—";

    }


    if (topFormText) {

        topFormText.textContent =
            bestForm
                ? bestFormResponses +
                  (
                      bestFormResponses === 1
                          ? " response"
                          : " responses"
                  )
                : "No responses in this period";

    }


    // ------------------------------------------
    // UPDATE COMPLETION
    // ------------------------------------------

    const completionValue =
        document.getElementById(
            "insightCompletion"
        );

    const completionText =
        document.getElementById(
            "insightCompletionText"
        );


    if (completionValue) {

        completionValue.textContent =
            averageCompletion + "%";

    }


    if (completionText) {

        completionText.textContent =
            formsWithResponses > 0
                ? "Average across active forms"
                : "No completion data available";

    }


    // ------------------------------------------
    // UPDATE NEEDS ATTENTION
    // ------------------------------------------

    const attentionValue =
        document.getElementById(
            "insightAttention"
        );

    const attentionText =
        document.getElementById(
            "insightAttentionText"
        );


    if (attentionValue) {

        attentionValue.textContent =
            needsAttention;

    }


    if (attentionText) {

        attentionText.textContent =
            needsAttention === 1
                ? "1 form has low recent activity"
                : needsAttention +
                  " forms have low recent activity";

    }


    // ------------------------------------------
    // UPDATE AUDIENCE
    // ------------------------------------------

    const audienceValue =
        document.getElementById(
            "insightAudience"
        );

    const audienceText =
        document.getElementById(
            "insightAudienceText"
        );


    if (audienceValue) {

        audienceValue.textContent =
            uniqueVisitors;

    }


    if (audienceText) {

        audienceText.textContent =
            uniqueVisitors === 1
                ? "1 unique visitor"
                : uniqueVisitors +
                  " unique visitors";

    }

}

// ==========================================
// PERIOD FILTER BUTTONS
// ==========================================

const analyticsPeriodButtons =
    document.querySelectorAll(
        ".analytics-period-btn"
    );


analyticsPeriodButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                // Remove active state
                analyticsPeriodButtons.forEach(
                    function(periodButton) {

                        periodButton.classList.remove(
                            "active"
                        );

                    }
                );


                // Make clicked button active
                button.classList.add(
                    "active"
                );


                // Read selected period
                const selectedPeriod =
                    button.dataset.period;


                if (
                    selectedPeriod === "all"
                ) {

                    analyticsSelectedDays =
                        "all";

                }

                else {

                    analyticsSelectedDays =
                        Number(
                            selectedPeriod
                        );

                }


                // Recalculate all KPI cards
                updateAnalyticsKpis();
                renderAnalyticsPerformanceChart();
                renderAnalyticsTopForms();
                renderAnalyticsAudience();
                renderAnalyticsFormHealth();
                renderAnalyticsFormsTable();
                renderAnalyticsKeyInsights();

            }
        );

    }
);

// ==========================================
// ANALYTICS SEARCH
// ==========================================

const analyticsSearchInput =
    document.getElementById("analyticsSearch");

if (analyticsSearchInput) {

    analyticsSearchInput.addEventListener(
        "input",
        function() {

            const searchValue =
                analyticsSearchInput.value
                    .trim()
                    .toLowerCase();

            const tableRows =
                document.querySelectorAll(
                    "#analyticsFormsTableBody tr"
                );

            tableRows.forEach(function(row) {

                const formNameElement =
                    row.querySelector(
                        ".analytics-table-form-name"
                    );

                if (!formNameElement) {
                    return;
                }

                const formName =
                    formNameElement.textContent
                        .trim()
                        .toLowerCase();

                row.style.display =
                    formName.includes(searchValue)
                        ? ""
                        : "none";
            });

        }
    );

}

// ==========================================
// CTRL + K SEARCH SHORTCUT
// ==========================================

document.addEventListener("keydown", function(event) {

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        if (analyticsSearchInput) {

            analyticsSearchInput.focus();
            analyticsSearchInput.select();

        }
    }

});

// ==========================================
// START
// ==========================================

loadAnalyticsData();