// Importing 
import express from "express";
import { registerUser } from "../controllers/user.controller";

const userRouter = express.Router();


// User routes
userRouter.post("/register", registerUser);
userRouter.post("/login");

export default userRouter