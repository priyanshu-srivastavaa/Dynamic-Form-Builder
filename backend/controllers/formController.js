// ==========================================
// Form Controller
// ==========================================

const mongoose = require("mongoose");
const Form = require("../models/Form");


// ==========================================
// Save New Form
// POST /api/forms
// ==========================================

const saveForm = async (req, res) => {

    try {

        const {
            title,
            description,
            fields
        } = req.body;

       const newForm = new Form({
                title,
                description,
                fields,
                owner: req.user.userId
            });

        const savedForm = await newForm.save();

        res.status(201).json({
            success: true,
            message: "Form Saved Successfully",
            data: savedForm
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// Get All Forms
// GET /api/forms
// ==========================================

const getAllForms = async (req, res) => {

    try {

       const forms = await Form.find({
            owner: req.user.userId
        })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: forms.length,
            data: forms
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// Get Form By ID
// GET /api/forms/:id
// ==========================================

const getFormById = async (req, res) => {

    try {

        const formId = req.params.id;

        // Invalid MongoDB ID check
        if (!mongoose.Types.ObjectId.isValid(formId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Form ID"
            });

        }

      const form = await Form.findOne({
            _id: formId,
            owner: req.user.userId
        });

        if (!form) {

            return res.status(404).json({
                success: false,
                message: "Form Not Found"
            });

        }

        res.status(200).json({
            success: true,
            data: form
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

async function getPublishedFormById(
    req,
    res
) {

    try {

        const formId =
            req.params.id;


        if (
            !mongoose.Types.ObjectId.isValid(
                formId
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid Form ID"
            });

        }


        const form =
            await Form.findOne({
                _id: formId,
                status: "published"
            });

        if (!form) {

            return res.status(404).json({
                success: false,
                message:
                    "Published form not found"
            });

        }

        return res.status(200).json({
            success: true,
            data: form
        });

    }

    catch (error) {

        console.error(
            "Public form load error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load public form"
        });

    }

}

// ==========================================
// Update Form By ID
// PUT /api/forms/:id
// ==========================================

const updateForm = async (req, res) => {

    try {

        const formId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(formId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Form ID"
            });

        }

       const updatedForm = await Form.findOneAndUpdate(
                {
                    _id: formId,
                    owner: req.user.userId
                },
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedForm) {

            return res.status(404).json({
                success: false,
                message: "Form Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Form Updated Successfully",
            data: updatedForm
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ==========================================
// Delete Form
// DELETE /api/forms/:id
// ==========================================

const deleteForm = async (req, res) => {
    try {

       const form = await Form.findOneAndDelete({
                _id: req.params.id,
                owner: req.user.userId
            });

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Form Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==========================================
// Export Controller Functions
// ==========================================

module.exports = {
    saveForm,
    getAllForms,
    getFormById,
    getPublishedFormById,
    updateForm,
    deleteForm
};