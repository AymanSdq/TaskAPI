import { body, param } from "express-validator";

export const categoryValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name field is important")
        .isLength({min : 3}).withMessage("Name must be at least 3 characters"),
    
    body("description")
        .optional()
        .trim()
]

export const categoryEditValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Name field is important")
        .isLength({min : 3}).withMessage("Name must be at least 3 characters"),
    body("description")
        .optional()
        .trim(),
    param("id")
        .trim()
        .notEmpty().withMessage("ID of category is required")
        .isUUID().withMessage("Invalid user ID format. Must be a UUID.")
]