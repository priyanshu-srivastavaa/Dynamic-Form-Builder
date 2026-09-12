// ===============================
// GET FIELD VALUE
// ===============================

function getRuleFieldValue(
    fieldId
) {

    const inputs =
        document.querySelectorAll(
            `[name="${fieldId}"]`
        );


    if (!inputs.length) {

        return null;

    }


    const first =
        inputs[0];


    if (
        first.type ===
        "checkbox"
    ) {

        return first.checked;

    }


    if (
        first.type ===
        "radio"
    ) {

        const checked =
            Array.from(inputs)
                .find(
                    input =>
                        input.checked
                );


        return checked
            ? checked.value
            : "";

    }


    return first.value;

}


// ===============================
// CHECK CONDITION
// ===============================

function evaluateRuleCondition(
    currentValue,
    operator,
    expectedValue
) {

    const current =
        typeof currentValue === "string"
            ? currentValue.trim().toLowerCase()
            : currentValue;

    const expected =
        typeof expectedValue === "string"
            ? expectedValue.trim().toLowerCase()
            : expectedValue;


    switch (operator) {

        case "==":

            return (
                current ==
                expected
            );


        case "!=":

            return (
                current !=
                expected
            );


        case ">":

            return (
                Number(currentValue) >
                Number(expectedValue)
            );


        case "<":

            return (
                Number(currentValue) <
                Number(expectedValue)
            );


        case ">=":

            return (
                Number(currentValue) >=
                Number(expectedValue)
            );


        case "<=":

            return (
                Number(currentValue) <=
                Number(expectedValue)
            );


        default:

            return false;

    }

}


// ===============================
// CHECK RULE
// ===============================

function checkRule(field) {

    if (!field.rule) {

        return {

            visible: true,

            disabled: false

        };

    }


    const currentValue =
        getRuleFieldValue(
            field.rule.fieldId
        );


    // Preview may not have rendered
    // dependent field yet.

    if (currentValue === null) {

        return {

            visible: true,

            disabled: false

        };

    }


    const condition =
        evaluateRuleCondition(

            currentValue,

            field.rule.operator,

            field.rule.value

        );


    return {

        visible:

            field.rule.action ===
            "show"

                ? condition

                : field.rule.action ===
                  "hide"

                    ? !condition

                    : true,


        disabled:

            field.rule.action ===
            "disable"

                ? condition

                : false

    };

}


// ===============================
// LIVE RULE ENGINE
// ===============================

function applyRules() {

    form.forEach(
        function (field) {

            if (!field.rule) {

                return;

            }


            const value =
                getRuleFieldValue(
                    field.rule.fieldId
                );


            if (value === null) {

                return;

            }


            const result =
                evaluateRuleCondition(

                    value,

                    field.rule.operator,

                    field.rule.value

                );


            const wrapper =
                previewArea.querySelector(

                    `.preview-field[data-field-id="${field.id}"]`

                );


            if (!wrapper) {

                return;

            }


            // SHOW

            if (
                field.rule.action ===
                "show"
            ) {

                wrapper.style.display =
                    result
                        ? "block"
                        : "none";

            }


            // HIDE

            if (
                field.rule.action ===
                "hide"
            ) {

                wrapper.style.display =
                    result
                        ? "none"
                        : "block";

            }


            // DISABLE

            const currentInputs =
                wrapper.querySelectorAll(
                    "input, select, textarea"
                );


            if (
                field.rule.action ===
                "disable"
            ) {

                currentInputs.forEach(
                    function (input) {

                        input.disabled =
                            result;

                    }
                );

            }

        }
    );

}