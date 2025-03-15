import express from "express";
import { createReview, getAllReviews, deleteReview } from "../Controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview); // Submit review (Anyone can submit)
router.get("/", getAllReviews); // View all reviews (Anyone can view)
router.delete("/:id", deleteReview); // Delete review (Anyone can delete)

export default router;
