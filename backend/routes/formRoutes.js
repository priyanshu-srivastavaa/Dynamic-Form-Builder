// ==========================================
// Form Routes
// ==========================================

const express = require("express");

const router = express.Router();

const {
    saveForm,
    getAllForms,
    getFormById,
    getPublishedFormById,
    updateForm,
    deleteForm
} = require("../controllers/formController");

const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );


// Save new form
router.post(
    "/",
    authMiddleware,
    saveForm
);


// Get all forms
router.get(
    "/",
    authMiddleware,
    getAllForms
);


// Get one form by ID
// PUBLIC - public-form.html ke liye
router.get(
    "/public/:id",
    getPublishedFormById
);
router.get(
    "/:id",
    authMiddleware,
    getFormById
);


// Update form by ID
router.put(
    "/:id",
    authMiddleware,
    updateForm
);


// Delete form by ID
router.delete(
    "/:id",
    authMiddleware,
    deleteForm
);


module.exports = router;