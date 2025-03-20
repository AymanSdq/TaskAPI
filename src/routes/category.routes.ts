import express from "express";
import { authJWT } from "../auth/auth.middleware";
import { categoryValidator } from "../middlewares/categoryvalidator";
import { createCategory, getAllCategories } from "../controllers/category.controller";

const categoryRoutes = express.Router();

categoryRoutes.get("/getcategories", authJWT, getAllCategories)
categoryRoutes.post("/createcategory", authJWT, categoryValidator, createCategory)

export default categoryRoutes