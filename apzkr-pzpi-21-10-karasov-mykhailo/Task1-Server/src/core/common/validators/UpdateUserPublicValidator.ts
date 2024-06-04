import {body} from "express-validator";

export default function updateUserPublicValidator() {
    return [
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
