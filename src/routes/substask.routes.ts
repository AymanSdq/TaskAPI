import express from "express";
import { authJWT } from "../auth/auth.middleware";
import { subtaskDataValidator, subtaskIdValidator, subtaskEditValidator } from "../middlewares/subtaskvalidator";
import { createSubtask, getAllSubtasks, editSubtask } from "../controllers/subtask.controller";

const subtaskRoutes = express.Router()

subtaskRoutes.get("/getsubtasks/:id", authJWT, subtaskIdValidator , getAllSubtasks)
subtaskRoutes.post("/createSubtask/:id", authJWT, subtaskDataValidator , createSubtask)
subtaskRoutes.patch("/editsubtask/:id", authJWT, subtaskEditValidator, editSubtask)

export default subtaskRoutes