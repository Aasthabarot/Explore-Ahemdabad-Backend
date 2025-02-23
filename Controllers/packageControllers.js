import Package from '../models/Package.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Helper function to save uploaded files
const saveFile = (file, folder) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const uploadPath = path.join(__dirname, '..', 'uploads', folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadPath, fileName);
  file.mv(filePath, (err) => {
    if (err) {
      throw new Error('File upload failed');
    }
  });
  return `/uploads/${folder}/${fileName}`;
};

// Create new package
export const createPackage = async (req, res) => {
  try {
    const { packageTitle, packageDescription, tourHighlights, tourDetails } = req.body;

    // Parse itinerary JSON string into an array
    const itinerary = JSON.parse(req.body.itinerary);

    // Handle package image upload
    let packageImagePath = '';
    if (req.files && req.files.packageImage) {
      packageImagePath = saveFile(req.files.packageImage, 'packages');
    }

    // Handle itinerary images upload
    const updatedItinerary = itinerary.map((place, index) => {
      if (req.files && req.files[`placeImage_${index}`]) {
        const placeImagePath = saveFile(req.files[`placeImage_${index}`], 'places');
        return { ...place, image: placeImagePath };
      }
      return place;
    });

    const newPackage = new Package({
      packageTitle,
      packageDescription,
      packageImage: packageImagePath,
      tourHighlights: JSON.parse(tourHighlights), // Parse JSON string into array
      tourDetails: JSON.parse(tourDetails), // Parse JSON string into object
      itinerary: updatedItinerary,
    });

    const savedPackage = await newPackage.save();
    res.status(200).json({ success: true, message: 'Successfully created', data: savedPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create. Try again!', error: error.message });
  }
};

// Update package
export const updatePackage = async (req, res) => {
  const id = req.params.id;

  try {
    const { packageTitle, packageDescription, tourHighlights, tourDetails } = req.body;

    // Parse itinerary JSON string into an array
    const itinerary = JSON.parse(req.body.itinerary);

    // Handle package image upload
    let packageImagePath = '';
    if (req.files && req.files.packageImage) {
      packageImagePath = saveFile(req.files.packageImage, 'packages');
    }

    // Handle itinerary images upload
    const updatedItinerary = itinerary.map((place, index) => {
      if (req.files && req.files[`placeImage_${index}`]) {
        const placeImagePath = saveFile(req.files[`placeImage_${index}`], 'places');
        return { ...place, image: placeImagePath };
      }
      return place;
    });

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      {
        packageTitle,
        packageDescription,
        packageImage: packageImagePath,
        tourHighlights: JSON.parse(tourHighlights), // Parse JSON string into array
        tourDetails: JSON.parse(tourDetails), // Parse JSON string into object
        itinerary: updatedItinerary,
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Successfully updated', data: updatedPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update', error: error.message });
  }
};

// Delete package
export const deletePackage = async (req, res) => {
  const id = req.params.id;

  try {
    await Package.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete', error: error.message });
  }
};

// Get single package
export const getSinglePackage = async (req, res) => {
  const id = req.params.id;

  try {
    const packageData = await Package.findById(id);
    res.status(200).json({ success: true, message: 'Successfully retrieved', data: packageData });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not Found', error: error.message });
  }
};

// Get all packages with pagination
export const getAllPackages = async (req, res) => {
  const page = parseInt(req.query.page) || 0;

  try {
    const packages = await Package.find({})
      .skip(page * 8)
      .limit(8);

    res.status(200).json({ success: true, count: packages.length, message: 'Successfully retrieved', data: packages });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not Found', error: error.message });
  }
};

// Get package by search
export const getPackageBySearch = async (req, res) => {
  const packageName = new RegExp(req.query.packageName, 'i');
  const minPrice = parseInt(req.query.minPrice) || 0;
  const maxPrice = parseInt(req.query.maxPrice) || 1000000;

  try {
    const packages = await Package.find({
      packageName,
      price: { $gte: minPrice, $lte: maxPrice },
    });

    res.status(200).json({ success: true, message: 'Successfully retrieved', data: packages });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not Found', error: error.message });
  }
};

// Get featured packages
export const getFeaturedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ featured: true }).limit(8);
    res.status(200).json({ success: true, message: 'Successfully retrieved', data: packages });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not Found', error: error.message });
  }
};

// Get package count
export const getPackageCount = async (req, res) => {
  try {
    const packageCount = await Package.estimatedDocumentCount();
    res.status(200).json({ success: true, data: packageCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch', error: error.message });
  }
};
