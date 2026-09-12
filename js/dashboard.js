const FORMS_API_URL =
    "http://localhost:5000/api/forms";

const RESPONSES_API_URL =
    "http://localhost:5000/api/responses";

const PROFILE_API_URL =
    "http://localhost:5000/api/auth/profile";

const formsDashboardList =
    document.getElementById(
        "formsDashboardList"
    );

const dashboardSearch =
    document.getElementById(
        "dashboardSearch"
    );

const dashboardStatusFilter =
    document.getElementById(
        "dashboardStatusFilter"
    );

let dashboardForms = [];
let dashboardResponses = [];


// ==========================================
// LOAD FORMS
// ==========================================

async function loadDashboardProfile() {

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

        const response =
            await fetch(
                PROFILE_API_URL,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (handleAuthFailure(response)) return;

        const result =
            await response.json();


        if (!response.ok) {

            localStorage.removeItem(
                "authToken"
            );

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "login.html";

            return;
        }


        const user =
            result.data;


        const profileName =
            document.getElementById(
                "dashboardProfileName"
            );

        const welcomeName =
            document.getElementById(
                "dashboardWelcomeName"
            );

        const profileAvatar =
            document.getElementById(
                "dashboardProfileAvatar"
            );


        if (profileName) {
            profileName.textContent =
                user.name;
        }


        if (welcomeName) {
            welcomeName.textContent =
                user.name;
        }


        if (profileAvatar) {

            profileAvatar.textContent =
                user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U";
        }

    }

    catch (error) {

        console.error(
            "Profile load error:",
            error
        );

    }

}

async function loadDashboardForms() {

    try {

        const token =
    localStorage.getItem(
        "authToken"
    );

        const response =
            await fetch(
                FORMS_API_URL,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (handleAuthFailure(response)) return;

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to load forms"
            );

        }

       dashboardForms =
            Array.isArray(result.data)
                ? result.data
                : [];

        await loadDashboardResponses();

        updateDashboardStats();

        renderDashboardForms();

    }

    catch (error) {

        console.error(
            "Dashboard load error:",
            error
        );

        formsDashboardList.innerHTML = `
            <div class="dashboard-empty-state">

                <h2>
                    Unable to load forms
                </h2>

                <p>
                    Make sure the backend server is running.
                </p>

            </div>
        `;

    }

}

// ==========================================
// LOAD RESPONSES
// ==========================================

async function loadDashboardResponses() {

    try {

        const response =
    await fetch(
        RESPONSES_API_URL,
        {
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
                "Unable to load responses"
            );

        }

        dashboardResponses =
            Array.isArray(result.data)
                ? result.data
                : [];

    }

    catch (error) {

        console.error(
            "Dashboard responses error:",
            error
        );

        dashboardResponses = [];

    }

}

// ==========================================
// DASHBOARD STATS
// ==========================================

