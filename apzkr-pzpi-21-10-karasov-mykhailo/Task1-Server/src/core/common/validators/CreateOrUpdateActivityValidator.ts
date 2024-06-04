import {body, ValidationChain} from "express-validator";

export default function createOrUpdateActivityValidator(): ValidationChain[] {
    return [
        body('activityTitle')
            .trim()
            .notEmpty()
            .withMessage('enterActivityTitle'),
        body('requiredWorkerCount')
            .isNumeric()
            .withMessage('enterRequiredWorkerCount'),
        body('timeShift')
            .isNumeric()
            .withMessage('enterTimeShift'),
        body('complexityId')
            .isNumeric()
            .withMessage('enterComplexityId'),
        body('educationId')
            .isNumeric()
            .withMessage('enterEducationId'),

    ]
}