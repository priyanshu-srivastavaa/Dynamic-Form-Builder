// ==========================================
// Response Model
// ==========================================

const mongoose = require("mongoose");


// ==========================================
// Answer Schema
// ==========================================

const answerSchema = new mongoose.Schema(
    {
        fieldId: {
            type: Number,
            required: true
        },

        label: {
            type: String,
            default: ""
        },

        value: {
            type: mongoose.Schema.Types.Mixed,
            default: ""
        }
    },
    {
        _id: false
    }
);


// ==========================================
// Main Response Schema
// ==========================================

const responseSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },

        owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: false
            },

        answers: {
            type: [answerSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);


// ==========================================
// Export Model
// ==========================================

const Response = mongoose.model(
    "Response",
    responseSchema
);

module.exports = Response;