function updateDashboardStats() {

    const totalForms =
        dashboardForms.length;

    const publishedForms =
        dashboardForms.filter(
            formItem =>
                formItem.status === "published"
        ).length;

    const draftForms =
        dashboardForms.filter(
            formItem =>
                formItem.status === "draft"
        ).length;

    const totalResponses =
        dashboardResponses.length;


    const totalFormsElement =
        document.getElementById(
            "dashboardTotalForms"
        );

    const publishedFormsElement =
        document.getElementById(
            "dashboardPublishedForms"
        );

    const draftFormsElement =
        document.getElementById(
            "dashboardDraftForms"
        );

    const totalResponsesElement =
        document.getElementById(
            "dashboardTotalResponses"
        );


    if (totalFormsElement) {
        totalFormsElement.textContent =
            totalForms;
    }

    if (publishedFormsElement) {
        publishedFormsElement.textContent =
            publishedForms;
    }

    if (draftFormsElement) {
        draftFormsElement.textContent =
            draftForms;
    }

    if (totalResponsesElement) {
        totalResponsesElement.textContent =
            totalResponses;
    }


    const allFormsCount =
        document.getElementById(
            "allFormsCount"
        );

    const publishedFormsCount =
        document.getElementById(
            "publishedFormsCount"
        );

    const draftFormsCount =
        document.getElementById(
            "draftFormsCount"
        );


    if (allFormsCount) {
        allFormsCount.textContent =
            `(${totalForms})`;
    }

    if (publishedFormsCount) {
        publishedFormsCount.textContent =
            `(${publishedForms})`;
    }

    if (draftFormsCount) {
        draftFormsCount.textContent =
            `(${draftForms})`;
    }

    const now =
    new Date();

const currentMonth =
    now.getMonth();

const currentYear =
    now.getFullYear();


const formsThisMonth =
    dashboardForms.filter(
        function(formItem) {

            const formDate =
                new Date(
                    formItem.createdAt ||
                    formItem.updatedAt ||
                    0
                );

            return (
                formDate.getMonth() ===
                    currentMonth
                &&
                formDate.getFullYear() ===
                    currentYear
            );

        }
    ).length;


const responsesThisMonth =
    dashboardResponses.filter(
        function(responseItem) {

            const responseDate =
                new Date(
                    responseItem.createdAt ||
                    0
                );

            return (
                responseDate.getMonth() ===
                    currentMonth
                &&
                responseDate.getFullYear() ===
                    currentYear
            );

        }
    ).length;


const publishedPercent =
    totalForms > 0
        ? Math.round(
            (
                publishedForms /
                totalForms
            ) * 100
        )
        : 0;

        const formsTrend =
    document.getElementById(
        "dashboardFormsTrend"
    );

const publishedTrend =
    document.getElementById(
        "dashboardPublishedTrend"
    );

const draftTrend =
    document.getElementById(
        "dashboardDraftTrend"
    );

const responsesTrend =
    document.getElementById(
        "dashboardResponsesTrend"
    );


if (formsTrend) {
    formsTrend.textContent =
        `+${formsThisMonth} this month`;
}

if (publishedTrend) {
    publishedTrend.textContent =
        `${publishedPercent}% of total`;
}

if (draftTrend) {
    draftTrend.textContent =
        `${draftForms} pending`;
}

if (responsesTrend) {
    responsesTrend.textContent =
        `+${responsesThisMonth} this month`;
}
}


// ==========================================
// RENDER FORMS
// ==========================================

