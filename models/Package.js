import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    packageTitle: {
      type: String,
      required: true,
      unique: true,
    },
    packageDescription: {
      type: String,
      required: true,
    },
    packageImage: {
      type: String, // Path to the package image file
      required: true,
    },
    tourHighlights: {
      type: [String], // Array of highlights
      required: true,
    },
    tourDetails: {
      time: { type: String, required: true },
      date: { type: String, required: true },
      length: { type: String, required: true },
      duration: { type: String, required: true },
      pausePoints: { type: Number, required: true },
      reportingTime: { type: String, required: true },
      standardPackageIndian: { type: String, required: true },
      standardPackageForeign: { type: String, required: true },
    },
    itinerary: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place", // Make sure "Place" matches your model name
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
