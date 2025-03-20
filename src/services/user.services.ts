import { query } from "../Database/connect.db";
import bcrypt, { compare } from "bcrypt"
import dotenv from 'dotenv'
import { response } from "express";
import jwt from "jsonwebtoken"

dotenv.config()

interface userData {
    fullname : string,
    email : string,
    password : string
}

interface passInfo {
    oldpassword : string,
    newpassword : string
}

interface newData {
    fullname : string,
    avatarurl : string
}

interface userTokenInfo {
    userid : string,
    email : string
}


interface userLogin {
    email : string,
    password : string
}

const salt = 10;

export const createUserServices = async (userData : userData) => {
    try{
        const { fullname , email , password } = userData
        const avatarImage = "https://avatar.iran.liara.run/public/26"

        const hashedPassword = await bcrypt.hash(password, salt);

        const createUserQuery = await query(`
            INSERT INTO users (fullName, email, password, avatarurl)
            VALUES ($1, $2, $3, $4) RETURNING *
            `, [fullname.trim(), email.toLowerCase() ,hashedPassword, avatarImage]);
    
        return {Success : true, Message : "Account created successffully now logg in please"}

    }catch(error : any){
        console.error("Error in createUserServices:", error.message);

        if(error.code === "23505"){
            return { success: false, message: "Email already exists." };
        }
        return { success: false, message: "Failed to create user.", error: error.message };
    }
}

export const loginService = async ( userLogin : userLogin) => {

    try {
        const { email, password } = userLogin

        // Checking the email 
        const checkEmail = await query(
            `SELECT email from users
            WHERE email = $1 `, [email.toLowerCase()]
        )
        if( checkEmail.rows.length < 1 ){
            return {Success : false, Message : "Incorrect Email or Password"}
        }
    
        // Checking and comparing the password 
        const checkPassword = await query(
            `SELECT password FROM users
            WHERE email = $1`, [email.toLowerCase()]
        )
        // Comparing Password
        const dbPassword = checkPassword.rows[0].password
        const comparingPassword =  await bcrypt.compare(password, dbPassword)
        // Incorrect Password
        if(!comparingPassword){
            return {Sucess : false , Message : "Incorrect Email or Password"}
        }
    
        // Getting user data to make a token
        const getAllUserData = await query(
            `SELECT userid, email, fullname FROM users
            WHERE email = $1 AND password = $2`, [email.toLowerCase(), dbPassword]
        )
        
        const dataForToken = getAllUserData.rows[0]
    
        // Token login Created      
        const token = jwt.sign(
            { userid : dataForToken.userid, email : dataForToken.email, fullname : dataForToken.fullName},
            process.env.JWT_SECRET as string,
            {expiresIn : process.env.JWT_EXPIRES_IN || "48h"} as jwt.SignOptions
        );
    
        return { Success : true, Message : "Logged in Succeffully", Token : token}
        
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }

}

export const userDataService = async ( userTokenInfo : userTokenInfo ) => {

    try {
        const {userid , email} = userTokenInfo;

        const showmeData = await query(
        `SELECT fullname, avatarurl, updated_at FROM users
        WHERE userid = $1 AND email = $2`, [userid , email])


        return {Success : true, data : showmeData.rows[0], info : showmeData.rowCount}
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}

export const updateUserService = async ( userTokenInfo : userTokenInfo , newData : newData) => {

    try{
        const {userid , email} = userTokenInfo;

        const {fullname, avatarurl} = newData

        const dateNow = new Date()

        const updateData = await query(
            `UPDATE users
            SET fullname = $1, avatarurl = $2, updated_at = $3
            WHERE userid = $4 AND email = $5`, [fullname, avatarurl , dateNow ,userid , email])

        return {Success : true, Message : "Data updated with success"}
    } catch(error : any){
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }

}

export const deleteUserService = async ( userTokenInfo : userTokenInfo , password : string) => {

    try {
        const {userid , email } = userTokenInfo ;

        const getPassword = await query(
            `SELECT password FROM users
            WHERE email = $1 and userid = $2 `, [email, userid])

        const userPassword = getPassword.rows[0].password;

        const comparePassword = await bcrypt.compare(password , userPassword)
        
        if(!comparePassword){
            return {Success : true , Message : "Incorrect Password Please try again"}
        }

        const deleteAccount = await query(
            `DELETE FROM users
            WHERE userid = $1 and email = $2 `, [userid, email]);

        if(deleteAccount.rows.length < 1){
            return {Success : false, Message : "Error while deleting the account please try again later"}
        }

        return {Success : true, Message : "Your Account has been delete Successfully"}
        
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }

}

export const changePassword = async (userTokenInfo : userTokenInfo, passwordinfo : passInfo  ) => {
    

    try {
        const {userid, email } = userTokenInfo
        const {oldpassword, newpassword} = passwordinfo

        // Get User password
        const getPassword = await query(
            `SELECT password FROM users
            WHERE email = $1 and userid = $2 `, [email, userid])

        const userPassword = getPassword.rows[0].password;

        // Check if Old password is correct
        const checkPassword = await bcrypt.compare(oldpassword, userPassword);
        if(!checkPassword){
            return {Success : false, Errormessage : "Old Password is Incorrect "}
        }

        const hashedPassword = await bcrypt.hash(newpassword, salt);

        const changePassword = query(
            `UPDATE users
            SET password = $1
            WHERE userid = $2 AND email = $3`, [hashedPassword, userid, email]
        )

        return {Sucess : true, Message : "Your password has been changed successffully"}
        
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}