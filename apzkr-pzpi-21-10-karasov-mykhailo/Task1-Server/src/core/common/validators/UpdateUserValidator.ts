import {body} from "express-validator";

export default function updateUserValidator() {
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
        body('birthday')
            .isDate()
            .withMessage('birthday'),

    ];
}
