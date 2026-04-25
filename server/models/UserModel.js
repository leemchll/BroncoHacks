import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
        required: true,
        trim: true
    },

    // email: {
    //   type: String,
    //   required: true,
    // },

    password :{
        type:String,
        required: true,
        trim: true
    },

    name :{
        type: String,
        required: true,
        trim: true
    }
})

export default mongoose.model("User", userSchema);