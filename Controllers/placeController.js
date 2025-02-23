import path from "path";
import fs from "fs";
import Place from "../models/Place.js";

// @desc Create a new place
// @route POST /api/v1/places
export const createPlace = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { name, description } = req.body;
    const image = req.files && req.files.image ? req.files.image : null;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required fields." });
    }

    let imageUrl = "";
    if (image) {
      const uploadDir = "uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}_${image.name}`;
      const uploadPath = path.join(uploadDir, fileName);
      await image.mv(uploadPath);
      imageUrl = `/uploads/${fileName}`;
    }

    const newPlace = new Place({ name, description, image: imageUrl });
    await newPlace.save();
    res.status(201).json({ message: "Place created successfully", place: newPlace });
  } catch (error) {
    console.error("Error creating place:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// @desc Get all places
// @route GET /api/v1/places
export const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get a single place by ID
// @route GET /api/v1/places/:id
export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Update a place
// @route PUT /api/v1/places/:id
export const updatePlace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.files && req.files.image ? req.files.image : null;
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    let imageUrl = place.image;
    if (image) {
      const uploadDir = "uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${Date.now()}_${image.name}`;
      const uploadPath = path.join(uploadDir, fileName);
      await image.mv(uploadPath);
      imageUrl = `/uploads/${fileName}`;
    }

    place.name = name;
    place.description = description;
    place.image = imageUrl;
    await place.save();
    res.status(200).json({ message: "Place updated successfully", place });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Delete a place
// @route DELETE /api/v1/places/:id
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    if (place.image) {
      const imagePath = path.join("uploads", path.basename(place.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Place.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
