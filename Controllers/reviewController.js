import Review from "../models/Review.js";

// ✅ Create a Review
export const createReview = async (req, res) => {
  const newReview = new Review({ ...req.body });

  try {
    const savedReview = await newReview.save();
    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      data: savedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

// ✅ Get All Reviews (Admin View)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // Fetch latest reviews first
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// ✅ Delete a Review (Admin Only)
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};
