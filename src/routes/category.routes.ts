import express from "express";
import { authJWT } from "../auth/auth.middleware";
import { categoryEditValidator, categoryValidator } from "../middlewares/categoryvalidator";
import { createCategory, editCateogry, getAllCategories } from "../controllers/category.controller";

const categoryRoutes = express.Router();

categoryRoutes.get("/getcategories", authJWT, getAllCategories)
categoryRoutes.post("/createcategory", authJWT, categoryValidator, createCategory)
categoryRoutes.patch("/editcategory/:id", authJWT, categoryEditValidator, editCateogry)


export default categoryRoutes