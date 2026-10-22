import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String, 
        required: true,
        trim: true
    },
    email: {
        type: String, 
        required: true,
        trim: true
    },
    picture: {
        type: String,
        default: ''
    },
    theme: {
        type: String,
        enum: ['dark', 'light', 'system'],
        default: 'dark'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;