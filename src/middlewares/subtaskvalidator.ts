import { body, param } from "express-validator";

export const subtaskIdValidator = [
    param("id")
        .isUUID().withMessage("Invalid user ID format. Must be a UUID.")
]


export const subtaskDataValidator = [
    body("title")
            .trim()
            .notEmpty().withMessage("Title field is important")
            .isLength({min : 3}).withMessage("Title must be at least 3 characters"),
    
    body("status")
        .optional()
        .trim()
        .isIn(['pending', 'in_progress', 'completed']).withMessage("Status must be either 'pending', 'in_progress', 'completed'."),
    
]

export const subtaskEditValidator = [
    body("title")
        .optional()
        .trim()
        .isLength({min : 3}).withMessage("Title must be at least 3 characters"),
    
    body("status")
        .optional()
        .trim()
        .isIn(['pending', 'in_progress', 'completed']).withMessage("Status must be either 'pending', 'in_progress', 'completed'."), 
]
