
import express from "express";
import {getUserDetail, updateUser, userLogin, userRegistration } from "../controllers/user.controller.js";
import authenticateUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/",userRegistration);
router.post("/login",userLogin);
router.get("/:id",authenticateUser, getUserDetail);
router.patch("/:id",authenticateUser, updateUser);

export default router;