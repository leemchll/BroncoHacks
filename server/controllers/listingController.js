import fs from 'fs';
import path from 'path';
import Listing from '../models/ListingModel.js';

const BASE_URL = 'http://localhost:5001';

function formatListing(l) {
    const imageUrl = l.image
        ? (l.image.startsWith('http') ? l.image : `${BASE_URL}/${l.image}`)
        : null;
    return {
        id: l._id.toString(),
        title: l.title,
        price: l.price,
        category: l.category,
        subcategory: l.subcategory,
        condition: l.condition,
        description: l.description,
        location: l.location,
        seller: l.seller,
        sellerAvatar: l.sellerAvatar,
        sellerId: l.sellerId,
        sellerUsername: l.sellerUsername,
        image: imageUrl,
        images: imageUrl ? [imageUrl] : [],
        imagePath: l.imagePath,
        timePosted: l.timePosted || l.createdAt,
    };
}

export const getListings = async (req, res) => {
    try {
        const listings = await Listing.find().sort({ timePosted: -1 });
        res.json(listings.map(formatListing));
    } catch (err) {
        console.error('getListings error:', err);
        res.status(500).json({ message: 'Server error fetching listings' });
    }
};

export const createListing = async (req, res) => {
    try {
        const {
            title, price, category, subcategory, condition,
            description, location, seller, sellerAvatar,
            sellerId, sellerUsername, imageUrl,
        } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        let imagePath = null;

        if (req.file) {
            const username = sellerUsername || 'unknown';
            const userDir = path.join('uploads', 'users', username);
            fs.mkdirSync(userDir, { recursive: true });
            const newFilePath = path.join(userDir, req.file.filename);
            fs.renameSync(req.file.path, newFilePath);
            imagePath = newFilePath.replace(/\\/g, '/');
        } else if (imageUrl) {
            imagePath = imageUrl;
        }

        const listing = new Listing({
            title,
            price: Number(price) || 0,
            category,
            subcategory,
            condition,
            description,
            location,
            seller,
            sellerAvatar,
            sellerId,
            sellerUsername,
            image: imagePath,
            imagePath: req.file ? imagePath : null,
            uploadedBy: sellerId,
            uploadedByUsername: sellerUsername,
            timePosted: new Date(),
        });

        await listing.save();
        res.status(201).json(formatListing(listing));
    } catch (err) {
        console.error('createListing error:', err);
        res.status(500).json({ message: 'Server error creating listing' });
    }
};

export const getUserListings = async (req, res) => {
    try {
        const { userId } = req.params;
        const listings = await Listing.find({ sellerId: userId }).sort({ timePosted: -1 });
        res.json(listings.map(formatListing));
    } catch (err) {
        console.error('getUserListings error:', err);
        res.status(500).json({ message: 'Server error fetching user listings' });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.sellerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this listing' });
        }

        // Remove uploaded image file if it exists on disk
        if (listing.imagePath && !listing.imagePath.startsWith('http')) {
            try { fs.unlinkSync(listing.imagePath); } catch (_) {}
        }

        await listing.deleteOne();
        res.json({ message: 'Listing deleted' });
    } catch (err) {
        console.error('deleteListing error:', err);
        res.status(500).json({ message: 'Server error deleting listing' });
    }
};
