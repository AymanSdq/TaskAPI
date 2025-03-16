// Importing 
import express from "express";
import { deleteUser, editUser, loginUser, registerUser } from "../controllers/user.controller";
import { authJWT } from "../auth/auth.middleware";


const userRouter = express.Router();


// User routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.patch("/edit", authJWT, editUser);
userRouter.delete("/delete" , authJWT, deleteUser)

export default userRouter