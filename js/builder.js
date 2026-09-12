function addField(type) {

    const field = {

        id: Date.now(),

        type,

        label: "",

        placeholder: "",

        required: false,

        minValue: 0,

        maxValue: 100,

        minLength: 0,

        maxLength: 100,

        rows:
    type === "matrix"
        ? [
            "Service",
            "Quality",
            "Support"
        ]
        : undefined,

columns:
    type === "matrix"
        ? [
            "Poor",
            "Average",
            "Good",
            "Excellent"
        ]
        : undefined,

        options:
    type === "dropdown" ||
    type === "radio" ||
    type === "multiselect" ||
    type === "checkboxgroup"
        ? [
            "Option 1",
            "Option 2",
            "Option 3"
        ]
        : undefined,

        

        includeMiddleName:
            type === "name"
                ? false
                : undefined,

        rule: null

        

    };


    const labels = {

        text: "Text Field",

        email: "Email Field",

        phone: "Phone Field",

        url: "Website URL",

        time: "Preferred Time",

        datetime: "Appointment Date & Time",

        multiselect: "Skills",

        address: "Address",

        name: "Full Name",

        scale: "Satisfaction Level",

        range: "Select a value",

        yesno: "Yes / No",

        imagechoice: "Choose an image",

        currency: "Budget",

        password: "Password",

        signature: "Signature",

        matrix: "Satisfaction Matrix",

        textarea: "Textarea Field",

        radio: "Radio Field",

        checkboxgroup: "Choose all that apply",

        file: "File Upload",

        rating: "Rating",

        section: "Section Heading",

        number: "Number Field",

        date: "Date Field",

        checkbox: "Checkbox",

        dropdown: "Dropdown"

    };


    field.label =
        labels[type] ||
        "Field";


    if (
        type === "email"
    ) {

        field.placeholder =
            "Enter email address";

    }


    if (
        type === "phone"
    ) {

        field.placeholder =
            "Enter phone number";

        field.minLength = 7;

        field.maxLength = 20;

    }

    if (
        type === "url"
    ) {

        field.placeholder =
            "https://example.com";

    }


    if (
        type === "textarea"
    ) {

        field.placeholder =
            "Enter your response";

        field.minLength = 0;

        field.maxLength = 500;

    }


    if (
        type === "rating"
    ) {

        field.minValue = 1;

        field.maxValue = 5;

    }

    if (type === "yesno") {
    field.options = [
        "Yes",
        "No"
    ];
}

if (type === "imagechoice") {
    field.options = [
        {
            label: "Option 1",
            image: ""
        },
        {
            label: "Option 2",
            image: ""
        }
    ];
}

    if (
    type === "scale"
) {

    field.minValue = 1;
    field.maxValue = 10;

}

if (
    type === "range"
) {

    field.minValue = 0;
    field.maxValue = 100;
    field.placeholder = "50";

}

if (
    type === "currency"
) {

    field.placeholder =
        "Enter amount";

    field.minValue =
        0;

    field.maxValue =
        1000000;

}

if (
    type === "password"
) {

    field.placeholder =
        "Enter password";

    field.minLength =
        6;

    field.maxLength =
        50;

}
if (
    type === "signature"
) {

    field.required =
        false;

}


    // Section Heading is display-only.

    if (
        type === "section"
    ) {

        field.label =
            "New Section";

        field.placeholder =
            "";

        field.required =
            false;

        field.rule =
            null;

    }


   if (
    type === "dropdown" ||
    type === "radio" ||
    type === "multiselect"  ||
    type === "checkboxgroup"
){

        field.options = [
            "Option 1",
            "Option 2"
        ];

    }


    saveHistory();

    form.push(
        field
    );

    renderBuilder();

    renderPreview();

    saveToLocalStorage();

}


// ==========================================
// CLICK EVENTS
// ==========================================

textBtn.addEventListener(
    "click",
    () => addField("text")
);


emailBtn.addEventListener(
    "click",
    () => addField("email")
);


phoneBtn.addEventListener(
    "click",
    () => addField("phone")
);

timeBtn.addEventListener(
    "click",
    () => addField("time")
);

dateTimeBtn.addEventListener(
    "click",
    () => addField("datetime")

);

multiSelectBtn.addEventListener(
    "click",
    () => addField("multiselect")
);

addressBtn.addEventListener(
    "click",
    () => addField("address")
);

nameBtn.addEventListener(
    "click",
    () => addField("name")
);

scaleBtn.addEventListener(
    "click",
    () => addField("scale")
);

rangeBtn.addEventListener(
    "click",
    () => addField("range")
);

yesNoBtn.addEventListener(
    "click",
    () => addField("yesno")
);

imageChoiceBtn.addEventListener(
    "click",
    () => addField("imagechoice")
);

currencyBtn.addEventListener(
    "click",
    () => addField("currency")
);

passwordBtn.addEventListener(
    "click",
    () => addField("password")
);

signatureBtn.addEventListener(
    "click",
    () => addField("signature")
);

