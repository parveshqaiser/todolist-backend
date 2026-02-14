
import express from "express";
import {getUserDetail, updateUser, userLogin, userLogout, userRegistration } from "../controllers/user.controller.js";
import authenticateUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/",userRegistration);
router.post("/login",userLogin);
router.get("/",authenticateUser, getUserDetail);
router.patch("/:id",authenticateUser, updateUser);
router.get("/logout",authenticateUser, userLogout);

export default router;