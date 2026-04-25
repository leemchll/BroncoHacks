import mongoose, {Schema} from "mongoose";

const listingSchema = new mongoose.Schema({

    name :{
        type: String,
        required: true,
        trim: true,
    },

    description :{
        type: String,
        required: false,
        trim: true,
    },

    // foreign key(s)
    User :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    Category :{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    SubCategory :{
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: false
    }



}, {timestamps: true});

export default mongoose.model("Listing", listingSchema);