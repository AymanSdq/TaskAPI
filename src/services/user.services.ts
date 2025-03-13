import { query } from "../Database/connect.db";


interface userData {
    fullName : string,
    email : string,
    password : string
}

export const createUser = async (userData : userData) => {

    const { fullName , email , password } = userData
    const avatarImage = "https://avatar.iran.liara.run/public/26"

    const createUserQuery = await query(`
        INSERT INTO users (fullName, email, password, avatarurl)
        VALUES ($1, $2, $3, $4) RETURNING *
        `, [fullName, email ,password, avatarImage]);
    
    return createUserQuery.rows[0]
}