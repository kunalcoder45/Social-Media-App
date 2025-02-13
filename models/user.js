import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/dataAssociationProj")
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