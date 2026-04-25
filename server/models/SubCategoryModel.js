import mongoose, {Schema} from 'mongoose'

const subCategorySchema = new mongoose.Schema({
    subCategoryName :{
        type: String,
        required: true,
        trim: true
    },

    // foreign key(s)
    Category :{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }

})

export default mongoose.model("SubCategory", subCategorySchema);