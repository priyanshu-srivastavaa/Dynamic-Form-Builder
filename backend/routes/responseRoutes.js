// ==========================================
// Response Routes
// ==========================================

const express = require("express");

const router = express.Router();

const {
    submitResponse,
    getAllResponses,
    deleteResponse
} = require("../controllers/responseController");

const authMiddleware =
    require("../middleware/authMiddleware");

router.get(
    "/",
    authMiddleware,
    getAllResponses
);

router.post(
    "/",
    submitResponse
);

router.delete(
    "/:id",
    authMiddleware,
    deleteResponse
);

module.exports = router;