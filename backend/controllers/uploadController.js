// ==========================================
// FILE UPLOAD CONTROLLER
// ==========================================

const uploadFile =
    async function (req, res) {

        try {

            if (!req.file) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Please select a file"

                    });

            }


            const fileUrl =
                `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;


            return res
                .status(201)
                .json({

                    success: true,

                    message:
                        "File Uploaded Successfully",

                    data: {

                        originalName:
                            req.file.originalname,

                        storedName:
                            req.file.filename,

                        mimeType:
                            req.file.mimetype,

                        size:
                            req.file.size,

                        url:
                            fileUrl

                    }

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

    uploadFile

};