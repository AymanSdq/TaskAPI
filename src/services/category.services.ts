import { request, response } from "express";
import { query } from "../Database/connect.db";

interface tokenData {
    userid : string,
    email : string
}

interface categoryData {
    name : string,
    description? : string
}

export const getAllCategories = async (tokenData : tokenData) => {

    try {
        const {userid , email} = tokenData;

        const getAllCategories = await query(
            `SELECT * FROM categories
            WHERE userid = $1`, [userid])

        if(getAllCategories.rows.length < 1) {
            return {Success : false, Message : "No categories found"}
        }
        
        return {Success : true, data : getAllCategories.rows}
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}

export const createCategory = async (tokenData : tokenData, categoryData : categoryData) =>{
    try {
        const {userid, email} = tokenData;
        let {name, description} = categoryData;

        if(!description || description.trim() === '' ) {
            description = ""
        }

        const createCategory = await query(
            `INSERT INTO categories (userid ,name, description)
            VALUES ($1, $2, $3) RETURNING *`, [userid, name, description])

        if(createCategory.rows.length < 1){
            return {Success : false, Message : "Error Please try again"}
        }
        
        return {Success : true, data : createCategory.rows[0]}
    } catch (error: any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}

export const getOneCategory = async(tokenData : tokenData, id : string) => {
    try {
        const {userid, email} = tokenData
        
        const getOneCategory = await query(
            `SELECT name, description FROM categories
            WHERE userid = $1 AND categoryid = $2`, [userid , id])

        if(getOneCategory.rows.length < 1){
            return {Success : false, Message : "Category not found!"}
        }

        return { Success : true, data : getOneCategory.rows[0]}
                
    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}

export const editCategory = async(tokenData: tokenData , id : string , oldData : categoryData, newData : categoryData) => {
    try {
        const {userid, email} = tokenData
        let {name, description} = newData

        if(!name || name.trim() === ''){
            name = oldData.name
        }
        if(!description || description.trim() === ''){
            description = oldData.description
        }

        const updateData = new Date()

        const updateCategory = await query(
            `UPDATE categories
            SET name = $1 , description = $2, updated_at = $3 
            WHERE userid = $4 and categoryid = $5 RETURNING *`, [name, description, updateData, userid, id ])

        if(updateCategory.rows.length < 1){
            return {Success : false , Message : "Error editing the category Try Again"}
        }

        return {Success : true, Message : "Data updated successffully"}

    } catch (error : any) {
        console.error(error.message)
        return {Type : "Error" , Message : error.message}
    }
}