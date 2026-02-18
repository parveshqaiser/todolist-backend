
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    status: {
        type: String,
        required: true,
        default: "Pending",
        enum: {
            values: ["Pending", "In-Progress", "Completed"],
            message: `{VALUE} is not a valid status`
        }
    },
    priority : {
        type : String,
        required : true,
        default : "Low",
        enum : ["Low", "Medium", "High"]
    },
    dueDate : {
        type : String,
        required : true,
    }
},{timestamps:  true});

const TaskModel = mongoose.model("task", todoSchema);

export default TaskModel;






   