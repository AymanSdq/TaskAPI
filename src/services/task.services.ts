import { request, response } from "express";
import { query } from "../Database/connect.db";

interface authInfo {
    userid : string,
    email : string
}

interface taskData {
    title : string,
    description? : string,
    status? : "pending" | "in_progress" | "completed",
    due_date?: string;
}

// Get All tasks QUERY
export const getTasksService = async (authInfo : authInfo) => {
    try {
        const {userid , email} = authInfo

        const getAllTasks = await query(
            `SELECT * FROM tasks
            WHERE userid = $1`, [userid])

        return getAllTasks.rows
        
    } catch (error : any ) {
        return { Success : false, Error : error.message}
    }

}   

// Create a task QUERY
export const addTaskService = async (authInfo : authInfo, taksData : taskData ) => {

    try {
        const {userid , email } = authInfo
        const { title , description, status, due_date} = taksData

        const createTasks = await query(`
            INSERT INTO tasks (userid, title, description, status, due_date)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, [userid, title , description, status, due_date])
            
        return createTasks.rows[0];
        
    } catch (error : any) {
        return {Success : false , Error : error.message}
    }
}

// Get one task
export const getOneTask = async (authInfo : authInfo, taskid : string) => {
    try {
        const {userid, email} = authInfo

        const getOne = await query(`
            SELECT * FROM tasks
            WHERE userid = $1 AND taskid = $2`, [userid, taskid])
        
        return getOne.rows[0]
        
    } catch (error : any) {
        return {Success : false , Error : error.message}
    }
}

// Update Task
export const updateTask = async (authInfo : authInfo, taskid : string, newData : taskData) => {
    
    try {
        const {userid , email } = authInfo;
        const {title , description, status, due_date } = newData

        const updateDate = new Date();

        const updateTask = await query(
            `UPDATE tasks
            SET title = $1, description = $2, status = $3, due_date = $4 , updated_at = $5
            WHERE userid = $6 AND taskid = $7 RETURNING *`, [title, description, status, due_date , updateDate  ,userid, taskid])

        return updateTask.rows[0]

    } catch (error : any ) {
        return {Success : false , Error : error.message}
    }
}