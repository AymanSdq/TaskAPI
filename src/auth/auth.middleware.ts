import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { NextFunction, Response, Request } from "express";

dotenv.config();

export interface AuthRequest extends Request {
    user? : any;
}


export const authJWT = async (request : AuthRequest , response : Response, next : NextFunction ) => {
    // Token
    const token = await request.header("Authorization")?.split(" ")[1];

    try {
        

        if(!token){
            response.status(402).json({ErrorMessage : "Token is Invalid! "})
            return;
        }

        const secretKey = process.env.JWT_SECRET;

        if(!secretKey){
            throw new Error("No Secret Key in .env file! ")
        }

        const decode = jwt.verify(token, secretKey as string);

        request.user = decode
        
        next();
    } catch (error) {
        response.status(403).json({ ErrorMessage: "Invalid or expired token." });

    }
}