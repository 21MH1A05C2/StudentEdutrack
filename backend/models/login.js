import mongoose from "mongoose";
// Define User Schema
const Schema = mongoose.Schema
const login = new Schema({
    rollno: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model("login",login)