function renderDashboardForms() {

    const searchValue =
        dashboardSearch.value
            .trim()
            .toLowerCase();

    const statusValue =
        dashboardStatusFilter.value;


    const filteredForms =
        dashboardForms.filter(
            function(formItem) {

                const title =
                    String(
                        formItem.title || ""
                    ).toLowerCase();

                const matchesSearch =
                    title.includes(
                        searchValue
                    );

                const matchesStatus =
                    statusValue === "all"
                    ||
                    formItem.status ===
                    statusValue;

                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );

        // ==========================================
// SORT FORMS
// ==========================================

const dashboardSort =
    document.getElementById(
        "dashboardSort"
    );

const sortValue =
    dashboardSort
        ? dashboardSort.value
        : "newest";

filteredForms.sort(
    function(a, b) {

        const dateA =
            new Date(
                a.createdAt ||
                a.updatedAt ||
                0
            );

        const dateB =
            new Date(
                b.createdAt ||
                b.updatedAt ||
                0
            );

        if (
            sortValue ===
            "oldest"
        ) {

            return dateA - dateB;

        }

        return dateB - dateA;

    }
);


    if (!filteredForms.length) {

        formsDashboardList.innerHTML = `
            <div class="dashboard-empty-state">

                <h2>
                    No forms found
                </h2>

                <p>
                    Your saved forms will appear here.
                </p>

            </div>
        `;

        return;

    }


    formsDashboardList.innerHTML =
        filteredForms
            .map(
                function(formItem) {


                    const fieldCount =
                        Array.isArray(
                            formItem.fields
                        )
                            ? formItem.fields.length
                            : 0;

                    const status =
                        formItem.status ||
                        "draft";

                        const responseCount =
                        dashboardResponses.filter(
                            responseItem =>
                                String(responseItem.formId) ===
                                String(formItem._id)
                        ).length;

                        const formDate =
                            formItem.updatedAt ||
                            formItem.createdAt;

                        let formattedDate =
                            "No date";

                        if (formDate) {

                            formattedDate =
                                new Date(formDate)
                                    .toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    );

                        }

                    return `
                        <article class="form-dashboard-card">

                            <div class="form-card-top">

                                <h2 class="form-card-title">
                                    ${escapeDashboardHtml(
                                        formItem.title ||
                                        "Untitled Form"
                                    )}
                                </h2>

                                <span
                                    class="form-status ${status}"
                                >
                                    ${status}
                                </span>

                            </div>

                            <div
                                class="form-card-visual
                                form-card-visual-${Math.abs(
                                    String(formItem._id)
                                        .split("")
                                        .reduce(
                                            (sum, char) =>
                                                sum + char.charCodeAt(0),
                                            0
                                        )
                                ) % 6}"
                            >

                                <div class="form-card-visual-sheet">

                                    <div class="visual-sheet-icon">
                                        ${status === "published" ? "✓" : "✦"}
                                    </div>

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>

                                <div class="form-card-floating-card"></div>

                            </div>

                            <p class="form-card-description">
                                ${
                                    escapeDashboardHtml(
                                        formItem.description ||
                                        "No description"
                                    )
                                }
                            </p>

                            <div class="form-card-meta">

                               <span>
                                    ${fieldCount} fields
                                </span>

                                <span>
                                    ${responseCount} responses
                                </span>
                            </div>
                            <div class="form-card-updated">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="16"
                                        rx="2"
                                    ></rect>

                                    <path d="M16 3v4"></path>
                                    <path d="M8 3v4"></path>
                                    <path d="M3 10h18"></path>
                                </svg>

                                <span>
                                    Updated ${formattedDate}
                                </span>
                            </div>

                            <div class="form-card-actions">
                            <button
                                    type="button"
                                    class="view-responses-btn"
                                    data-form-id="${formItem._id}"
                                >
                                    View Responses
                                </button>

                                <button
                                    type="button"
                                    class="share-form-btn"
                                    data-form-id="${formItem._id}"
                                    data-form-status="${status}"
                                >
                                    Share
                                </button>

                                <button
                                    type="button"
                                    class="edit-form-btn"
                                    data-form-id="${formItem._id}"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    class="status-form-btn"
                                    data-form-id="${formItem._id}"
                                >
                                    ${
                                        status === "published"
                                            ? "Unpublish"
                                            : "Publish"
                                    }
                                </button>

                                <button
                                    type="button"
                                    class="delete-form-btn"
                                    data-form-id="${formItem._id}"
                                >
                                    🗑
                                </button>

                            </div>

                        </article>
                    `;

                }
            )
            .join("");

}


// ==========================================
// SAFE HTML
// ==========================================

function escapeDashboardHtml(
    value
) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ==========================================
// FILTER EVENTS
// ==========================================

dashboardSearch.addEventListener(
    "input",
    renderDashboardForms
);
document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            dashboardSearch.focus();

            dashboardSearch.select();
        }
    }
);

dashboardStatusFilter.addEventListener(
    "change",
    function() {

        const selectedValue =
            dashboardStatusFilter.value;

        dashboardFilterTabs.forEach(
            function(tab) {

                tab.classList.toggle(
                    "active",
                    tab.dataset.dashboardFilter ===
                    selectedValue
                );

            }
        );

        renderDashboardForms();

    }
);

const dashboardSortSelect =
    document.getElementById(
        "dashboardSort"
    );

if (dashboardSortSelect) {

    dashboardSortSelect.addEventListener(
        "change",
        renderDashboardForms
    );
    

}

// ==========================================
// DASHBOARD FILTER TABS
// ==========================================

const dashboardFilterTabs =
    document.querySelectorAll(
        ".dashboard-filter-tab"
    );

