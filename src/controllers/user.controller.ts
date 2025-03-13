import { Request , Response } from "express-serve-static-core";
import * as userServices from "../services/user.services"
import bcrypt from "bcrypt";


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
        const userData = request.body

        if(!userData.password){
            response.status(402).json({Error : "No Password Entered! "})
            return;
        }

        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPassword;
        const newUser = await userServices.createUser(userData)

        response.status(202).json({data : userData})
    } catch (error : any) {
        response.status(502).json({ ErrorMessage : error.message})
    }

}

// Login Controller
