import {body, ValidationChain} from "express-validator";

export default function createOrUpdateComplexityValidator(): ValidationChain[] {
    return [
        body('complexityTitle')
            .trim()
            .notEmpty()
            .withMessage('enterComplexityTitle'),
        body('evaluation')
            .trim()
            .notEmpty()
            .withMessage('enterEvaluation')
            .isNumeric()
            .withMessage('incorrectEvaluationFormat')
    ];
}
