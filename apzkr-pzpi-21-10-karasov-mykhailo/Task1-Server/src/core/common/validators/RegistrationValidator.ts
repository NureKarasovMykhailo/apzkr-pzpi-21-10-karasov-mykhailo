import {body, ValidationChain} from 'express-validator';
import {NextFunction, Request} from "express";

export default function registrationValidator(): ValidationChain[] {
    return [
        body('email')
            .isEmail()
            .withMessage('incorrectEmailFormat'),
        body('password')
            .trim()
            .isString()
            .withMessage('incorrectPasswordFormat')
            .isLength({min: 8, max: 20})
            .withMessage('passwordMustBe'),
        body('firstName')
            .trim()
            .isString()
            .withMessage('enterFirstName'),
        body('secondName')
            .trim()
            .isString()
            .withMessage('enterSecondName'),
        body('birthday')
            .isDate()
            .withMessage('birthday')
    ]
}
