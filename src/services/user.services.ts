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

export const createUserServices = async (userData : userData) => {

    const { fullname , email , password } = userData
    const avatarImage = "https://avatar.iran.liara.run/public/26"

    const createUserQuery = await query(`
        INSERT INTO users (fullName, email, password, avatarurl)
        VALUES ($1, $2, $3, $4) RETURNING *
        `, [fullname, email ,password, avatarImage]);
    
    return createUserQuery.rows[0]
}

export const loginService = async ( userLogin : userLogin) => {


    const { email, password } = userLogin

    // Checking the email 
    const checkEmail = await query(
        `SELECT email from users
        WHERE email = $1 `, [email]
    )
    if( checkEmail.rows.length < 1 ){
        return {Success : false, Message : "Incorrect Email or Password"}
    }


    // Checking and comparing the password 
    const checkPassword = await query(
        `SELECT password FROM users
        WHERE email = $1`, [email]
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
        WHERE email = $1 AND password = $2`, [email, dbPassword]
    )
    
    const dataForToken = getAllUserData.rows[0]

    // Token login Created      
    const token = jwt.sign(
        { userid : dataForToken.userid, email : dataForToken.email, fullname : dataForToken.fullName},
        process.env.JWT_SECRET as string,
        {expiresIn : process.env.JWT_EXPIRES_IN || "48h"} as jwt.SignOptions
    );


    return { Success : true, Message : "Logged in Succeffully", Token : token}
    
}

export const userDataService = async ( userTokenInfo : userTokenInfo ) => {

    const {userid , email} = userTokenInfo;

    const showmeData = await query(
        `SELECT fullname, avatarurl, updated_at FROM users
        WHERE userid = $1 AND email = $2`, [userid , email])

    return showmeData.rows[0]
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

        
    } catch(error : any){
        console.error(error.message)
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
            return { ErrorMessage : "Password incrorrect can't delete the account! "}
        }

        const deleteAccount = await query(
            `DELETE FROM users
            WHERE userid = $1 and email = $2 `, [userid, email]);

        if(!deleteAccount){
            return {Error : "Please try again! "}
        }
        return {Success : true, Message : "Account Deleted!"}
        
    } catch (error : any) {
        response.status(502).json({Errormessage : error.message })
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

        const changePassword = query(
            `UPDATE users
            SET password = $1
            WHERE userid = $2 AND email = $3`, [newpassword, userid, email]
        )

        return {Sucess : true, Message : "Password has been Changed ! "}
        
    } catch (error : any) {
        response.status(502).json({Errormessage : error.messaage})
    }
}