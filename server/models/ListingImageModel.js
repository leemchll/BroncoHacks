import mongoose from "mongoose"

const listingImageSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        // implement later
        // match: [],
        required: true,
        trim: true
    },

    // foreign key(s)
    Listing :{
        type: Schema.types.ObjectId,
        ref: 'Category',
        required: true
    },
})

export default mongoose.model('ListingImage', listingImageSchema)