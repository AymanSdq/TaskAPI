import { body, param } from "express-validator";

export const titleValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title field is important")
        .isLength({min : 3}).withMessage("Title must be at least 3 characters"),

    body("status")
        .optional()
        .trim()
        .isIn(['pending', 'in_progress', 'completed']).withMessage("Status must be either 'pending', 'in_progress', 'completed'."),

    body("description")
        .optional()
        .trim(),
    
    body("due_date")
        .optional()
        .trim()
        .isISO8601().withMessage("Invalid date format")
        .toDate()

]



export const idValidator = [
    param("id")
        .isUUID().withMessage("Invalid user ID format. Must be a UUID.")
]

export const editTaskValidator = [
    body("title")
        .optional()
        .trim()
        .isLength({min : 3}).withMessage("Title must be at least 3 characters"),

    body("status")
        .optional()
        .trim()
        .isIn(['pending', 'in_progress', 'completed']).withMessage("Status must be either 'pending', 'in_progress', 'completed'."),

    body("status")
        .optional()
        .trim(),
    
    body("due_date")
        .optional()
        .trim()
        .isISO8601().withMessage("Invalid date format")
        .toDate() // Converts to a Date object
]