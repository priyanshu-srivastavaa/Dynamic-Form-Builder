// ==========================================
// Dynamic Form Builder Backend Server
// ==========================================

const express =
    require("express");

const cors =
    require("cors");

const dotenv =
    require("dotenv");

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


const PORT =
    process.env.PORT ||
    5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors()
);


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
    "D:/mare project/dynamic-form-uploads";


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