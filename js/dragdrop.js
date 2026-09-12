const dragSources = [

    [textBtn, "text"],

    [emailBtn, "email"],

    [phoneBtn, "phone"],

    [urlBtn, "url"],

    [timeBtn, "time"],

    [dateTimeBtn, "datetime"],

    [multiSelectBtn, "multiselect"],

    [addressBtn, "address"],

    [nameBtn, "name"],

    [scaleBtn, "scale"],

    [currencyBtn, "currency"],

    [passwordBtn, "password"],

    [signatureBtn, "signature"],

    [matrixBtn, "matrix"],

    [checkboxGroupBtn, "checkboxgroup"],

    [rangeBtn, "range"],

    [yesNoBtn, "yesno"],

    [imageChoiceBtn, "imagechoice"],

    [textareaBtn, "textarea"],

    [radioBtn, "radio"],

    [fileBtn, "file"],

    [ratingBtn, "rating"],

    [sectionBtn, "section"],

    [numberBtn, "number"],

    [dateBtn, "date"],

    [checkboxBtn, "checkbox"],

    [dropdownBtn, "dropdown"]

];


dragSources.forEach(
    function (
        [button, type]
    ) {

        button.addEventListener(
            "dragstart",
            function (event) {

                draggedType =
                    type;


                event.dataTransfer
                    .effectAllowed =
                    "copy";


                event.dataTransfer
                    .setData(
                        "text/plain",
                        type
                    );


                canvas.classList.add(
                    "drag-active"
                );

            }
        );


        button.addEventListener(
            "dragend",
            function () {

                canvas.classList.remove(
                    "drag-active"
                );

            }
        );

    }
);


canvas.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();


        event.dataTransfer.dropEffect =
            "copy";


        canvas.classList.add(
            "drag-active"
        );

    }
);


canvas.addEventListener(
    "dragleave",
    function (event) {

        if (
            !canvas.contains(
                event.relatedTarget
            )
        ) {

            canvas.classList.remove(
                "drag-active"
            );

        }

    }
);


canvas.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();


        canvas.classList.remove(
            "drag-active"
        );


        const type =

            event.dataTransfer
                .getData(
                    "text/plain"
                )

            || draggedType;


        if (!type) {

            return;

        }


        addField(
            type
        );


        draggedType =
            "";

    }
);