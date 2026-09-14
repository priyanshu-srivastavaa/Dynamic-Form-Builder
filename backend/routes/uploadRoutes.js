// ==========================================
// FILE UPLOAD ROUTES
// ==========================================

const express =
    require("express");

const multer =
    require("multer");

const path =
    require("path");

const fs =
    require("fs");

const { v2: cloudinary } =
    require("cloudinary");

    cloudinary.config({

    cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME,

    api_key:
        process.env.CLOUDINARY_API_KEY,

    api_secret:
        process.env.CLOUDINARY_API_SECRET

});

const {
    uploadFile
} = require(
    "../controllers/uploadController"
);

const router =
    express.Router();


// ==========================================
// UPLOAD DIRECTORY
// Project ke BAHAR
//
// backend/routes
//      ↓ ..
// backend
//      ↓ ..
// Dynamic-Form-Builder-Premium
//      ↓ ..
// mare project
// ==========================================

const uploadDirectory =
    path.join(
        __dirname,
        "..",
        "..",
        "..",
        "dynamic-form-uploads"
    );


if (
    !fs.existsSync(
        uploadDirectory
    )
) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}


// ==========================================
// MULTER STORAGE
// ==========================================

const storage =
    multer.memoryStorage();


// ==========================================
// ALLOWED FILE EXTENSIONS
// ==========================================

const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".jpg",
    ".jpeg",
    ".png",
    ".txt"
];


const fileFilter =
    function (
        req,
        file,
        callback
    ) {

        const extension =
            path.extname(
                file.originalname
            )
            .toLowerCase();


        if (
            !allowedExtensions.includes(
                extension
            )
        ) {

            return callback(

                new Error(
                    "Only PDF, DOC, DOCX, JPG, JPEG, PNG and TXT files are allowed"
                )

            );

        }


        callback(
            null,
            true
        );

    };


// ==========================================
// MULTER CONFIGURATION
// MAXIMUM FILE SIZE = 10 MB
// ==========================================

const upload =
    multer({

        storage:
            storage,

        limits: {

            fileSize:
                10 *
                1024 *
                1024

        },

        fileFilter:
            fileFilter

    });


// ==========================================
// POST /api/uploads
// ==========================================

router.post(

    "/",

    function (
        req,
        res,
        next
    ) {

        upload.single(
            "file"
        )(
            req,
            res,
            function (error) {

                if (!error) {

                    return next();

                }


                if (
                    error instanceof
                    multer.MulterError
                ) {

                    if (
                        error.code ===
                        "LIMIT_FILE_SIZE"
                    ) {

                        return res
                            .status(400)
                            .json({

                                success: false,

                                message:
                                    "File size must not exceed 10 MB"

                            });

                    }

                }


                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            error.message ||
                            "File upload failed"

                    });

            }
        );

    },

    uploadFile

);


module.exports =
    router;