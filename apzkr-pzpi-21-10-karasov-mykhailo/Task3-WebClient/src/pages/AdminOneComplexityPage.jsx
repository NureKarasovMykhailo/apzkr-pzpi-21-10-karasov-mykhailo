import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Container, Form, InputGroup } from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import { deleteComplexity, fetchComplexityById, updateComplexity } from "../API/complexityApi";
import { useTranslation } from "react-i18next";
import getFormattingErrors from "../utils/validationErrorsFormating";
import { ADMIN_PAGE } from "../utils/consts";

const AdminOneComplexityPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [complexity, setComplexity] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState('');
    const [complexityPreview, setComplexityPreview] = useState({
        complexityTitle: '',
        evaluation: 0
    });
    const [validationErrors, setValidationErrors] = useState({
        complexityTitle: '',
        evaluation: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setIsEdit(false);
        fetchComplexityById(id).then(response => {
            setComplexity(response.complexity);
            setComplexityPreview({
                ...response.complexity
            });
            setIsLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        setComplexityPreview({
            ...complexityPreview,
            [e.target.name]: e.target.value
        });
    };

    const handleCancelClick = () => {
        setIsEdit(false);
        setComplexityPreview({
            ...complexity
        });
    };

    const handleUpdateClick = async () => {
        try {
            const formData = new FormData();
            formData.append('complexityTitle', complexityPreview.complexityTitle);
            formData.append('evaluation', complexityPreview.evaluation);

            const response = await updateComplexity(id, formData);
            setComplexityPreview({
                ...response.complexity
            });
            setComplexity(response.complexity);
            setIsEdit(false);
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
    };

    const handleDeleteClick = async () => {
        try {
            await deleteComplexity(id);
            navigation(ADMIN_PAGE);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        isLoading ?
            <Container className={"w-100 min-vh-100 border mt-3 mb-3 p-3 d-flex justify-content-center align-items-center"}>
                <Loader />
            </Container>
            :
            <Container className={"w-100 min-vh-100 border mt-3 mb-3 p-3"}>
                <div>
                    <h2>{t('complexity')}</h2>
                </div>
                <Form>
                    <Form.Group controlId={"complexityTitle"} className={"mb-3"}>
                        <Form.Label>{t('complexityTitle')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={"text"}
                                placeholder={t('complexityTitlePlaceholder')}
                                name={"complexityTitle"}
                                required
                                value={complexityPreview.complexityTitle}
                                onChange={handleChange}
                                isInvalid={!!validationErrors.complexityTitle}
                                disabled={!isEdit}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                {validationErrors.complexityTitle}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId={"evaluation"} className={"mb-3"}>
                        <Form.Label>{t('evaluation')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={"number"}
                                placeholder={t('evaluationPlaceholder')}
                                name={"evaluation"}
                                required
                                value={complexityPreview.evaluation}
                                onChange={handleChange}
                                isInvalid={!!validationErrors.evaluation}
                                disabled={!isEdit}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                {validationErrors.evaluation}
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

export default AdminOneComplexityPage;
