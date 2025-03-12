import { Request , Response } from "express-serve-static-core";

export const registerUser = async ( request : Request, response : Response ) => {

    try {

        response.status(202).send(" Welcome to Register Page !")

    } catch (error) {
        response.status(502).json({ ErrorMessage : error })
    }

}