import express from "express";
import { authJWT } from "../auth/auth.middleware";
import { createTasks, deleteTask, editTask, getAllTasks, getaTask } from "../controllers/task.controller";

const taskRouter = express.Router()

// Get All tasks
taskRouter.get("/alltasks", authJWT, getAllTasks)
// Create a task
taskRouter.post("/addtask", authJWT, createTasks)
// Get single Task
taskRouter.get("/mytask/:id", authJWT, getaTask)
// Edit task
taskRouter.patch("/edittask/:id", authJWT, editTask)
// Delete Task
taskRouter.delete("/deletetask/:id", authJWT, deleteTask)

export default taskRouter