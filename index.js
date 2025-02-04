// import express from "express";
// import dotenv from 'dotenv'
// import mongoose from 'mongoose'
// import cors from 'cors'
// import cookieParser from "cookie-parser";
// import tourRoute from './routes/tours.js'
// import userRoute from './routes/users.js'
// import authRoute from './routes/auth.js'
// import reviewRoute from './routes/reviews.js'
// import bookingRoute from './routes/bookings.js'

// // dotenv.config()
// // const app = express()
// // const port = process.env.PORT || 8001
// // const corsOptions = {
// //    origin: "*", // Allows all origins
// //    credentials: true // Enable credentials
// // };

// // dotenv.config()
// // const app = express()
// // const port = process.env.PORT || 8000
// // const corsOptions = {
// //    origin: "http://localhost:3000/",
// //    credentials: true
// // }

// dotenv.config()
// const app = express()
// const port = process.env.PORT || 8000
// const corsOptions = {
//    origin: ["http://localhost:3000", "https://your-deployed-frontend.com"], // ✅ Explicitly allow frontend origins
//    credentials: true, // ✅ Allow cookies/authentication
//    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//    allowedHeaders: "Content-Type,Authorization"
// };



// mongoose.set("strictQuery", false)
// const connect = async () => {
//    try {
//       await mongoose.connect("mongodb+srv://barotaastha38:Aastha_1203@exploreahemdabad.a17qc.mongodb.net/?retryWrites=true&w=majority&appName=ExploreAhemdabad", {
//          useNewUrlParser: true,
//          useUnifiedTopology: true
//       })

//       console.log('MongoDB connected')
//    } catch (error) {
//       console.log('MongoDB connected failed')
//    }
// }

// app.use(express.json()); // Must be placed before routes
// app.use(cors(corsOptions));
// app.use(cookieParser());

// // Routes
// app.use("/api/v1/auth", authRoute);
// app.use("/api/v1/tours", tourRoute);
// app.use("/api/v1/users", userRoute);
// app.use("/api/v1/review", reviewRoute);
// app.use("/api/v1/booking", bookingRoute);

// app.listen(port, () => {
//    connect()
//    console.log('server listening on port', port)
// })


import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import tourRoute from "./routes/tours.js";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import reviewRoute from "./routes/reviews.js";
import bookingRoute from "./routes/bookings.js";

dotenv.config(); // ✅ Ensure environment variables load first

const app = express();
const port = process.env.PORT || 8000;

// ✅ Fixed CORS Configuration
const corsOptions = {
   origin: ["http://localhost:3000", "http://localhost:3001", "https://explore-ahemdabad-8qak.vercel.app"], // No trailing slash
   // origin: '*',
   credentials: true,
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   allowedHeaders: "Content-Type,Authorization",
   optionsSuccessStatus: 200
};

// ✅ MongoDB Connection Using `.env`
const connect = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ MongoDB connected");
   } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
   }
};

// ✅ Apply Middleware in Correct Order
app.use(cors(corsOptions)); // CORS should be first
app.use(express.json());  
app.use(cookieParser());

// ✅ API Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Start Server
app.listen(port, () => {
   connect();
   console.log(`🚀 Server running on port ${port}`);
});
