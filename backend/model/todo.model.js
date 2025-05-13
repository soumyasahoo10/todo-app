import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
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
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;