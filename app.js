
import express from "express";
import dbConnection from "./src/database/db.js";

import userRoutes from "./src/routes/user.routes.js";
import taskRoutes from "./src/routes/task.routes.js";

const app = express();
let PORT = 9000;;

app.use(express.json());

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/task",taskRoutes);


app.get("/", (req, res)=>{
    res.status(200).json({message : "Welcome to Home Page of todo list", success : true});
});


dbConnection().then(()=>{
    console.log("DB Connection Established Successfully");

    // be careful of using http when testing it for first time in browser
    app.listen(PORT,()=>{
        console.log(`Server is running at http://localhost:${PORT}`)
    });


}).catch((err)=>{
    console.log("Some error in connecting DB ", err);
})

