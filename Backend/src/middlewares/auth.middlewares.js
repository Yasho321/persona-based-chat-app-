import jwt from "jsonwebtoken";
import User from "../models/users.models.js";
import dotenv from "dotenv";
dotenv.config();
export const isLoggedIn = async (req, res, next) =>{
    try {
        

        const token = req.cookies?.token;
         if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }


        if(!token){
            return res.status(400).json({
                success : false , 
                
                message : "No Token Found"
            })
        }

        const decoded =  jwt.verify(token , process.env.JWTSECRET_KEY) ;

        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            res.status(400).json({
                success : false ,
                message : "User Not Found via token"
            })
        }

        req.user = user ; 

        next();
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success : false ,
            message : "Error while authentic token",
        })
    }

}
