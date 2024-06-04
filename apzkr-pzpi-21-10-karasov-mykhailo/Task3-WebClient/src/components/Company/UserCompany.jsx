import React, {useEffect, useState} from 'react';
import {Alert, Button, Container, Form, InputGroup} from "react-bootstrap";
import { useTranslation} from "react-i18next";
import {deleteCompanyByToken, fetchCompanyByToken, updateCompany} from "../../API/companyApi";
import Loader from "../UI/Loader/Loader";
import getFormattingErrors from "../../utils/validationErrorsFormating";
import {useNavigate} from "react-router-dom";
import {ACTIVITIES_LIST_PAGE, COMPANY_SCANNERS, MAIN_PAGE_PATH, WORKER_PAGE} from "../../utils/consts";
import {hasUserRole} from "../../utils/hasUserRole";
import {RoleEnum} from "../../utils/enums/RoleEnum";

const UserCompany = ({ userRoleTitles }) => {
    const { t } = useTranslation();
    const navigation = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCancel, setIsCancel] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState({
        companyName: ''
    });
    const [companyData, setCompanyData] = useState({});

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

    useEffect(() => {
        try {
            fetchCompanyByToken().then(response => {
                setCompanyData(response.company)
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error);
        }
    }, [isCancel]);

    const handleUpdateClick = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setValidationErrors({
                companyName: ''
            });
            const formData = new FormData();
            formData.append('companyName', companyData.companyName);
            formData.append('description', companyData.description);
            formData.append('companyImage', companyData.companyImage);

            const response = await updateCompany(formData);
            console.log(response);

            setIsEdit(false);
        } catch (error) {
            console.log(error);
            if (error.response) {
                if (error.response.status === 409) {
                    setError(error.response.data.message);
                } else if (error.response.status === 400) {
                    const formattingErrors = getFormattingErrors(error.response.data.message)
                    setValidationErrors({
                        ...validationErrors,
                        ...formattingErrors
                    });
                }
            }
        }
    }

    const handleDeleteCompanyClick = async (e) => {
        e.preventDefault();
        try {
            const response = await deleteCompanyByToken();

            if (response.token) {
                localStorage.clear();
                localStorage.setItem('token', response.token);
            }

            navigation(MAIN_PAGE_PATH);

        } catch (error) {
            console.log(error);
        }
    }

    const handleCancelClick = () => {
        setIsEdit(false);
        setIsLoading(true);
        setIsCancel(true);
    }



    return (
        !isLoading ?
            <Container className={"p-3"}>
                <Form className={"d-flex w-100 justify-content-between align-items-center"}>
                    <div className={"w-30 p-3"}>
                        <Form.Group className={"p-3"}>
                            <Form.Label>{t('companyLogo')}</Form.Label>
                        </Form.Group>
                        <div className={"p-3"}>
                            {imagePreview ?
                                <img
                                    style={{maxHeight: "250px", width: "auto", borderRadius: "5px"}}
                                    src={imagePreview}
                                    alt={"Error while loading image"}
                                />
                                :
                                <img
                                    style={{maxHeight: "250px", width: "auto", borderRadius: "5px"}}
                                    src={process.env.REACT_APP_API_URL + companyData.companyImage}
                                    alt="Error while loading image"
                                />
                            }
                        </div>
                        <Form.Control
                            name={"companyImage"}
                            type={"file"}
                            disabled={!isEdit}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={"w-100"}>
                        <Form.Group controlId={"companyName"}>
                            <Form.Label>{t('companyName')}</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    name={"companyName"}
                                    type={"text"}
                                    value={companyData.companyName}
                                    isInvalid={!!validationErrors.companyName}
                                    disabled={!isEdit}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type={"invalid"}>
                                    { validationErrors.companyName }
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId={"description"}>
                            <Form.Label>{t('description')}</Form.Label>
                            <Form.Control
                                as={"textarea"}
                                value={companyData.description}
                                disabled={!isEdit}
                                onChange={handleChange}
                                name={"description"}
                            />
                        </Form.Group>
                    </div>
                </Form>
                <div className={"w-100 d-flex justify-content-end flex-column"}>
                    { error &&
                        <Alert variant={"danger"}>{error}</Alert>
                    }
                    { hasUserRole(userRoleTitles, [RoleEnum.SUBSCRIBER]) && (
                        !isEdit ? (
                            <div className={"w-100 d-flex justify-content-end"}>
                                <Button
                                    className={"w-10 m-1"}
                                    onClick={() => setIsEdit(true)}
                                    variant={"success"}
                                >
                                    {t('editButton')}
                                </Button>
                                <Button
                                    className={"w-10 m-1"}
                                    variant={"danger"}
                                    onClick={handleDeleteCompanyClick}
                                >
                                    {t('deleteButton')}
                                </Button>
                            </div>
                        ) : (
                            <div className={"w-100 d-flex justify-content-end"}>
                                <Button
                                    className={"w-10 m-1 "}
                                    onClick={handleUpdateClick}
                                >
                                    {t('acceptButton')}
                                </Button>
                                <Button
                                    className={"w-10 m-1"}
                                    variant={"danger"}
                                    onClick={handleCancelClick}
                                >
                                    {t('cancelButton')}
                                </Button>
                            </div>
                        )
                    )}


                    <div>
                        <hr />
                        <div className={"w-100 d-flex justify-content-center"}>
                            <h3>{t('companyManagement')}</h3>
                        </div>
                        <div className={"w-100 d-flex justify-content-between p-3"}>
                            <Button onClick={() => navigation(WORKER_PAGE)} className={"m-1 w-100"}>{t('workers')}</Button>
                            <Button onClick={() => navigation(ACTIVITIES_LIST_PAGE)} className={"m-1 w-100"}>{t('activities')}</Button>
                            <Button onClick={() => navigation(COMPANY_SCANNERS)} className={"m-1 w-100"}>{t('scanners')}</Button>
                        </div>
                    </div>
                </div>


            </Container>
            :
            <Container>
                <Loader />
            </Container>
    );
};

export default UserCompany;