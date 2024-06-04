import React, {useState} from 'react';
import {Alert, Button, Card, Container, Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import '../styles/AddCompanyPage.css';
import {createCompany} from "../API/companyApi";
import {useTranslation} from "react-i18next";
import getFormattingErrors from "../utils/validationErrorsFormating";
import {useNavigate} from "react-router-dom";
import {MAIN_PAGE_PATH} from "../utils/consts";
import Loader from "../components/UI/Loader/Loader";

const AddCompanyPage = () => {

    const { t } = useTranslation();
    const navigation = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [companyData, setCompanyData] = useState({
        companyName: '',
        description: '',
        companyImage: {}
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        companyName: ''
    });

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setCompanyData({
                ...companyData,
                companyImage: e.target.files[0]
            });

            const reader = new FileReader();

            reader.onload = () => {
                setImagePreview(reader.result);
            }

            if (companyData.companyImage) {
                reader.readAsDataURL(e.target.files[0]);
            }
        } else {
            setCompanyData({
                ...companyData,
                [e.target.name]: e.target.value
            });
        }
    }

    const handleCreateCompany = async (e) => {
        try {
            setIsLoading(true);
            setError('');
            setValidationErrors({
                companyName: ''
            })
            const formData = new FormData();
            formData.append('companyName', companyData.companyName);
            formData.append('description', companyData.description);
            formData.append('companyImage', companyData.companyImage);

            const response = await createCompany(formData);
            console.log(response)

            if (response.token) {
                console.log(response.token)
                localStorage.clear();
                localStorage.setItem('token', response.token);
            }

            navigation(MAIN_PAGE_PATH);

        } catch (error) {
            console.log(error);
            setIsLoading(false);
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingErrors = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
                        ...validationErrors,
                        ...formattingErrors
                    });
                } else if (error.response.status === 409) {
                    setError(error.response.data.message);
                }
            }
        }
    }

    return (
        !isLoading ?
            <Card className={"h-100 border p-4 add-company__container"}>
                <div className={"w-100 d-flex justify-content-center"}>
                    <h3>{t('companyCreating')}</h3>
                </div>

                <Form className={"w-75 h-100"}>
                    <Form.Group className={"mb-3"} controlId={"companyName"}>
                        <Form.Label>{t('companyName')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                name={"companyName"}
                                type={"text"}
                                placeholder={t('enterCompanyName')}
                                onChange={handleChange}
                                isInvalid={!!validationErrors.companyName}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                { validationErrors.companyName }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className={"mb-3"} controlId={"description"}>
                        <Form.Label>{t('description')}</Form.Label>
                        <Form.Control
                            as={"textarea"}
                            placeholder={t('description')}
                            name={"description"}
                            value={companyData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>



                    <FormGroup className={"mb-3"} controlId={"companyImage"}>
                        <FormLabel>{t('companyLogo')}</FormLabel>
                        <Form.Control type={"file"} onChange={handleChange}/>
                    </FormGroup>
                    {imagePreview &&
                        <div className={"add-company__logo-preview"}>
                            <img
                                className={"add-company__logo-preview-image"}
                                src={imagePreview}
                                alt={"Error while loading image"}/>
                        </div>
                    }

                    {error &&
                        <Alert variant={"danger"}> {error} </Alert>
                    }

                    <Button
                        className={"w-50"}
                        type={"button"}
                        onClick={handleCreateCompany}
                    >
                        {t('addButton')}
                    </Button>
                </Form>
            </Card>
            :
            <Container className={"w-100 h-100"}>
                <Loader />
            </Container>

    );
};

export default AddCompanyPage;