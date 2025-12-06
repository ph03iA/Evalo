import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },

        profilePicture: {
            type: String,
            default: ""
        },
        clerkId: {
            type:String,
            required:true,
            unique:true
        }
    },
    { timestamps: true } //createdAt, updatedAt
);
const User = mongoose.model("User", UserSchema)
export default User;