dashboardFilterTabs.forEach(
    function(tabButton) {

        tabButton.addEventListener(
            "click",
            function() {

                const filterValue =
                    tabButton.dataset.dashboardFilter;

                dashboardStatusFilter.value =
                    filterValue;

                dashboardFilterTabs.forEach(
                    function(tab) {

                        tab.classList.remove(
                            "active"
                        );

                    }
                );

                tabButton.classList.add(
                    "active"
                );

                renderDashboardForms();

            }
        );

    }
);

// ==========================================
// GRID / LIST VIEW
// ==========================================

const dashboardViewButtons =
    document.querySelectorAll(
        ".dashboard-view-toggle"
    );

dashboardViewButtons.forEach(
    function(viewButton) {

        viewButton.addEventListener(
            "click",
            function() {

                const viewType =
                    viewButton.dataset.view;

                dashboardViewButtons.forEach(
                    function(button) {

                        button.classList.remove(
                            "active"
                        );

                    }
                );

                viewButton.classList.add(
                    "active"
                );

                if (
                    viewType === "list"
                ) {

                    formsDashboardList.classList.add(
                        "list-view"
                    );

                }

                else {

                    formsDashboardList.classList.remove(
                        "list-view"
                    );

                }

            }
        );

    }
);


// ==========================================
// DASHBOARD ACTIONS
// ==========================================

formsDashboardList.addEventListener(
    "click",
    function (event) {

        // ==============================
// VIEW RESPONSES
// ==============================

const viewResponsesButton =
    event.target.closest(
        ".view-responses-btn"
    );

if (viewResponsesButton) {

    const formId =
        viewResponsesButton.dataset.formId;

    localStorage.setItem(
        "selectedResponsesFormId",
        formId
    );

    window.location.href =
        "responses.html";

    return;
}

// ==============================
// SHARE FORM
// ==============================

const shareButton =
    event.target.closest(
        ".share-form-btn"
    );

if (shareButton) {

    const formId =
        shareButton.dataset.formId;

    const status =
        shareButton.dataset.formStatus;

    if (status !== "published") {

        alert(
            "Please publish this form before sharing."
        );

        return;
    }

    const publicLink =
        `${window.location.origin}/public-form.html?formId=${formId}`;

    const shareModal =
        document.getElementById(
            "shareFormModal"
        );

    const shareLinkInput =
        document.getElementById(
            "shareFormLink"
        );

    const qrContainer =
        document.getElementById(
            "shareQrCode"
        );

    const embedCodeBox =
        document.getElementById(
            "shareEmbedCode"
        );

    shareLinkInput.value =
        publicLink;

    embedCodeBox.value =
        `<iframe src="${publicLink}" width="100%" height="700" frameborder="0"></iframe>`;

    qrContainer.innerHTML = "";

    new QRCode(
        qrContainer,
        {
            text: publicLink,
            width: 160,
            height: 160
        }
    );

    shareModal.classList.add(
        "show"
    );

    return;
}

        // ==============================
        // EDIT
        // ==============================

        const editButton =
            event.target.closest(
                ".edit-form-btn"
            );

        if (editButton) {

    const formId =
        editButton.dataset.formId;

    localStorage.setItem(
        "currentDatabaseFormId",
        formId
    );

    localStorage.setItem(
        "dashboardEditFormId",
        formId
    );

    window.location.href =
        "index.html";

    return;
}


        // ==============================
        // PUBLISH / UNPUBLISH
        // ==============================

        const statusButton =
            event.target.closest(
                ".status-form-btn"
            );

        if (statusButton) {

            const formId =
                statusButton.dataset.formId;

            const formItem =
                dashboardForms.find(
                    item =>
                        item._id === formId
                );

            if (!formItem) {

                return;

            }

            const newStatus =
                formItem.status ===
                "published"
                    ? "draft"
                    : "published";

            updateFormStatus(
                formId,
                newStatus
            );

            return;

        }

        // ==============================
// DELETE
// ==============================

const deleteButton =
    event.target.closest(
        ".delete-form-btn"
    );

if (deleteButton) {

    const formId =
        deleteButton.dataset.formId;

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this form?"
        );

    if (!confirmDelete) {
        return;
    }

    deleteDashboardForm(
        formId
    );

    return;
}

    }
);
// ==============================
// SHARE MODAL ACTIONS
// ==============================

