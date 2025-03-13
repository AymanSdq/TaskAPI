// Importing 
import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller";


const userRouter = express.Router();


// User routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter