import path from "path";
import fs from "fs";
import Gallery from "../models/gallery.js";

// Upload Image
export const uploadImage = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const image = req.files.image;
        const uploadDir = "uploads";

        // Ensure the "uploads" directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}_${image.name}`;
        const uploadPath = path.join(uploadDir, fileName);

        // Move file to uploads directory
        image.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ message: "Image upload failed", error: err });
            }

            // Save image details in database
            const newImage = new Gallery({
                imageName: image.name,
                imageUrl: `/uploads/${fileName}`,
                imageType: image.mimetype
            });

            await newImage.save();
            res.status(201).json({ message: "Image uploaded successfully", image: newImage });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get All Images
export const getImages = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Image
export const updateImage = async (req, res) => {
    try {
        const { id } = req.params;
        const imageExists = await Gallery.findById(id);

        if (!imageExists) {
            return res.status(404).json({ message: "Image not found" });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        // Delete old image from the server
        const oldImagePath = path.join("uploads", path.basename(imageExists.imageUrl));
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        const newImage = req.files.image;
        const fileName = `${Date.now()}_${newImage.name}`;
        const uploadPath = path.join("uploads", fileName);

        // Move new file to uploads directory
        newImage.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ message: "Image update failed", error: err });
            }

            imageExists.imageName = newImage.name;
            imageExists.imageUrl = `/uploads/${fileName}`;
            imageExists.imageType = newImage.mimetype;
            await imageExists.save();

            res.status(200).json({ message: "Image updated successfully", image: imageExists });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Image
export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Gallery.findById(id);

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        // Delete file from the server
        const imagePath = path.join("uploads", path.basename(image.imageUrl));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Remove from database
        await Gallery.findByIdAndDelete(id);
        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
