
import express from "express";
import {getUserDetail, updateUser, userRegistration } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/",userRegistration);
router.get("/:id", getUserDetail);
router.patch("/:id", updateUser);

export default router;