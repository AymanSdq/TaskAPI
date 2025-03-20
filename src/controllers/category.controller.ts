import { AuthRequest } from "../auth/auth.middleware";
import { Response } from "express-serve-static-core";
import * as categoryController from "../services/category.services"
import { validationResult } from "express-validator";


export const getAllCategories = async (request : AuthRequest, response : Response) => {
    try {
        const tokenData = await request.user

        const getAllCategories = await categoryController.getAllCategories(tokenData)

        response.status(202).json(getAllCategories)
    } catch (error : any) {
        response.status(502).json({Errormessage : error.messaage})
    }
}

export const createCategory = async (request : AuthRequest, response : Response) => {
    
    const error = validationResult(request)
    if(!error.isEmpty()){
        response.status(400).json({Error : error.array().map( err => err.msg )})
        return
    }

    try {
        const tokenData = await request.user
        const categoryData = await request.body

        const createCategory = await categoryController.createCategory(tokenData, categoryData)

        response.status(200).json(createCategory)

    } catch (error : any) {
        response.status(502).json({Errormessage : error.messaage})
    }
}