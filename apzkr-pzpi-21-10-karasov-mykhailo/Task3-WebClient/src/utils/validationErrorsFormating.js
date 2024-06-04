export default function getFormattingErrors(error) {
    const stringArray = error.split(', ');
    const formattedErrors = []
    for (let i = 0; i < stringArray.length; i++) {
        const formattedError = stringArray[i].split('-');
        formattedErrors.push({
            fieldName: formattedError[0],
            value: formattedError[1]
        });
    }

    const formattedValidationError = {};
    formattedErrors.forEach(error => {
        formattedValidationError[error.fieldName] = error.value;
    });

    return formattedValidationError;
}