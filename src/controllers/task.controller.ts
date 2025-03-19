import { request, Request, Response } from "express"
import { AuthRequest } from "../auth/auth.middleware"
import * as tasksService from "../services/task.services"
import { validationResult } from "express-validator";


// Get tasks conteoller
export const getAllTasks =  async (request : AuthRequest , response : Response ) => {

    try {
        const authInfo = await request.user;
        const getAll = await tasksService.getTasksService(authInfo)
        
        response.status(200).json(getAll)
    } catch (error : any) {
        response.status(502).json({Errormessage : error.messaage})
    }
}

// Create a task
export const createTasks = async (request : AuthRequest, response : Response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({Errors : errors.array().map( err => err.msg )})
        return
    }

    try {
        const authInfo = await request.user;
        const taksData = await request.body

        const addTask = await tasksService.addTaskService(authInfo, taksData)

        response.status(200).json(addTask)
    } catch (error : any ) {
        response.status(500).json({Error : error.message})
    }
}

// get Single task
export const getaTask = async ( request : AuthRequest , response : Response ) => {

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({Error : errors.array().map( err => err.msg)})
        return
    }

    try {
        const authInfo = await request.user
        const { id } = await request.params

        const getTheTask = await tasksService.getOneTask(authInfo, id)

        response.status(200).json(getTheTask)

    } catch (error : any) {
        response.status(502).json({Error : error.message})
    }
}

// Edit single Task
export const editTask = async (request : AuthRequest , response : Response) => {

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({Error : errors.array().map( err => err.msg)})
        return
    }

    try {
        const authInfo = await request.user;
        const { id } = await request.params;
        const newData = await request.body;

        const getTask = await tasksService.getOneTask(authInfo, id);
        const oldData = getTask.data
        
        const updateTask = await tasksService.updateTask(authInfo, id , newData , oldData)

        response.status(202).send(updateTask)

    } catch (error : any) {
        response.status(502).json({Error : error.message})

    }
}

// Delete Single Task
export const deleteTask = async (request : AuthRequest , response : Response) => {
    
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({Errors : errors.array().map( err => err.msg)})
        return
    }

    try {
        const authInfo = await request.user
        const { id } = await request.params

        const deleteTask = await tasksService.deleteTask(authInfo, id)

        response.status(202).json(deleteTask)
    } catch (error : any) {
        response.status(502).json({Error : error.message})
    }
}