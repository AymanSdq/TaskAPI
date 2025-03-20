import { AuthRequest } from "../auth/auth.middleware";
import { Response } from "express-serve-static-core";
import * as categoryController from "../services/category.services"
import { Result, validationResult } from "express-validator";


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

export const editCateogry = async (request : AuthRequest, response : Response) => {
    
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(404).json({Errors : errors.array().map(err => err.msg)})
        return
    }
    try{
        const tokenData = request.user
        const {id} = request.params
        const newData = request.body

        const getOneCategory = await categoryController.getOneCategory(tokenData , id)
        const oldData = getOneCategory.data

        const updateCategory = await categoryController.editCategory(tokenData, id, oldData, newData)

        response.status(200).json(updateCategory)

    }catch(error : any){
        response.status(502).json({Errormessage : error.messaage})
    }
}

export const deleteCategory = async (request : AuthRequest, response : Response) => {
    const errros = validationResult(request)
    if(!errros.isEmpty){
        response.status(404).json({Errors : errros.array().map( err => err.msg )})
        return
    }

    try {
        const tokenData = request.user
        const { id } = request.params

        const deleteCategory = await categoryController.deleteCategory(tokenData, id)

        response.status(202).json(deleteCategory)
    } catch (error : any) {
        response.status(502).json({Errormessage : error.messaage})
    }
}