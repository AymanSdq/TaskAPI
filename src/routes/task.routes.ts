import express from "express";
import { authJWT } from "../auth/auth.middleware";
import { createTasks, deleteTask, editTask, getAllTasks, getaTask } from "../controllers/task.controller";
import { editTaskValidator, idValidator, titleValidator } from "../middlewares/taskvalidators";

const taskRouter = express.Router()

// Get All tasks
taskRouter.get("/alltasks", authJWT, getAllTasks)
// Create a task
taskRouter.post("/addtask", authJWT, titleValidator , createTasks)
// Get single Task
taskRouter.get("/mytask/:id", authJWT, idValidator,  getaTask)
// Edit task
taskRouter.patch("/edittask/:id", authJWT,editTaskValidator , editTask)
// Delete Task
taskRouter.delete("/deletetask/:id", authJWT, idValidator, deleteTask)

export default taskRouter