const shareFormModal =
    document.getElementById(
        "shareFormModal"
    );

const closeShareModal =
    document.getElementById(
        "closeShareModal"
    );

const copyShareLinkBtn =
    document.getElementById(
        "copyShareLinkBtn"
    );

const copyEmbedCodeBtn =
    document.getElementById(
        "copyEmbedCodeBtn"
    );


function copyTextValue(
    value,
    successMessage
) {

    const tempInput =
        document.createElement(
            "textarea"
        );

    tempInput.value = value;

    tempInput.style.position =
        "fixed";

    tempInput.style.left =
        "-9999px";

    document.body.appendChild(
        tempInput
    );

    tempInput.select();

    const copied =
        document.execCommand(
            "copy"
        );

    tempInput.remove();

    if (copied) {

        alert(
            successMessage
        );

    }
    else {

        prompt(
            "Copy manually:",
            value
        );

    }
}


closeShareModal.addEventListener(
    "click",
    function() {

        shareFormModal.classList.remove(
            "show"
        );

    }
);


shareFormModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            shareFormModal
        ) {

            shareFormModal.classList.remove(
                "show"
            );

        }

    }
);


copyShareLinkBtn.addEventListener(
    "click",
    function() {

        const link =
            document.getElementById(
                "shareFormLink"
            ).value;

        copyTextValue(
            link,
            "Public form link copied."
        );

    }
);


copyEmbedCodeBtn.addEventListener(
    "click",
    function() {

        const embedCode =
            document.getElementById(
                "shareEmbedCode"
            ).value;

        copyTextValue(
            embedCode,
            "Embed code copied."
        );

    }
);


// ==========================================
// UPDATE FORM STATUS
// ==========================================

async function updateFormStatus(
    formId,
    status
) {

    try {

        const response =
            await fetch(
                `${FORMS_API_URL}/${formId}`,
                {

                    method:
                        "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${localStorage.getItem(
                                "authToken"
                            )}`
                    },

                    body:
                        JSON.stringify({

                            status:
                                status

                        })

                }
            );

            if (handleAuthFailure(response)) return;

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to update form status"
            );

        }

        await loadDashboardForms();

    }

    catch (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(
            error.message ||
            "Unable to update form status"
        );

    }

    

}
// ==========================================
// DELETE FORM
// ==========================================

async function deleteDashboardForm(
    formId
) {

    try {

        const response =
            await fetch(
                `${FORMS_API_URL}/${formId}`,
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
                "Unable to delete form"
            );

        }

        await loadDashboardForms();

    }

    catch (error) {

        console.error(
            "Delete form error:",
            error
        );

        alert(
            error.message ||
            "Unable to delete form"
        );

    }

}

// ==========================================
// CREATE NEW FORM
// ==========================================

const createFormLinks =
    document.querySelectorAll(
        '.dashboard-create-btn, .dashboard-quick-actions a[href="index.html"]'
    );

createFormLinks.forEach(
    function(createLink) {

        createLink.addEventListener(
            "click",
            function() {

                localStorage.removeItem(
                    "currentDatabaseFormId"
                );

                localStorage.removeItem(
                    "dashboardEditFormId"
                );

                localStorage.removeItem(
                    "currentDatabaseFormTitle"
                );

                localStorage.removeItem(
                    "dynamicForm"
                );

            }
        );

    }
);

const dashboardLogoutBtn =
    document.getElementById(
        "dashboardLogoutBtn"
    );

if (dashboardLogoutBtn) {

    dashboardLogoutBtn.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "authToken"
            );

            localStorage.removeItem(
                "loggedInUser"
            );

            localStorage.removeItem(
                "currentDatabaseFormId"
            );

            localStorage.removeItem(
                "dashboardEditFormId"
            );

            window.location.href =
                "login.html";

        }
    );

}


// ==========================================
// START
// ==========================================

async function initializeDashboard() {

    await loadDashboardProfile();

    await loadDashboardForms();

}

initializeDashboard();