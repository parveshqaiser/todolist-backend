
import TaskModel from "../models/task.model.js";
import checkValidation from "../utils/validation.js";

const createTask = async(req, res)=>{
    try {
        let {title, description, status, priority, dueDate} = req.body;

        let errorMessage = checkValidation(title, dueDate);

        if(errorMessage){
            return res.status(400).json({message : errorMessage , success :false})
        }

        let id = req.user; // user id

        let task = await TaskModel.create({
            userId : id,
            title,
            description : description || "", 
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
        let id = req.user;  // user id

        let allTask = await TaskModel.find({userId:id}).sort({createdAt:-1});

        let completedTask = allTask?.length && allTask.filter(task => task.status == "Completed" && task.completedOn <= task.dueDate);

        let onTimePercentage = (completedTask.length / allTask.length) * 100;

        let missedTask = allTask?.length && allTask.filter(t => {
            return (t.status != "Completed")  && t.dueDate < new Date().toISOString().split("T")[0] })

        // res.status(200).json({message : "data fetched", completedTask, onTimePercentage});

        return res.status(200).json({
            message: allTask.length 
                ? "Tasks fetched successfully" 
                : "No tasks found",
            success: true,
            count: allTask.length,
            data: allTask,
            onTimePercentage,
            lastTaskCreated : allTask[0],            
            missedTask : missedTask.length || 0
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message, 
            success: false 
        });
    }
};


const updateTask = async(req, res)=>{
    try {
        let id = req.params.id; // task id

        let {title,description,status, priority, dueDate} = req.body;
        let errorMessage = checkValidation(title, dueDate);

        if(errorMessage){
            return res.status(400).json({message : errorMessage , success :false})
        }

        let findTask = await TaskModel.findOne({_id:id});

        if(!["Pending", "In-Progress", "Completed"].includes(status)){
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

        if(status == "Pending" || status == "In-Progress"){
            Object.keys(req.body).forEach(val => findTask[val] = req.body[val]);
        }else if(status == "Completed"){
            findTask.title = title;
            findTask.description = description;
            findTask.status = status; 
            findTask.priority= priority; 
            findTask.dueDate = dueDate;
            findTask.completedOn = new Date().toISOString().split("T")[0];
            findTask.isCompleted = true;
        }
      
        await findTask.save();

        res.status(201).json({message : "Task Updated", success : true , data : findTask});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};

const deleteTask = async(req, res)=>{
    try {
        let id = req.params.id; // task id

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