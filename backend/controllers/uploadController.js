// ==========================================
// FILE UPLOAD CONTROLLER
// ==========================================

const { v2: cloudinary } =
    require("cloudinary");

    function uploadToCloudinary(fileBuffer) {

    return new Promise(
        function (resolve, reject) {

            const stream =
                cloudinary.uploader.upload_stream(
                    {
                        folder:
                            "formify-uploads",
                        resource_type:
                            "auto"
                    },
                    function (error, result) {

                        if (error) {
                            return reject(error);
                        }

                        resolve(result);

                    }
                );

            stream.end(fileBuffer);

        }
    );

}

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


           const uploadResult =
            await uploadToCloudinary(
                req.file.buffer
            );


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
                         uploadResult.public_id,

                        mimeType:
                            req.file.mimetype,

                        size:
                            req.file.size,

                       url:
                         uploadResult.secure_url

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