import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    imageName: { type: String, required: true },
    imageUrl: { type: String, required: true }, // Path to the stored image
    imageType: { type: String, required: true }, // MIME type (e.g., image/png)
    createdAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
