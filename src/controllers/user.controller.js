
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const userRegistration = async(req, res)=>{
    try {

        let  { username,fullName,password} = req.body;

        if (!username || !fullName || !password) {
            return res.status(400).json({
                message: "All fields are required",
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
        
        res.status(200).json({message : "User Registration Successfull ", data : req.body, suceess : true});

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
            {expiresIn:"5m"},
        );

        let refreshToken = jwt.sign({id:user._id,username : user.username},
            process.env.REFRESH_TOKEN_SECRET_KEY,
            {expiresIn:"1d"},
        );

        user.refreshToken = refreshToken;

        await user.save();

        res.cookie("token", accessToken, { 
            sameSite : "strict",
            secure: true,
            httpOnly:true, 
        }).status(200).json({
            message : "Login Successfull", 
            success : true,
            accessToken , 
            refreshToken
        });


    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, success: false });
    }
}

const getUserDetail = async(req,res)=>{
    try {
        let id = req.params.id;

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



export {userRegistration, userLogin, getUserDetail, updateUser};

/*
const getTaskOfUserUsingPopulate = async(req, res)=>{
    try {
        let id = req.params.id;
        console.log("id *************", id)
        let userExist = await TaskModel.find({userId:id}).populate("userId");
        console.log("user exost ", userExist);

        res.status(200).json({message : "user fetched ", data : userExist, suceess : true});

    } catch (error) {
        res.status(500).json({message: error.message || "Server Error"});
    }
}

*/
