import {body, ValidationChain} from "express-validator";

export default function createOrUpdateCompanyValidator(): ValidationChain[] {
    return [
        body('companyName')
            .trim()
            .notEmpty()
            .withMessage('enterCompanyName')
    ]
}
