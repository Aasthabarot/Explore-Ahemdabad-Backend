import express from 'express';
import { deleteUser, getAllUser, getSingleUser, updateUser } from '../Controllers/userController.js';

const router = express.Router();

// Update user (No JWT verification)
router.put('/:id', updateUser);

// Delete user (No JWT verification)
router.delete('/:id', deleteUser);

// Get single user (No JWT verification)
router.get('/:id', getSingleUser);

// Get all users (No JWT verification)
router.get('/', getAllUser);

export default router;
