import { Request, Response } from "express"
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