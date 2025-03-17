import { request, Request, Response } from "express"
import { AuthRequest } from "../auth/auth.middleware"
import * as tasksService from "../services/task.services"


// Get tasks conteoller
export const getAllTasks =  async (request : AuthRequest , response : Response ) => {

    try {
        const authInfo = await request.user;

        const getAll = await tasksService.getTasksService(authInfo)
        
        response.status(202).json({data : getAll})
    } catch (error : any) {
        response.status(502).json({ Errormessage : error.message})
    }
}

// Create a task
export const createTasks = async (request : AuthRequest, response : Response) => {

    try {
        const authInfo = await request.user;
        const taksData = await request.body

        if(!taksData.title || taksData.title.trim() === ''){
            response.status(402).json({Errormessage : "Please enter a Title! "})
            return;
        }

        if(!taksData.status || taksData.title.trim() === '' ) {
            taksData.status = "pending"
        }

        const addTask = await tasksService.addTaskService(authInfo, taksData)

        response.status(202).json({data : addTask})
    } catch (error : any ) {
        response.status(502).json({Error : error.message})
    }
}

// get Single task
export const getaTask = async ( request : AuthRequest , response : Response ) => {

    try {
        const authInfo = await request.user
        const {id} = await request.params

        const getTheTask = await tasksService.getOneTask(authInfo, id)

        response.status(202).json({data : getTheTask})

    } catch (error : any) {
        response.status(502).json({Error : error.message})
    }
}

// Edit single Task
export const editTask = async (request : AuthRequest , response : Response) => {

    try {
        const authInfo = await request.user;
        const { id } = await request.params;
        const newData = await request.body;

        const getTask = await tasksService.getOneTask(authInfo, id);

        if(!newData.title || newData.title.trim() === ''){
            newData.title = getTask.title
        }
        if(!newData.description || newData.description.trim() === ''){
            newData.description = getTask.description
        }
        if(!newData.status || newData.status.trim() === ''){
            newData.status = getTask.status
        }
        if(!newData.due_date || newData.due_date.trim() === ''){
            newData.due_date = getTask.due_date
        }

        const updateTask = await tasksService.updateTask(authInfo, id , newData)

        response.status(202).send({newData : updateTask})

    } catch (error : any) {
        
    }
}

