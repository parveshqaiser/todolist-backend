
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // userId : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : "users"
    // }, no use
    username : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        index : true,
        unique : true,
    },
    fullName : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String,
    },
    lastLogin : {
        type : String
    }
}, {timestamps: true});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;