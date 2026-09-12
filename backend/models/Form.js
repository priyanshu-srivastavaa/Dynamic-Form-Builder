const mongoose =
    require("mongoose");


const fieldSchema =
    new mongoose.Schema(
        {

            id: {

                type: Number,

                required: true

            },

            includeMiddleName: {
                type: Boolean,
                default: false
            },


            type: {

                type: String,

                required: true,

                enum: [

                    "text",

                    "email",

                    "phone",

                    "url",

                    "time",

                    "datetime",

                    "multiselect",

                    "checkboxgroup",

                    "address",

                    "name",

                    "scale",

                    "range",

                      "yesno",

                      "imagechoice",

                    "currency",

                    "password",

                    "signature",

                     "matrix",

                    "textarea",

                    "radio",

                    "file",

                    "rating",

                    "section",

                    "number",

                    "date",

                    "checkbox",

                    "dropdown"

                ]

            },


            label: {

                type: String,

                default: ""

            },


            placeholder: {

                type: String,

                default: ""

            },


            required: {

                type: Boolean,

                default: false

            },


            minLength: {

                type: Number,

                default: 0

            },


            maxLength: {

                type: Number,

                default: 100

            },


            minValue: {

                type: Number,

                default: 0

            },


            maxValue: {

                type: Number,

                default: 100

            },


          options: {
    type: [
        mongoose.Schema.Types.Mixed
    ],
    default: undefined
},


rows: { 

    type: [String], 

    default: undefined 

}, 


columns: { 

    type: [String], 

    default: undefined 

}, 


rule: {  

    type:  
        mongoose.Schema.Types.Mixed,  

    default: null  

}

        },

        {

            _id: false

        }
    );


const formSchema =
    new mongoose.Schema(
        {

            title: {

                type: String,

                required: true,

                trim: true,

                default:
                    "Untitled Form"

            },

            owner: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },


            description: {

                type: String,

                trim: true,

                default: ""

            },


            fields: {

                type: [
                    fieldSchema
                ],

                default: []

            },


            status: {

                type: String,

                enum: [
                    "draft",
                    "published"
                ],

                default:
                    "draft"

            }

        },

        {

            timestamps: true

        }
    );


const Form =
    mongoose.model(
        "Form",
        formSchema
    );


module.exports =
    Form;