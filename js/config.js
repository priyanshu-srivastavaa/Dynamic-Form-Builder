/* ==========================================
   FORMIFY API CONFIGURATION
========================================== */

const FORMIFY_API_BASE_URL =
    (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
    )
        ? "http://localhost:5000"
        : "https://dynamic-form-builder-backend-1jjb.onrender.com";