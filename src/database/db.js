
import mongoose from "mongoose";

const dbConnection = async()=>{
    await mongoose.connect("mongodb+srv://parveshqaiser:parvesh@cluster0.kv3ztw3.mongodb.net/Todo")
}

export default dbConnection;