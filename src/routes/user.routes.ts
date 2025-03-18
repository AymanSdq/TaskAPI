// Importing 
import express from "express";
import { deleteUser, editUser, loginUser, registerUser, updatePassword } from "../controllers/user.controller";
import { authJWT } from "../auth/auth.middleware";
import { loginValidation, registerValidation } from "../middlewares/uservalidators";


const userRouter = express.Router();


// User routes
userRouter.post("/register",  registerValidation ,registerUser);
userRouter.post("/login", loginValidation ,loginUser);
userRouter.patch("/edit", authJWT, editUser);
userRouter.delete("/delete" , authJWT, deleteUser)
userRouter.patch("/changepassword", authJWT, updatePassword )

export default userRouter