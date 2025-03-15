import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 🔹 Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// 🟢 **1️⃣ Create Order API**
router.post("/create-order", async (req, res) => {
  const { amount } = req.body; // Amount in paise (₹1 = 100 paise)

  try {
    const options = {
      amount, // Amount in paise
      currency: "INR",
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// 🔵 **2️⃣ Verify Payment API**
router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: "Payment verified", payment_id: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
});

// 🔴 **3️⃣ Fetch All Payments API**
router.get("/all-payments", async (req, res) => {
  try {
    const payments = await razorpay.payments.all({ count: 10 }); // Fetch last 10 payments
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
});

export default router;