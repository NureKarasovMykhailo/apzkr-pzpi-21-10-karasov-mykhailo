import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Alert, Button, Form, InputGroup} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import getFormattingErrors from "../../../utils/validationErrorsFormating";
import {addEducation} from "../../../API/educationApi";
import {ADMIN_PAGE} from "../../../utils/consts";

const AdminEducationForm = () => {
    const navigation = useNavigate();
    const { t } = useTranslation();

    const [educationData, setEducationData] = useState({
        educationTitle: '',
        description: ''
    });
    const [validationErrors, setValidationErrors] = useState({
        educationTitle: '',
        description: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setEducationData({
            ...educationData,
            [e.target.name]: e.target.value
        });
    }

    const handleClick = async () => {
        try {
            const formData = new FormData();
            formData.append('educationTitle', educationData.educationTitle);
            formData.append('description', educationData.description);
            await addEducation(formData);
            navigation(ADMIN_PAGE);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingErrors = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
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
            <Form.Group controlId={"educationTitle"} className={"mb-3 mt-3"}>
                <Form.Label>{t('educationName')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        type={"text"}
                        placeholder={t('educationName')}
                        name={"educationTitle"}
                        required
                        value={educationData.educationTitle}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.educationTitle}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        { validationErrors.educationTitle }
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>
            <Form.Group controlId={"description"} className={"mb-3"}>
                <Form.Label>{t('description')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        as={"textarea"}
                        placeholder={t('description')}
                        name={"description"}
                        required
                        value={educationData.description}
                        onChange={handleChange}
                        isInvalid={!!validationErrors.description}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        { educationData.description }
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
                onClick={handleClick}
            >
                {t('addButton')}
            </Button>
        </Form>
    );
};

export default AdminEducationForm;