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