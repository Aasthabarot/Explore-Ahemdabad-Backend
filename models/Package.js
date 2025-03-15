import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    packageTitle: {
      type: String,
      required: true,
    },
    packageDescription: {
      type: String,
      required: true,
    },
    packageImage: {
      type: String, // Path to the uploaded package image file
    },
    tourHighlights: {
      type: [String], // Array of highlights
      required: true,
    },
    tourDetails: {
      time: { type: String, required: true }, // e.g., "7:30 AM - 7:45 AM"
      date: { type: String, required: true }, // e.g., "Everyday"
      length: { type: String}, // e.g., "3 km"
      duration: { type: String }, // e.g., "3 Hrs."
      pausePoints: { type: Number }, // e.g., 20
      reportingTime: { type: String, required: true }, // e.g., "8:00 AM to 8:15 AM"
      standardPackageIndian: { type: String, required: true }, // e.g., "₹180"
    },
    inclusions: {
      type: [String], // Array of inclusions
      required: true,
    },
    itinerary: [
      {
        name: { type: String, required: true }, // Place name
        image: { type: String, required: true }, // Path to the uploaded place image
        time: { type: String, required: true }, // e.g., "9:00 AM - 10:00 AM"
        duration: { type: String }, // e.g., "1 Hr."
        description: { type: String, required: true }, // Description of the place
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);

