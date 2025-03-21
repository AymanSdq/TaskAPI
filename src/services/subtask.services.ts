import { query } from "../Database/connect.db"


interface tokenData {
    userid : string, 
    email : string,
}

interface subtaskData {
    title : string,
    status? : "pending" | "in_progress" | "completed",
}

export const getAllSubtasks = async (tokenData : tokenData, id : string) => {
    try {

        const {userid , email } = tokenData
        const taskid = id
        //    Find the task first
        const findTask = await query(
            `SELECT * FROM tasks
            WHERE userid = $1 AND taskid = $2` ,[userid, taskid])
        
        if(findTask.rows.length < 1 ){
            return { Success : false , Message : "Parent task not found"}
        }

        const findSubstaks = await query(
            `SELECT * FROM subtasks
            WHERE taskid = $1`, [taskid])
        
        if(findSubstaks.rows.length < 1){
            return  { Success : false , Message : "No subtasks found"}
        }

        return {Success : true, data : findSubstaks.rows}
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}

export const createSubtask = async (tokenData : tokenData, id : string, subtaskData : subtaskData) => {
    try {
        const {email , userid} = await tokenData;
        let {title, status} = await subtaskData;
         //    Find the task first
        const findTask = await query(
            `SELECT * FROM tasks
            WHERE userid = $1 AND taskid = $2` ,[userid, id])
        
        if(findTask.rows.length < 1 ){
            return { Success : false , Message : "Parent task not found"}
        }

        if(!status){
            status = "pending"
        }

        const createSubtask = await query(
            `INSERT INTO subtasks (taskid , title, status )
            VALUES ($1,$2,$3) RETURNING *` ,[id, title, status])
        
        if(createSubtask.rows.length < 1 ){
            return {Success : false, Message : "Error Adding the subtask"}
        }

        return {Success : true, data : createSubtask.rows}
        
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}