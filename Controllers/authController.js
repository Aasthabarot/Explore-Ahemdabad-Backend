import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000/api";

// User register
export const register = async (req, res) => {
   try {
      // Destructure the data from the request body
      const { name, email, password, contact } = req.body;

      // Validate required fields
      if (!name || !email || !password || !contact) {
         return res.status(400).json({
            success: false,
            message: "All fields (name, email, password, contact) are required."
         });
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: "User with this email already exists."
         });
      }

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new user object
      const newUser = new User({
         name,
         email,
         password: hashedPassword,
         contact,
      });

      // Save the new user to the database
      await newUser.save();

      // Respond with success
      res.status(201).json({
         success: true,
         message: "User successfully created!",
         baseUrl: `${BASE_URL}/register`,
         user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
         }
      });
   } catch (error) {
      console.error("Error during registration:", error.message); // Log the error for debugging
      res.status(500).json({
         success: false,
         message: "Failed to register user. Please try again later.",
      });
   }
};



// User login
export const login = async (req, res) => {
   res.send(req.body)

   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email and password are required."
         });
      }

      console.log("Looking for user with email:", email);
      // Fetch user by email
      const user = await User.findOne({ email });

      // Log the user object to check if the query fetched the user
      console.log("User found in DB:", user); // Check if user is fetched properly

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found!"
         });
      }

      console.log("User found:", user);
      const checkCorrectPassword = await bcrypt.compare(password, user.password);

      console.log("Password comparison result:", checkCorrectPassword);

      if (!checkCorrectPassword) {
         return res.status(401).json({
            success: false,
            message: "Incorrect email or password!"
         });
      }

      const { password: userPassword, role, ...rest } = user._doc;

      const token = jwt.sign(
         { id: user._id, role: user.role },
         process.env.JWT_SECRET_KEY,
         { expiresIn: "15d" }
      );
      console.log("JWT Secret Key:", process.env.JWT_SECRET_KEY);


      res.cookie("accessToken", token, {
         httpOnly: true,
         expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      }).status(200).json({
         success: true,
         token,
         data: { ...rest },
         role
      });
   } catch (error) {
      console.error("Error during login:", error); // This will print the actual error to the console
      res.status(500).json({
         success: false,
         message: "Failed to login. Please try again later.",
         error: error.message // Add error message for debugging
      });
   }
};





