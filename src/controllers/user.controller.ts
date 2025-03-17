import { Request , Response } from "express-serve-static-core";
import * as userServices from "../services/user.services"
import bcrypt, { hash } from "bcrypt";
import { AuthRequest } from "../auth/auth.middleware";


interface userRegister {
    fullname : string,
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
    
    try {
        const dataFromToken = request.user
        const newData = request.body
        // Fetch the userData first
        const userTokenData = await userServices.userDataService(dataFromToken)
        
        if (!newData.fullname || newData.fullname.trim() === '') {
            newData.fullname = userTokenData.fullname
        }
        
        if (!newData.avatarurl || newData.avatarurl.trim() === '') {
            newData.avatarurl = userTokenData.avatarurl
        }

        const updateData = await userServices.updateUserService(dataFromToken, newData)

        response.json({data : userTokenData, newData : newData})


    }catch(error : any) {
        response.status(502).json({Errormessage : error.message});
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