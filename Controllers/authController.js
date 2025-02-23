import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000/api";

// User register
// export const register = async (req, res) => {
//    try {
//       // Destructure the data from the request body
//       const { name, email, password, contact } = req.body;

//       // Validate required fields
//       if (!name || !email || !password || !contact) {
//          return res.status(400).json({
//             success: false,
//             message: "All fields (name, email, password, contact) are required."
//          });
//       }

//       // Check if the user already exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//          return res.status(400).json({
//             success: false,
//             message: "User with this email already exists."
//          });
//       }

//       // Hash the password
//       const salt = bcrypt.genSaltSync(10);
//       const hashedPassword = bcrypt.hashSync(password, salt);

//       // Create a new user object
//       const newUser = new User({
//          name,
//          email,
//          password: hashedPassword,
//          contact,
//       });

//       // Save the new user to the database
//       await newUser.save();

//       // Respond with success
//       res.status(201).json({
//          success: true,
//          message: "User successfully created!",
//          baseUrl: `${BASE_URL}/register`,
//          user: {
//             id: newUser._id,
//             name: newUser.name,
//             email: newUser.email,
//             contact: newUser.contact,
//          }
//       });
//    } catch (error) {
//       console.error("Error during registration:", error.message); // Log the error for debugging
//       res.status(500).json({
//          success: false,
//          message: "Failed to register user. Please try again later.",
//       });
//    }
// };



export const register = async (req, res) => {
   try {
      console.log("Received datasss:", req.body); // Debugging step

      const { name, email, password, contact, username } = req.body;

      // if (!name || !email || !password || !contact) {
      //    return res.status(400).json({
      //       success: false,
      //       message: "All fields (name, email, password, contact) are required.",
      //    });
      // }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({
            success: false,
            message: "User with this email already exists.",
         });
      }

      // Generate a username if not provided
      const finalUsername = username || email.split("@")[0];

      // Check if username already exists
      // const existingUsername = await User.findOne({ username: finalUsername });
      // if (existingUsername) {
      //    return res.status(400).json({
      //       success: false,
      //       message: "Username already taken. Please choose another one.",
      //    });
      // }

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create new user
      const newUser = new User({
         name,
         email,
         username: finalUsername,
         password: hashedPassword,
         contact,
      });

      // Save user to the database
      await newUser.save();
      console.log("newUser: ", newUser);
      res.status(201).json({
         success: true,
         message: "User successfully created!",
         user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
         },
      });
   } catch (error) {
      console.error("Error during registration:", error.message);
      res.status(500).json({
         success: false,
         message: "Failed to register user. Please try again later.",
         error: error.message, // Send error for debugging
      });
   }
};


// User login
export const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email and password are required."
         });
      }

      console.log("Looking for user with email:", email);
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found!"
         });
      }

      console.log("User found in DB:", user);

      // Verify password
      const checkCorrectPassword = await bcrypt.compare(password, user.password);
      if (!checkCorrectPassword) {
         return res.status(401).json({
            success: false,
            message: "Incorrect email or password!"
         });
      }

      // Destructure user object to exclude password
      const { password: userPassword, role, ...rest } = user._doc;

      // Send response without token
      res.status(200).json({
         success: true,
         user: { ...rest },
         role
      });

   } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
         success: false,
         message: "Failed to login. Please try again later.",
         error: error.message
      });
   }
};




