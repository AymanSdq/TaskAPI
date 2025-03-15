import { Request , Response } from "express-serve-static-core";
import * as userServices from "../services/user.services"
import bcrypt from "bcrypt";
import { AuthRequest } from "../auth/auth.middleware";


interface userRegister {
    fullName : string,
    email : string,
    password : string
}


// SaltGen  
const salt = 10

// Register Controller 
export const registerUser = async ( request : Request, response : Response ) => {
    try {
        const userData = await request.body

        if(!userData.password){
            response.status(402).json({Error : "No Password Entered! "})
            return;
        }

        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPassword;
        const newUser = await userServices.createUserServices(userData)

        response.status(202).json({data : userData})
    } catch (error : any) {
        response.status(502).json({ ErrorMessage : error.message})
    }

}

// Login Controller
export const loginUser = async ( request : Request, response : Response ) => {
    try {
        const userData = request.body

        // If the Password is entered 
        if(!userData.password){
            response.status(402).json({ErrorMessage : "Password not entred!"})
            return;
        }

        // Services to check the email if existe 
        const checkEmail = await userServices.loginService(userData)

        response.status(202).json({data : checkEmail})

    } catch (error : any) {
        response.status(502).json({Errormessage : error.message});
    }
}

// edit profile 
export const editUser = async ( request : AuthRequest, response : Response ) => {

    response.send(request.user)
}