import { ValidationError } from 'express-validator';
import i18n from "i18n";

function formatValidationErrors(errors: ValidationError[]): string[] {
    return errors.map(error => {
        // @ts-ignore
        return `${error.path}-${i18n.__(error.msg)}`;
    });
}

export default formatValidationErrors;