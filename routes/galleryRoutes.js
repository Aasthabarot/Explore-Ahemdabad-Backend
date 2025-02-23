import express from "express";
import { uploadImage, getImages, updateImage, deleteImage } from "../Controllers/galleryController.js";

const router = express.Router();

router.post("/upload", uploadImage); // Upload an image
router.get("/", getImages); // Get all images
router.put("/:id", updateImage); // Update image by ID
router.delete("/:id", deleteImage); // Delete image by ID

export default router;
