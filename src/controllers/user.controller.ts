import { Request , Response } from "express-serve-static-core";


interface userRegister {
    fullName : string,
    email : string,
    password : string
}


// Register Controller 

export const registerUser = async ( request : Request, response : Response ) => {
    try {

        const { fullName , email, password } : userRegister = request.body

        response.status(202).json({ fullName : fullName, })

    } catch (error) {
        response.status(502).json({ ErrorMessage : error })
    }

}

// Login Controller
