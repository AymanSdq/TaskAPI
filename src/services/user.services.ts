import { query } from "../Database/connect.db";
import bcrypt from "bcrypt"
import dotenv from 'dotenv'
import jwt from "jsonwebtoken"

dotenv.config()

interface userData {
    fullname : string,
    email : string,
    password : string
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


export const updateService = async ( userTokenInfo : userTokenInfo ) => {

    const {userid , email} = userTokenInfo;

    const showmeData = await query(
        `SELECT * FROM users
        WHERE userid = $1 AND email = $2`, [userid , email])

    return showmeData.rows[0]
}