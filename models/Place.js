import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    image: {
      type: String, // Store filename (for image upload)
      required: false,
    },
  },
  { timestamps: true }
);

// ✅ Correct way: Use `export default`
const Place = mongoose.model("Place", placeSchema);
export default Place;
