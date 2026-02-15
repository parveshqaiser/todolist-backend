
import express from "express";
import {genereateAccessToken, getUserDetail, updateUser, userLogin, userLogout, userRegistration } from "../controllers/user.controller.js";
import authenticateUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/",userRegistration);
router.post("/login",userLogin);
router.get("/",authenticateUser, getUserDetail);
router.patch("/:id",authenticateUser, updateUser);
router.get("/logout",authenticateUser, userLogout);
router.get("/generate/accesstoken", genereateAccessToken);

export default router;