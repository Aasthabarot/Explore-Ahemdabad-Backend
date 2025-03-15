import Package from '../models/Package.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Helper function to save uploaded files
const saveFile = (file, folder) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const uploadPath = path.join(__dirname, '..', 'uploads', folder);

  // Ensure the directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Validate file type (only allow images)
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error('Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed.');
  }

  // Generate a unique file name
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadPath, fileName);

  // Move the file to the specified path
  file.mv(filePath, (err) => {
    if (err) {
      throw new Error('File upload failed');
    }
  });

  return `/uploads/${folder}/${fileName}`;
};

// Helper function to delete a file
const deleteFile = (filePath) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath); // Delete the file
  }
};

// Create new package
export const createPackage = async (req, res) => {
  try {
    const {
      packageTitle,
      packageDescription,
      tourHighlights,
      tourDetails,
      inclusions,
      itinerary,
    } = req.body;

    // Validate required fields
    if (!packageTitle || !packageDescription || !tourHighlights || !tourDetails || !inclusions || !itinerary) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    let packageImagePath = '';
    if (req.files && req.files.packageImage) {
      packageImagePath = saveFile(req.files.packageImage, 'packages');
    }

    const newPackage = new Package({
      packageTitle,
      packageDescription,
      packageImage: packageImagePath,
      tourHighlights,
      tourDetails,
      inclusions,
      itinerary,
    });

    const savedPackage = await newPackage.save();
    res.status(201).json({ success: true, message: 'Package created successfully', data: savedPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create package', error: error.message });
  }
};

// Update package
export const updatePackage = async (req, res) => {
  const id = req.params.id;
  try {
    const {
      packageTitle,
      packageDescription,
      tourHighlights,
      tourDetails,
      inclusions,
      itinerary,
    } = req.body;

    // Validate required fields
    if (!packageTitle || !packageDescription || !tourHighlights || !tourDetails || !inclusions || !itinerary) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    let packageImagePath = '';
    if (req.files && req.files.packageImage) {
      packageImagePath = saveFile(req.files.packageImage, 'packages');

      // Delete the old image if it exists
      const existingPackage = await Package.findById(id);
      if (existingPackage && existingPackage.packageImage) {
        deleteFile(existingPackage.packageImage);
      }
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      {
        packageTitle,
        packageDescription,
        packageImage: packageImagePath || undefined, // Keep existing image if no new one is uploaded
        tourHighlights,
        tourDetails,
        inclusions,
        itinerary,
      },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.status(200).json({ success: true, message: 'Package updated successfully', data: updatedPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update package', error: error.message });
  }
};

// Delete package
export const deletePackage = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    // Delete the associated image file
    if (deletedPackage.packageImage) {
      deleteFile(deletedPackage.packageImage);
    }

    res.status(200).json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete package', error: error.message });
  }
};

// Get single package
export const getSinglePackage = async (req, res) => {
  const id = req.params.id;
  try {
    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.status(200).json({ success: true, message: 'Package retrieved successfully', data: packageData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve package', error: error.message });
  }
};

// Get all packages with pagination
export const getAllPackages = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 8; // Allow customizable limit

  try {
    const packages = await Package.find({})
      .skip(page * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: packages.length,
      message: 'Packages retrieved successfully',
      data: packages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve packages', error: error.message });
  }
};

// Get package by search
export const getPackageBySearch = async (req, res) => {
  const packageName = new RegExp(req.query.packageName, 'i');
  const minPrice = parseInt(req.query.minPrice) || 0;
  const maxPrice = parseInt(req.query.maxPrice) || 1000000;

  try {
    const packages = await Package.find({
      packageTitle: packageName,
      'tourDetails.standardPackageIndian': { $gte: minPrice, $lte: maxPrice },
    });

    res.status(200).json({ success: true, message: 'Packages retrieved successfully', data: packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve packages', error: error.message });
  }
};

// Get featured packages
export const getFeaturedPackages = async (req, res) => {
  try {
    const packages = await Package.find({ featured: true }).limit(8);

    res.status(200).json({ success: true, message: 'Featured packages retrieved successfully', data: packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve featured packages', error: error.message });
  }
};

// Get package count
export const getPackageCount = async (req, res) => {
  try {
    const packageCount = await Package.estimatedDocumentCount();

    res.status(200).json({ success: true, data: packageCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch package count', error: error.message });
  }
};
