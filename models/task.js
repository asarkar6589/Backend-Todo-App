import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Basically it will be the id of the user who has created it.
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Task = mongoose.model("Task", taskSchema);
