import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { _id: false });

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled Note',
        trim: true
    },
    todo: {
        type: String,
        default: ''
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: 'default'
    },
    checklist: {
        type: [checklistItemSchema],
        default: []
    }
}, { timestamps: true });

noteSchema.index({ userId: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, isPinned: -1 });

const Todo = mongoose.models.note || mongoose.model('note', noteSchema);

export default Todo;