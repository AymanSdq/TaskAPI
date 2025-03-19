import express from "express";
import { authJWT } from "../auth/auth.middleware";
import { categoryValidator } from "../middlewares/categoryvalidator";
import { getAllCategories } from "../controllers/category.controller";

const categoryRoutes = express.Router();

categoryRoutes.get("/getcategories", authJWT, categoryValidator, getAllCategories);

export default categoryRoutes