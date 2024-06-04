import React, {useState} from 'react';
import {Alert, Button, Form, InputGroup} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import getFormattingErrors from "../../../utils/validationErrorsFormating";
import {createComplexity} from "../../../API/complexityApi";
import {useNavigate} from "react-router-dom";
import {ADMIN_PAGE} from "../../../utils/consts";

const AdminAddComplexity = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [validationErrors, setValidationErrors] = useState({
        complexityTitle: '',
        evaluation: ''
    });
    const [error, setError] = useState('');

    const [complexityData, setComplexityData] = useState({
        complexityTitle: '',
        evaluation: ''
    });

    const onChange = (e) => {
        setComplexityData({
            ...complexityData,
            [e.target.name]: e.target.value
        });
    }

    const handleAddComplexity = async () => {
        try {
            const formData = new FormData();
            formData.append('complexityTitle', complexityData.complexityTitle);
            formData.append('evaluation', complexityData.evaluation);

            await createComplexity(formData);
            navigation(ADMIN_PAGE);

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingErrors = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
                        ...validationErrors,
                        ...formattingErrors
                    });
                } else {
                    setError(error.response.data.message);
                }
            }
        }
    }


    return (
        <Form>
            <Form.Group controlId={"complexityTitle"} className={"mb-3"}>
                <Form.Label>{t('complexityName')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        type={"text"}
                        placeholder={t('complexityName')}
                        name={"complexityTitle"}
                        required
                        value={complexityData.complexityTitle}
                        onChange={onChange}
                        isInvalid={!!validationErrors.complexityTitle}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        { validationErrors.complexityTitle }
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>
            <Form.Group controlId={"evaluation"} className={"mb-3"}>
                <Form.Label>{t('numericalCoefficient')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        type={"number"}
                        placeholder={t('numericalCoefficient')}
                        name={"evaluation"}
                        required
                        value={complexityData.evaluation}
                        onChange={onChange}
                        isInvalid={!!validationErrors.evaluation}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        { validationErrors.evaluation }
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            {error &&
                <Alert variant={"danger"}>
                    { error }
                </Alert>
            }

            <Button
                className={"w-25"}
                onClick={handleAddComplexity}
            >
                {t('addButton')}
            </Button>
        </Form>
    );
};

export default AdminAddComplexity;