import { AuthRequest } from "../auth/auth.middleware";
import { request, Response } from "express";
import * as subtaskServices from "../services/subtask.services"
import { validationResult } from "express-validator";


export const getAllSubtasks = async (request : AuthRequest, response : Response) => {

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({Errors : errors.array().map(err => err.msg)})
        return
    }
    try {
        const tokenData =  await request.user
        const {id} = await request.params

        const getsubtasks = await subtaskServices.getAllSubtasks(tokenData, id)

        response.status(200).json(getsubtasks)
    } catch (error : any) {
        response.status(500).json({Error : error.message})
    }
}

export const createSubtask = async (request : AuthRequest, response : Response) => {

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({Errors : errors.array().map(err => err.msg)})
        return
    }
    try {
        const tokenData = await request.user
        const {id} = await request.params
        const subtaskData = await request.body   

        const createTask = await subtaskServices.createSubtask(tokenData, id, subtaskData)

        response.status(200).json(createTask)
    } catch (error : any) {
        response.status(500).json({Error : error.message})
    }
}

export const editSubtask = async (request : AuthRequest , response : Response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({Errors : errors.array().map(err => err.msg)})
        return
    }
    try {
        const tokenData = await request.user
        const { id } = await request.params
        const subtaskData = await request.body

        const editSubtask = await subtaskServices.editSubtask(tokenData, id ,subtaskData)


        response.status(200).json(editSubtask)
    } catch (error : any) {
        response.status(500).json({Error : error.message})
    }
}