import express from "express";
import { authJWT } from "../auth/auth.middleware";
import { categoryEditValidator, categoryValidator } from "../middlewares/categoryvalidator";
import { createCategory, deleteCategory, editCateogry, getAllCategories } from "../controllers/category.controller";
import { idValidator } from "../middlewares/taskvalidators";

const categoryRoutes = express.Router();

categoryRoutes.get("/getcategories", authJWT, getAllCategories)
categoryRoutes.post("/createcategory", authJWT, categoryValidator, createCategory)
categoryRoutes.patch("/editcategory/:id", authJWT, categoryEditValidator, editCateogry)
categoryRoutes.delete("/deletecategory/:id", authJWT, idValidator, deleteCategory)

export default categoryRoutes