matrixBtn.addEventListener(
    "click",
    () => addField("matrix")
);

urlBtn.addEventListener(
    "click",
    () => addField("url")
);

checkboxGroupBtn.addEventListener(
    "click",
    () => addField("checkboxgroup")
);


textareaBtn.addEventListener(
    "click",
    () => addField("textarea")
);


radioBtn.addEventListener(
    "click",
    () => addField("radio")
);


fileBtn.addEventListener(
    "click",
    () => addField("file")
);


ratingBtn.addEventListener(
    "click",
    () => addField("rating")
);


sectionBtn.addEventListener(
    "click",
    () => addField("section")
);


numberBtn.addEventListener(
    "click",
    () => addField("number")
);


dateBtn.addEventListener(
    "click",
    () => addField("date")
);


checkboxBtn.addEventListener(
    "click",
    () => addField("checkbox")
);


dropdownBtn.addEventListener(
    "click",
    () => addField("dropdown")
);


// ==========================================
// ICONS
// ==========================================

function getFieldIcon(type) {

    return {

        text: "T",

        email: "@",

        phone: "☎",

        url: "🔗",

       time: "⏰",

       datetime: "◷",

       multiselect: "☷",

       address: "🏠",

       name: "👤",

       scale: "↔",

       range: "⇆",

       yesno: "✓",

       imagechoice: "🖼",

       currency: "₹",

       password: "🔒",

       signature: "✍",

       matrix: "▦",

       checkboxgroup: "☑",

        textarea: "¶",

        radio: "◉",

        file: "📎",

        rating: "★",

        section: "H",

        number: "123",

        date: "▣",

        checkbox: "✓",

        dropdown: "⌄"

    }[type] || "•";

}


// ==========================================
// RENDER BUILDER
// ==========================================

function renderBuilder() {

    canvas.innerHTML =
        "";


    if (
        form.length === 0
    ) {

        canvas.innerHTML = `

            <div class="canvas-empty">

                <div class="empty-orbit">
                    ＋
                </div>

                <h3>
                    Start building your form
                </h3>

                <p>
                    Drag fields from the left or
                    click a component to add it.
                </p>

            </div>

        `;


        return;

    }


    form.forEach(
        function (
            field,
            index
        ) {

            const div =
                document.createElement(
                    "article"
                );


            div.className =
                "field-box";


            if (
                field.type ===
                "section"
            ) {

                div.classList.add(
                    "section-field-box"
                );

            }


            div.dataset.icon =
                getFieldIcon(
                    field.type
                );


            if (
                selectedField ===
                field.id
            ) {

                div.classList.add(
                    "selected"
                );

            }


            const label =
                String(
                    field.label ||
                    "Untitled Field"
                );


            const shortLabel =
                label.length > 34

                    ? label.substring(
                        0,
                        34
                    ) + "…"

                    : label;


            const typeText =
                field.type === "section"

                    ? "Layout • Section Heading"

                    : "Type: " +
                      field.type;


            div.innerHTML = `

                <h3>
                    ${shortLabel}
                </h3>

                <p>
                    ${typeText}
                </p>

                <div class="field-actions">

                    <button
                        class="up-btn"
                        type="button"
                        title="Move up"
                    >
                        ↑
                    </button>

                    <button
                        class="down-btn"
                        type="button"
                        title="Move down"
                    >
                        ↓
                    </button>

                    <button
                        class="select-btn"
                        type="button"
                        title="Edit field"
                    >
                        ✎
                    </button>

                    <button
                        class="delete-btn"
                        type="button"
                        title="Delete field"
                    >
                        🗑
                    </button>

                </div>

            `;


            div.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {

                        return;

                    }


                    selectedField =
                        field.id;


                    showProperties();

                    renderBuilder();

                }
            );


            div.querySelector(
                ".select-btn"
            ).addEventListener(
                "click",
                function () {

                    selectedField =
                        field.id;


                    showProperties();

                    renderBuilder();

                    renderPreview();

                }
            );


            div.querySelector(
                ".delete-btn"
            ).addEventListener(
                "click",
                function () {

                    deleteIndex =
                        index;


                    deleteModal
                        .classList
                        .add(
                            "show"
                        );

                }
            );


            div.querySelector(
                ".up-btn"
            ).addEventListener(
                "click",
                function () {

                    if (
                        index <= 0
                    ) {

                        return;

                    }


                    saveHistory();


                    [
                        form[index - 1],
                        form[index]
                    ] = [

                        form[index],
                        form[index - 1]

                    ];


                    renderBuilder();

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            div.querySelector(
                ".down-btn"
            ).addEventListener(
                "click",
                function () {

                    if (
                        index >=
                        form.length - 1
                    ) {

                        return;

                    }


                    saveHistory();


                    [
                        form[index + 1],
                        form[index]
                    ] = [

                        form[index],
                        form[index + 1]

                    ];


                    renderBuilder();

                    renderPreview();

                    saveToLocalStorage();

                }
            );


            canvas.appendChild(
                div
            );

        }
    );

}