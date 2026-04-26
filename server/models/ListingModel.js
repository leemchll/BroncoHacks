import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    price: { type: Number, default: 0 },
    category: { type: String, trim: true },
    subcategory: { type: String, trim: true },
    condition: { type: String, trim: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    seller: { type: String, trim: true },
    sellerAvatar: { type: String, trim: true },
    sellerId: { type: String },
    sellerUsername: { type: String, trim: true },
    image: { type: String },
    imagePath: { type: String },
    uploadedBy: { type: String },
    uploadedByUsername: { type: String },
    timePosted: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Listing', listingSchema);
