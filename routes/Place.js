import express from "express";
import {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
} from "../Controllers/placeController.js";

const router = express.Router();

// Routes
router.post("/", createPlace); // Create a place (No JWT required)
router.get("/", getAllPlaces); // Get all places
router.get("/:id", getPlaceById); // Get a single place by ID
router.put("/:id", updatePlace); // Update a place (No JWT required)
router.delete("/:id", deletePlace); // Delete a place (No JWT required)

export default router;
