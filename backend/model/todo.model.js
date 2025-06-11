import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    todo:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    }
}, {timestamps: true});

const Todo = mongoose.model('note', noteSchema);

export default Todo;