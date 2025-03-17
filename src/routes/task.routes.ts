import express from "express";
import { authJWT } from "../auth/auth.middleware";

const taskRouter = express.Router()

// Get All tasks
taskRouter.get("/alltasks", authJWT)

export default taskRouter