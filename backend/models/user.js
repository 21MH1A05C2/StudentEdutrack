import mongoose from "mongoose";
// Define User Schema
const Schema = mongoose.Schema
const user = new Schema({
    name: {
        type: String,
        required: true
    },
    rollno: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilepic: {
        type: Buffer, // Storing file as Buffer for MongoDB GridFS
        required: true
    }
});

export default mongoose.model("user",user)