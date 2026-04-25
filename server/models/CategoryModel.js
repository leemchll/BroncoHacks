import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    categoryName :{
        type: String,
        required: true,
        trim: true
    }

})

export default mongoose.model("Category", categorySchema);