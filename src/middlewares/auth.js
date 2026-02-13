
import jwt from "jsonwebtoken";

const authenticateUser = async(req, res, next)=>{
    try {
        let token = req.cookies?.token || req.header("Authorization")?.replace("Bearer","");

        if(!token){
            return res.status(401).json({
                message : "Unauthorized User", 
                success : false, 
                status : 401
            });
        }

        let decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode.id;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}

export default authenticateUser;