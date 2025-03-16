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

interface newData {
    fullname : string,
    email : string,
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

    if(checkEmail.rows.length == 0){
        return { ErrorMessage : "Email or Password are Incorrect "}
    }

    // Checking and comparing the password 
    const checkPassword = await query(
        `SELECT password FROM users
        WHERE email = $1`, [email]
    )

    const dbPassword = checkPassword.rows[0].password
    const comparingPassword =  await bcrypt.compare(password, dbPassword)

    if(!comparingPassword){
        return { ErrorMessage : "Email or Password are Incorrect "}
    }

    const getAllUserData = await query(
        `SELECT userid, email, fullName FROM users
        WHERE email = $1 AND password = $2`, [email, dbPassword]
    )

    const dataForToken = getAllUserData.rows[0]

    // Token login Created      
    const token = jwt.sign(
        { userid : dataForToken.userid, email : dataForToken.email},
        process.env.JWT_SECRET as string,
        {expiresIn : process.env.JWT_EXPIRES_IN || "48h"} as jwt.SignOptions
    );


    return { Success : true, Message : token}
    
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