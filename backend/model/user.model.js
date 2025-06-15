import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    picture: {
        type: String, 
    },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

export default User;