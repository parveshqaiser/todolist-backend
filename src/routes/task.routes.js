
import express from "express";
import { createTask, deleteTask, getUserTask, updateTask } from "../controllers/task.controller.js";
import authenticateUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/",authenticateUser,createTask);
router.get("/:id",authenticateUser, getUserTask);
router.put("/:id",authenticateUser, updateTask);
router.delete("/:id",authenticateUser, deleteTask);

export default router;