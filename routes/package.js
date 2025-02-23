import express from 'express';
import multer from 'multer';
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'packageImage' ? 'packages' : 'places';
    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create new package with image uploads
router.post('/', upload.fields([
  { name: 'packageImage', maxCount: 1 },
  { name: 'placeImages', maxCount: 10 },
]), createPackage);

// Update package with image uploads
router.put('/:id', upload.fields([
  { name: 'packageImage', maxCount: 1 },
  { name: 'placeImages', maxCount: 10 },
]), updatePackage);

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
