// ==========================================
// Dynamic Form Builder Backend Server
// ==========================================

const express =
    require("express");

const cors =
    require("cors");

const dotenv =
    require("dotenv");

const path =
    require("path");

const connectDB =
    require("./config/db");

const formRoutes =
    require("./routes/formRoutes");

const responseRoutes =
    require("./routes/responseRoutes");

const uploadRoutes =
    require("./routes/uploadRoutes");

 const { State, City} =
    require("country-state-city");

const authRoutes = require("./routes/authRoutes");

// ==========================================
// ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();


const app =
    express();

app.set("trust proxy", 1);


const PORT =
    process.env.PORT ||
    5000;


// ==========================================
// MIDDLEWARE
// ==========================================

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:5501",
    "http://localhost:5501",
    "https://dynamic-form-builder-tan-seven.vercel.app"
];

app.use((req, res, next) => {

    const origin = req.headers.origin;

    if (
        !origin ||
        allowedOrigins.includes(origin)
    ) {
        if (origin) {
            res.setHeader(
                "Access-Control-Allow-Origin",
                origin
            );
        }

        res.setHeader(
            "Vary",
            "Origin"
        );

        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        );

        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );
    }

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


app.use(
    express.json()
);


// ==========================================
// UPLOAD DIRECTORY
// Project root ke BAHAR
//
// backend
//   ↓ ..
// Dynamic-Form-Builder-Premium
//   ↓ ..
// mare project
// ==========================================

const uploadDirectory =
    path.join(
        __dirname,
        "..",
        "..",
        "dynamic-form-uploads"
    );


// ==========================================
// SERVE UPLOADED FILES
// ==========================================

app.use(

    "/uploads",

    express.static(
        uploadDirectory
    )

);


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/forms",
    formRoutes
);


app.use(
    "/api/responses",
    responseRoutes
);


app.use(
    "/api/uploads",
    uploadRoutes
);

app.use("/api/auth", authRoutes);

// ==========================================
// LOCATION ROUTES
// ==========================================

app.get(
    "/api/locations/states",
    function (
        req,
        res
    ) {

        const states =
            State.getStatesOfCountry(
                "IN"
            );

        res
            .status(200)
            .json({

                success: true,

                data: states

            });

    }
);


app.get(
    "/api/locations/cities/:stateCode",
    function (
        req,
        res
    ) {

        const stateCode =
            req.params.stateCode;

        const cities =
            City.getCitiesOfState(
                "IN",
                stateCode
            );

        res
            .status(200)
            .json({

                success: true,

                data: cities

            });

    }
);


// ==========================================
// TEST ROUTE
// ==========================================

app.get(
    "/",
    function (
        req,
        res
    ) {

        res
            .status(200)
            .json({

                success: true,

                message:
                    "Dynamic Form Builder Backend is Running"

            });

    }
);


// ==========================================
// START SERVER
// ==========================================

async function startServer() {

    try {

        await connectDB();


        app.listen(
            PORT,
            function () {

                console.log(
                    `🚀 Server is running on http://localhost:${PORT}`
                );

                console.log(
                    "📁 Upload folder:",
                    uploadDirectory
                );

            }
        );

    }

    catch (error) {

        console.error(
            "❌ Server could not start because database connection failed"
        );


        process.exit(1);

    }

}


startServer();