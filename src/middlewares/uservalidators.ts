import { body } from "express-validator";

export const registerValidation = [
    body("fullname")
        .trim()
        .notEmpty().withMessage("Fullname field is required")
        .isLength({min : 3}).withMessage("Fullname must be at least 3 characters"),
    
    body("email")
        .trim()
        .notEmpty().withMessage("Email field is required")
        .isEmail().withMessage("Invalid email format"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password field is required")
        .isLength({min : 8}).withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/).withMessage("Must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Must contain at least one number")
        .matches(/[@$!%*?-_&]/).withMessage("Must contain at least one special character (@$!%*?&)")
        
]


export const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email field is required")
        .isEmail().withMessage("Invalid email format"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password field is required")
]


export const deleteUserValidation = [
    body("password")
        .trim()
        .notEmpty().withMessage("Password field is required")
]

