import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload"; // Added for gallery
import packageRoute from "./routes/package.js"; // Updated to Packages
import userRoute from "./routes/users.js";
import reviewRoute from "./routes/reviews.js";
import bookingRoute from "./routes/bookings.js";
import placeRoute from "./routes/Place.js"; // Import Place Routes
import galleryRoute from "./routes/galleryRoutes.js"; // Import Gallery Routes

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://explore-ahemdabad-8qak.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
};

// MongoDB Connection
const connect = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

mongoose.set("strictQuery", false);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload()); // Added for gallery image uploads
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Routes
app.use("/api/v1/packages", packageRoute); // Updated Route
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/places", placeRoute); // Place API remains
app.use("/api/v1/gallery", galleryRoute); // Added gallery route

// Start Server
const startServer = async () => {
    try {
        await connect();
        app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
