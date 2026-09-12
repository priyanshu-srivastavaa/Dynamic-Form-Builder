// ==========================================
// MongoDB Connection
// ==========================================

const mongoose = require("mongoose");

async function connectDB() {

    try {

        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {

            throw new Error(
                "MONGODB_URI is missing in the .env file"
            );

        }

        await mongoose.connect(mongoUri);

        console.log("✅ MongoDB Connected Successfully");

    }
    catch (error) {

        console.error("❌ MongoDB Connection Failed");

        console.error(error.message);

        throw error;

    }

}

module.exports = connectDB;