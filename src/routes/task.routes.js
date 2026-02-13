
import express from "express";
import { createTask, deleteTask, getUserTask, updateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/",createTask);
router.get("/:id", getUserTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;