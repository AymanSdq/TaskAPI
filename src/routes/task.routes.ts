import express from "express";
import { authJWT } from "../auth/auth.middleware";
import { createTasks, getAllTasks } from "../controllers/task.controller";

const taskRouter = express.Router()

// Get All tasks
taskRouter.get("/alltasks", authJWT, getAllTasks)
// Create a Atask
taskRouter.post("/addtask", authJWT, createTasks)

export default taskRouter