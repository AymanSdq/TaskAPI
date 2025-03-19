import { AuthRequest } from "../auth/auth.middleware";
import { Response } from "express-serve-static-core";
import * as categoryController from "../services/category.services"


export const getAllCategories = async (request : AuthRequest, response : Response) => {
    try {
        const tokenData = await request.user

        const getAllCategories = await categoryController.getAllCategories(tokenData)

        response.status(202).json(getAllCategories)
    } catch (error : any) {
        response.status(502).json({Errormessage : error.messaage})
    }
}