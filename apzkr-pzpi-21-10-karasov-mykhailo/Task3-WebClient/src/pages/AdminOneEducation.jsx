import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { deleteEducationById, fetchEducationById, updateEducation } from "../API/educationApi";
import { Alert, Button, Container, Form, InputGroup } from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import { useTranslation } from "react-i18next";
import getFormattingErrors from "../utils/validationErrorsFormating";
import { ADMIN_PAGE } from "../utils/consts";

const AdminOneEducation = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const { id } = useParams();
    const [education, setEducation] = useState();
    const [error, setError] = useState('');
    const [educationPreview, setEducationPreview] = useState({
        educationTitle: '',
        description: '',
    });
    const [validationErrors, setValidationErrors] = useState({
        educationTitle: '',
        description: '',
    });
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setIsEdit(false);
        fetchEducationById(id).then(response => {
            setEducation(response.education);
            setEducationPreview({
                ...response.education
            });
            setIsLoading(false);
        })
    }, []);

    const handleChange = (e) => {
        setEducationPreview({
            ...educationPreview,
            [e.target.name]: e.target.value
        });
    }

    const handleCancelClick = () => {
        setEducationPreview({
            ...education
        });
        setIsEdit(false);
    }

    const handleUpdateClick = async () => {
        try {
            const formData = new FormData();
            formData.append('educationTitle', educationPreview.educationTitle);
            formData.append('description', educationPreview.description);
            const response = await updateEducation(id, formData);
            setEducationPreview({
                ...response.education
            });
            setIsEdit(false);
            setError('');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingError = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
                        ...formattingError
                    });
                } else {
                    setError(error.response.data.message);
                }
            }
        }
    }

    const handleDeleteClick = async () => {
        try {
            await deleteEducationById(id);
            navigation(ADMIN_PAGE);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        isLoading ?
            <Container className={"w-100 min-vh-100 border mt-3 mb-3 p-3 d-flex justify-content-center align-items-center"}>
                <Loader />
            </Container>
            :
            <Container className={"w-100 min-vh-100 mt-3 mb-3 p-3 border"}>
                <div>
                    <h2>{t('education')}</h2>
                </div>

                <Form>
                    <Form.Group controlId={"educationTitle"} className={"mb-3"}>
                        <Form.Label>{t('educationTitle')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={"text"}
                                placeholder={t('educationTitlePlaceholder')}
                                name={"educationTitle"}
                                required
                                value={educationPreview.educationTitle}
                                onChange={handleChange}
                                isInvalid={!!validationErrors.educationTitle}
                                disabled={!isEdit}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                {validationErrors.educationTitle}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId={"description"} className={"mb-3"}>
                        <Form.Label>{t('description')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                as={"textarea"}
                                placeholder={t('descriptionPlaceholder')}
                                name={"description"}
                                required
                                value={educationPreview.description}
                                onChange={handleChange}
                                isInvalid={!!validationErrors.description}
                                disabled={!isEdit}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                {validationErrors.description}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    {error &&
                        <Alert variant={"danger"}>
                            {error}
                        </Alert>
                    }

                    {isEdit ?
                        <div>
                            <Button
                                className={"m-sm-1"}
                                onClick={handleUpdateClick}
                            >
                                {t('acceptButton')}
                            </Button>
                            <Button
                                variant={"danger"}
                                onClick={handleCancelClick}
                            >
                                {t('cancelButton')}
                            </Button>
                        </div>
                        :
                        <div>
                            <Button
                                variant={"secondary"}
                                onClick={() => setIsEdit(true)}
                            >
                                {t('editButton')}
                            </Button>
                            <Button
                                className={"m-sm-1"}
                                variant={"danger"}
                                onClick={handleDeleteClick}
                            >
                                {t('deleteButton')}
                            </Button>
                        </div>
                    }
                </Form>

            </Container>

    );
};

export default AdminOneEducation;
