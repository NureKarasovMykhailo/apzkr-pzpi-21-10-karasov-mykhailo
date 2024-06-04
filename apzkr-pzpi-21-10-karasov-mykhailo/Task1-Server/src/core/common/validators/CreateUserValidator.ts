import {NextFunction, Request, Response} from "express";
import {body} from "express-validator";

function createUserValidator() {
    return [
        body('email')
          .isEmail()
          .withMessage('incorrectEmailFormat'),
        body('firstName')
            .trim()
            .notEmpty()
            .withMessage('enterFirstName'),
        body('secondName')
            .trim()
            .notEmpty()
            .withMessage('enterSecondName'),
        body('password')
            .trim()
            .isLength({min: 8, max: 20})
            .withMessage('passwordMustBe'),
        body('birthday')
            .isDate()
            .withMessage('birthday'),

    ];
}

export default createUserValidator;