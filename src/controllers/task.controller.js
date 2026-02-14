
import TaskModel from "../models/task.model.js";

const createTask = async(req, res)=>{
    try {
        let {userId, title, description, status, priority, dueDate} = req.body;

        let task = await TaskModel.create({
            userId,
            title,
            description, 
            status, 
            priority, 
            dueDate
        });

        res.status(201).json({message : "Task Created ", success : true, data : task});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

// only the logged in user , it will give an array of task.
const getUserTask = async(req, res)=>{

    try {
        let id = req.params.id;

        let allTask = await TaskModel.find({userId:id});


        res.status(200).json({message : "Data Fetched", success :true , data : allTask});
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};


const updateTask = async(req, res)=>{
    try {
        let id = req.params.id;

        let {title,description,status, priority, dueDate} = req.body;

        let findTask = await TaskModel.findOne({_id:id});

        if(!["Pending", "In-Progress", "Done"].includes(status)){
            return res.status(400).json({
                message: "Invalid Status",
                suceess : false
            })
        }

        if(!findTask){
            return res.status(400).json({
                message: "Task Does not Exists",
                suceess : false
            });
        }

        Object.keys(req.body).forEach(val => findTask[val] = req.body[val]);
        await findTask.save();

        res.status(201).json({message : "Task Updated", success : true , data : findTask});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};

const deleteTask = async(req, res)=>{
    try {
        let id = req.params.id;

        let findTask = await TaskModel.findOne({_id:id});

        if(!findTask){
            return res.status(400).json({
                message: "Task Does not Exists",
                suceess : false
            });
        } 

        let delTask = await TaskModel.findByIdAndDelete(id);
        
        if(!delTask){
            return res.status(400).json({
                message: "Some Error in Deleting Task. Try Again Later",
                suceess : false
            });
        }

        res.status(201).json({message : "Task Deleted", success : true , data : findTask._id});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

export {createTask, getUserTask , updateTask, deleteTask};