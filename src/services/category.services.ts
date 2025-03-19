import { request, response } from "express";
import { query } from "../Database/connect.db";

interface tokenData {
    userid : string,
    email : string
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