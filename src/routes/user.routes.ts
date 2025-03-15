// Importing 
import express from "express";
import { editUser, loginUser, registerUser } from "../controllers/user.controller";
import { authJWT } from "../auth/auth.middleware";


const userRouter = express.Router();


// User routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.patch("/edit", authJWT, editUser)

export default userRouter