import express from 'express';
import { getListings, createListing, getUserListings, deleteListing } from '../controllers/listingController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getListings);
router.get('/user/:userId', getUserListings);
router.post('/', upload.single('image'), createListing);
router.delete('/:id', deleteListing);

export default router;
