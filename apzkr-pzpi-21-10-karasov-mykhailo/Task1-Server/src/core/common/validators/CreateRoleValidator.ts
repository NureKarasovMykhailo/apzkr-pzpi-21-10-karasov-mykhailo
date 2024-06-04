import {body, ValidationChain} from 'express-validator';
import i18n from "i18n";

export default function createRoleValidator(): ValidationChain[] {
    return [
        body('roleTitle')
            .trim()
            .notEmpty()
            .withMessage('enterRoleTitle')
            .isString()
            .withMessage('incorrectRoleTitleFormat'),
        body('description')
            .isString()
            .withMessage('incorrectRoleDescriptionFormat')
    ]
}
