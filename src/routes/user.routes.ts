// Importing 
import express from "express";
import { deleteUser, editUser, loginUser, registerUser, updatePassword } from "../controllers/user.controller";
import { authJWT } from "../auth/auth.middleware";
import { deleteUserValidation, loginValidation, passwordChangeValidation, registerValidation } from "../middlewares/uservalidators";


const userRouter = express.Router();


// User routes
userRouter.post("/register",  registerValidation ,registerUser);
userRouter.post("/login", loginValidation ,loginUser);
userRouter.patch("/edit", authJWT , editUser);
userRouter.delete("/delete" , authJWT, deleteUserValidation , deleteUser)
userRouter.patch("/changepassword", authJWT, passwordChangeValidation , updatePassword )

export default userRouter