import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully ✅"))
    .catch((err) => console.error("MongoDB Connection Error ❌", err));


const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    profilePicture: {
        type: String,
        default: "default.png"
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

export default mongoose.model("User", userSchema);