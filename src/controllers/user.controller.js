
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const userRegistration = async(req, res)=>{
    try {

        let {username,fullName,password} = req.body;

        if (!username || !fullName || !password) {
            return res.status(400).json({
                message: "All fields are required",
                suceess : false
            });
        }

        if(password && password.length <5){
            return res.status(400).json({
                message: "Password min 6 chars",
                suceess : false
            });
        }

        let userExist = await UserModel.findOne({username});

        if(userExist){
            return res.status(400).json({
                message: `Username ${userExist.username} already taken`,
                suceess : false
            });
        }
        
        let user = await UserModel.create({
            username,
            fullName,
            password
        });
        
        res.status(201).json({message : "User Registration Successfull ", suceess : true});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
};

const userLogin = async(req,res)=>{
    try {
        let {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({
                message: "All fields are required",
                suceess : false
            });
        }

        let user = await UserModel.findOne({username});

        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials",
                suceess : false
            });
        }

        if(user.password != password?.trim()){
            return res.status(400).json({
                message: "Invalid Credentials",
                suceess : false
            });
        }

        let accessToken = jwt.sign({id:user._id,username : user.username},
            process.env.SECRET_KEY,
            {expiresIn:"10m"},
        );

        let refreshToken = jwt.sign({id:user._id,username : user.username},
            process.env.REFRESH_TOKEN_SECRET_KEY,
            {expiresIn:"1h"},
        );

        user.refreshToken = refreshToken;
        user.lastLogin = new Date().toLocaleDateString();

        await user.save();

        let data = {
            username : user.username,
            fullName : user.fullName,
        };

        res.cookie("token", accessToken, { 
            sameSite : "strict",
            secure: true,
            httpOnly:true, 
        }).cookie("refreshToken", refreshToken,{
            sameSite : "strict",
            secure: true,
            httpOnly:true, 
        }).status(200).json({
            message : "Login Successful",
            data, 
            success : true,
            accessToken, 
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

const getUserDetail = async(req,res)=>{
    try {
        // let id = req.params.id;
        let id = req.user;

        let user = await UserModel.findOne({_id:id}).select("-password");

        if(!user){
            return res.status(400).json({
                message : "User Does Not Exist",
                suceess : false
            });
        };

        res.status(200).json({message :" User Details Fetched", data : user , success: true});

    } catch (error) {
        res.status(500).json({message: error.message || "Server Error"});
    }
}

const updateUser = async(req,res)=>{
    try {
        let id = req.params.id;

        let {fullName} = req.body;

        let user = await UserModel.findOne({_id:id}).select("-password");

        if(!user){
            return res.status(400).json({
                message : "User Does Not Exist",
                suceess : false
            });
        };

        user.fullName = fullName;
        await user.save();

        res.status(200).json({message :" User Profile Updated", data : user , success: true});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

const userLogout = async(req,res)=>{
    try {
        let id = req.user;

        let user = await UserModel.findOne({_id:id});

        if(!user){
            return res.status(400).json({
                message : "User Does Not Exist",
                suceess : false
            });
        };

        await UserModel.findByIdAndUpdate(id, {$set: {refreshToken:""}});

        // clear the cookie the way you set during login time
        res.status(200).clearCookie("token",{
            sameSite: "strict",
            secure: true,
            httpOnly: true,
        }).clearCookie("refreshToken", {  sameSite: "strict", secure: true, httpOnly: true})
        .json({
            message: "User Logout Success",
            success: true
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

const genereateAccessToken = async(req, res)=>{
    try {
        let incomingRefreshToken = req.cookies?.refreshToken;

        console.log("incomingRefreshToken ", incomingRefreshToken);

        if (!incomingRefreshToken) {
            return res.status(401).json({
                message: "No Refresh Token provided",
                success: false
            });
        }

        let verifyToken;

        try {
            verifyToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET_KEY
            );
        } catch (err) {
            return res.status(401).json({
                message: "Refresh token expired or invalid",
                success: false
            });
        }

        let user = await UserModel.findOne({_id: verifyToken.id}).select("-password");
        console.log("user ", user);

        if(!user){
            return res.status(404).json({message : "User Doesnot Exists" , succcess : false});
        }

        if(incomingRefreshToken !== user.refreshToken){
            return res.status(401).json({message : "Refresh Token is used or expired", success : false});
        }

        let newAccessToken = jwt.sign({id:user._id,username : user.username},
            process.env.SECRET_KEY,
            {expiresIn:"1h"},
        );

        user.lastLogin = new Date().toLocaleDateString();
        await user.save();
        
        res.status(200).cookie("token",newAccessToken,{
            sameSite : "strict",
            secure: true,
            httpOnly:true
        }).json({message : "Access Token Refreshed", success : true});

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}


export {
    userRegistration, 
    userLogin, 
    getUserDetail, 
    updateUser, 
    userLogout,
    genereateAccessToken
};
