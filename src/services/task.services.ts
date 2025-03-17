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

// TODO : VIEW SINGLE TASK 