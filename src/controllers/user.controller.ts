import { Request , Response } from "express-serve-static-core";
import * as userServices from "../services/user.services"
import bcrypt, { hash } from "bcrypt";
import { AuthRequest } from "../auth/auth.middleware";
import { validationResult } from "express-validator";


interface userRegister {
    fullname : string,
    email : string,
    password : string
}


// SaltGen  
const salt = 10

// Register Controller 
export const registerUser = async ( request : Request, response : Response )  => {

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({Errors : errors.array().map(err => err.msg)})
        return
    }

    try {
        const {fullname , email, password} = await request.body
        
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userServices.createUserServices({ fullname, email, password : hashedPassword });
        response.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error : any) {
        response.status(500).json({ error: "Internal Server Error", details: error.message });
    }

}

// Login Controller
export const loginUser = async ( request : Request, response : Response ) => {
    
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({Errors : errors.array().map(error => error.msg)})
        return
    }
    
    try {
        const {email , password} = request.body

        // Services to check the email if existe 
        const userLogin = await userServices.loginService({email, password})
        
        response.status(201).json(userLogin)

    } catch (error : any) {
        response.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// edit profile 
export const editUser = async ( request : AuthRequest, response : Response ) => {

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(404).json({Errors : errors.array().map(err => err.msg)})
        return
    }
    
    try {
        const dataFromToken = request.user
        let {fullname , avatarurl} = request.body
        // Fetch the userData first
        const userTokenData = await userServices.userDataService(dataFromToken)
        
        if (!fullname || fullname.trim() === '') {
            fullname = userTokenData.fullname
        }
        if (!avatarurl || avatarurl.trim() === '') {
            avatarurl = userTokenData.avatarurl
        }

        const updateData = await userServices.updateUserService(dataFromToken, { fullname, avatarurl })

        response.status(200).json({Success : true, Message : "Data updated with success"})


    }catch(error : any) {
        response.status(500).json({ error: "Internal Server Error", details: error.message });
    }


}

// Delete Account
export const deleteUser = async ( request : AuthRequest , response : Response ) => {

    try {
        const userToken = await request.user ;

        const {password} = request.body

        if(!password) {
            response.status(402).json({Errormessage : "Please enter your Password! "})
            return
        }

        const deleteAccount = await userServices.deleteUserService(userToken, password)

        response.status(202).json({Message : deleteAccount})

    }catch(error : any) {
        response.status(502).json({Error : error.message})
    }
}

// Change Password 
export const updatePassword = async ( request : AuthRequest , response : Response ) => {
    try {
        const tokenUser = await request.user;
        const passInfo = await request.body

        if(!passInfo.oldpassword || passInfo.oldpassword.trim() === ''){
            response.status(402).json({Errormessage : "Please enter old Password! "})
            return;
        }

        if(!passInfo.newpassword || passInfo.newpassword.trim() === ''){
            response.status(402).json({Errormessage : "Please enter the new Password! "})
            return;
        }

        const hashedPassword = await bcrypt.hash(passInfo.newpassword, salt);
        passInfo.newpassword = hashedPassword

        const changePassword = await userServices.changePassword(tokenUser, passInfo)

        response.status(202).send(changePassword)

    } catch (error : any ) {
        response.status(502).json({Errormessage : error.messaage})
    }
}   