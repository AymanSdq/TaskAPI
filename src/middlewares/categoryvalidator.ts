import { body } from "express-validator";

export const categoryValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name field is important")
        .isLength({min : 3}).withMessage("Name must be at least 3 characters"),
    
    body("description")
        .optional()
        .trim()
]