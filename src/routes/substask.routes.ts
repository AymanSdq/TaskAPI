import express from "express";
import { authJWT } from "../auth/auth.middleware";
import { subtaskDataValidator, subtaskIdValidator } from "../middlewares/subtaskvalidator";
import { createSubtask, getAllSubtasks } from "../controllers/subtask.controller";

const subtaskRoutes = express.Router()

subtaskRoutes.get("/getsubtasks/:id", authJWT, subtaskIdValidator , getAllSubtasks)
subtaskRoutes.post("/createSubtask/:id", authJWT, subtaskDataValidator , createSubtask)

export default subtaskRoutes