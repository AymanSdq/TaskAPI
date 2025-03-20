import { request, response } from "express";
import { query } from "../Database/connect.db";

interface authInfo {
    userid : string,
    email : string
}

interface taskData {
    title : string,
    description? : string,
    categoryid? : string,
    status? : "pending" | "in_progress" | "completed",
    priority? : "low" | "medium" | "high",
    due_date?: string;
}

// Get All tasks QUERY
export const getTasksService = async (authInfo : authInfo) => {
    try {
        const {userid , email} = authInfo

        const getAllTasks = await query(
            `SELECT * FROM tasks
            WHERE userid = $1`, [userid])

        return {Success : true , data : getAllTasks.rows}
        
    } catch (error : any ) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }

}   

// Create a task QUERY
export const addTaskService = async (authInfo : authInfo, taksData : taskData ) => {

    try {
        const {userid , email } = authInfo
        let { title , categoryid ,description, status, priority , due_date} = taksData

        if(!status || status.trim() === '' ) {
            status = "pending"
        }

        if(!priority || priority.trim() === '' ) {
            priority = "medium"
        }

        if(!categoryid || categoryid.trim() === '' ) {
            categoryid = ""
        }

        const createTasks = await query(`
            INSERT INTO tasks (userid, title, categoryid ,description, status, priority , due_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [userid, title , categoryid ,description, status, priority ,due_date])

        if(createTasks.rows.length < 0 ){
            return {Success : false, Error : "Error while adding the task"};
            return
        }
            
        return {Success : true, data : createTasks.rows[0]};
        
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}

// Get one task
export const getOneTask = async (authInfo : authInfo, taskid : string) => {
    try {
        const {userid, email} = authInfo

        const getOne = await query(`
            SELECT * FROM tasks
            WHERE userid = $1 AND taskid = $2`, [userid, taskid])

        if(getOne.rows.length < 1){
            return {Success : false , Message : "There is not task with this ID ", error : 404}
        }
        
        return {Success : true , data : getOne.rows[0]}

    } catch (error : any) {
        return {Success : false , Error : error.message}
    }
}

// Update Task
export const updateTask = async (authInfo : authInfo, taskid : string, newData : taskData, oldData : taskData) => {
    
    try {
        const {userid , email } = await authInfo;
        let {title , description, status, priority , due_date, categoryid } = await newData

        const updateDate = new Date();

        if(!newData.title || newData.title.trim() === ''){
            title = oldData.title
        }
        if(!newData.categoryid || newData.categoryid.trim() === ''){
            categoryid = oldData.categoryid
        }
        if(!newData.description || newData.description.trim() === ''){
            description = oldData.description
        }
        if(!newData.status || newData.status.trim() === ''){
            status = oldData.status
        }
        if(!newData.priority || newData.priority.trim() === ''){
            priority = oldData.priority
        }
        if(!newData.due_date){
            due_date = oldData.due_date
        }

        const updateTask = await query(
            `UPDATE tasks
            SET title = $1, categoryid = $2 , description = $3, status = $4, priority = $5 ,due_date = $6 , updated_at = $7
            WHERE userid = $8 AND taskid = $9 RETURNING *`, [title, categoryid ,description, status, priority ,due_date , updateDate  ,userid, taskid])

        if(updateTask.rows.length < 1){
            return {Success : false, Error : "Error while Editing the task"};
            return
        }

        return {Success : true, data : updateTask.rows[0]}

    } catch (error : any ) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}

// Delete Task
export const deleteTask = async (authInfo : authInfo, taskid : string) => {

    try {
        const {userid, email} = authInfo

        const deleteTask = await query(
            `DELETE FROM tasks
            WHERE userid = $1 AND taskid = $2
            RETURNING * `, [userid, taskid])

        if (deleteTask.rowCount === 0) {
            return { success: false, message: "Task not found or you don't have permission to delete it." };
        }
        
        return {Success : true, Message : "Task Deleted Successffully "}

    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}