import express from 'express';
import multer from 'multer';
import fileUpload from 'express-fileupload'; // Import fileUpload middleware
import path from 'path';
import fs from 'fs';
import {
  createPackage,
  updatePackage,
  deletePackage,
  getSinglePackage,
  getAllPackages,
  getPackageBySearch,
  getFeaturedPackages,
  getPackageCount,
} from '../Controllers/packageControllers.js';

const router = express.Router();

// Middleware to serve uploaded files statically
router.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'packageImage' ? 'packages' : 'itinerary';
    const uploadPath = path.join(process.cwd(), 'uploads', folder);

    // Ensure the directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique file name
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File filter to allow only valid image types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Create new package with image uploads
router.post(
  '/',
  upload.fields([
    { name: 'packageImage', maxCount: 1 }, // Single file for package image
    { name: 'placeImages', maxCount: 10 }, // Multiple files for itinerary images
  ]),
  createPackage
);

// Update package with image uploads
router.put(
  '/:id',
  upload.fields([
    { name: 'packageImage', maxCount: 1 }, // Single file for package image
    { name: 'placeImages', maxCount: 10 }, // Multiple files for itinerary images
  ]),
  updatePackage
);

// Delete package
router.delete('/:id', deletePackage);

// Get single package
router.get('/:id', getSinglePackage);

// Get all packages with pagination
router.get('/', getAllPackages);

// Get package by search
router.get('/search/getPackageBySearch', getPackageBySearch);

// Get featured packages
router.get('/search/getFeaturedPackages', getFeaturedPackages);

// Get total package count
router.get('/search/getPackageCount', getPackageCount);

export default router;