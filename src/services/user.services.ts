import { query } from "../Database/connect.db";
import bcrypt from "bcrypt"

interface userData {
    fullName : string,
    email : string,
    password : string
}

interface userLogin {
    email : string,
    password : string
}

export const createUserServices = async (userData : userData) => {

    const { fullName , email , password } = userData
    const avatarImage = "https://avatar.iran.liara.run/public/26"

    const createUserQuery = await query(`
        INSERT INTO users (fullName, email, password, avatarurl)
        VALUES ($1, $2, $3, $4) RETURNING *
        `, [fullName, email ,password, avatarImage]);
    
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

    return { Success : true, Message : "You are logged in Successfully"}
    
}

