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

        if(!status || title.trim() === ''){
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

export const editSubtask = async (tokenData : tokenData, id : string, subtaskData : subtaskData) => {
    try {
        const {email , userid} = await tokenData;
        let {title, status} = await subtaskData;
         //    Find the task first

        const subtaskOld = await query(
            `SELECT * FROM subtasks
            WHERE subtask = $1` ,[id])
        
        if(subtaskOld.rows.length < 1 ){
            return { Success : false , Message : "Subtask not found"}
        }

        const checkPermission = await query(
            `SELECT * FROM tasks
            WHERE userid = $1 AND taskid = $2`, [userid , subtaskOld.rows[0].taskid])

        if(checkPermission.rows.length < 1){
            return { Success : false , Message : "You Don't have the Persmission to Edit"}
        }

        if(!title || title.trim() === ''){
            title = subtaskOld.rows[0].title
        }
        if(!status || status.trim() === ''){
            status = subtaskOld.rows[0].status
        }
        
        const editSubtask = await query(
            `UPDATE subtasks
            SET title = $1, status = $2
            WHERE subtask = $3 RETURNING *` , [title, status, id])

        if(editSubtask.rows.length < 1){
            return {Success : false , Message : "Error editing the category Try Again"}
        }
        
        return {Success : true , data : editSubtask.rows[0]}
        
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}

