const mongoose = require("mongoose");
const Form = require("../models/Form");
const Response = require("../models/Response");


// Submit response
const submitResponse = async (req, res) => {
    try {
        const { formId, answers } = req.body;

        if (!mongoose.Types.ObjectId.isValid(formId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Form ID"
            });
        }

        const existingForm = await Form.findById(formId);

        if (!existingForm) {
            return res.status(404).json({
                success: false,
                message: "Form Not Found"
            });
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: "Answers must be an array"
            });
        }

        const savedResponse = await Response.create({
                formId,
                owner: existingForm.owner,
                answers
            });

        return res.status(201).json({
            success: true,
            message: "Form Response Submitted Successfully",
            data: savedResponse
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get all responses
const getAllResponses = async (req, res) => {
    try {
        const responses = await Response.find({
                owner: req.user.userId
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: responses.length,
            data: responses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




// Delete response
const deleteResponse = async (req, res) => {

    try {

        const responseId =
            req.params.id;

        if (
            !mongoose.Types.ObjectId.isValid(
                responseId
            )
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Invalid Response ID"

                });

        }

        const deletedResponse =
    await Response.findOneAndDelete({
        _id: responseId,
        owner: req.user.userId
    });

        if (!deletedResponse) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "Response Not Found"

                });

        }

        return res
            .status(200)
            .json({

                success: true,

                message:
                    "Response Deleted Successfully"

            });

    }

    catch (error) {

        return res
            .status(500)
            .json({

                success: false,

                message:
                    error.message

            });

    }

};

module.exports = {
    submitResponse,
    getAllResponses,
    deleteResponse
};