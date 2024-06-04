import React, {useContext, useState} from 'react';
import {Alert, Button, Form, InputGroup} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {AUTH_PAGE_PATH, MAIN_PAGE_PATH} from "../../../utils/consts";
import {registration} from "../../../API/authApi";
import getFormattingErrors from "../../../utils/validationErrorsFormating";
import {decodeToken} from "react-jwt";
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import {useTranslation} from "react-i18next";

const RegistrationForm = observer(() => {
    const { t } = useTranslation();

    const [registrationData, setRegistrationData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        secondName: '',
        birthday: '',
        phoneNumber: ''
    });

    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: '',
        firstName: '',
        secondName: '',
        birthday: '',
        phoneNumber: ''
    });

    const navigation = useNavigate();
    const { userStore } = useContext(Context);
    const onChange = (e) => {
        setRegistrationData({
            ...registrationData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegistration = async () => {
        try {
            const formData = new FormData();
            formData.append('email', registrationData.email);
            formData.append('password', registrationData.password);
            formData.append('passwordConfirm', registrationData.passwordConfirm);
            formData.append('firstName', registrationData.firstName);
            formData.append('secondName', registrationData.secondName);
            formData.append('birthday', registrationData.birthday);
            formData.append('phoneNumber', registrationData.phoneNumber);

            const response = await registration(formData);
            if (response.token) {
                localStorage.setItem('token', response.token);
                userStore.setUser(decodeToken(response.token));
                userStore.setIsAuth(true);
                navigation(MAIN_PAGE_PATH);
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    setError(error.response.data.message);
                } else if (error.response.status === 400) {
                    if (error.response.data.message === 'Паролі не збігаються') {
                        setError(error.response.data.message);
                    } else {
                        const formattingErrors = getFormattingErrors(error.response.data.message)
                        setValidationErrors({
                            ...validationErrors,
                            ...formattingErrors
                        });
                    }
                }
            }
        }
    }

    return (
        <Form>
            <Form.Group className={"mb-3"} controlId={"email"}>
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        name={"email"}
                        type={"email"}
                        placeholder={"Email"}
                        onChange={onChange}
                        isInvalid={!!validationErrors.email}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        {validationErrors.email}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <Form.Group className={"mb-3"} controlId={"password"}>
                <Form.Label>{t('password')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        name={"password"}
                        type={"password"}
                        placeholder={t('password')}
                        onChange={onChange}
                        isInvalid={!!validationErrors.password}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        {validationErrors.password}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <Form.Group className={"mb-3"} controlId={"passwordConfirm"}>
                <Form.Label>{t('passwordConfirm')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        name={"passwordConfirm"}
                        type={"password"}
                        placeholder={t('passwordConfirm')}
                        onChange={onChange}
                    />
                </InputGroup>
            </Form.Group>

            <Form.Group className={"mb-3"} controlId={"firstName"}>
                <Form.Label>{t('name')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control name={"firstName"} type={"text"} placeholder={t('name')} onChange={onChange} isInvalid={!!validationErrors.firstName}/>
                    <Form.Control.Feedback>
                        { validationErrors.firstName }
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <Form.Group className={"mb-3"} controlId={"secondName"}>
                <Form.Label>{t('surname')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control name={"secondName"} type={"text"} placeholder={t('surname')} onChange={onChange} isInvalid={!!validationErrors.secondName}/>
                    <Form.Control.Feedback>
                        { validationErrors.secondName }
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <Form.Group className={"mb-3"} controlId={"birthday"}>
                <Form.Label>{t('birthday')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control name={"birthday"} type={"date"} placeholder={t('birthday')} onChange={onChange} isInvalid={!!validationErrors.birthday}/>
                    <Form.Control.Feedback>
                        { validationErrors.birthday }
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <Form.Group className={"mb-3"} controlId={"phoneNumber"}>
                <Form.Label>{t('phoneNumber')}</Form.Label>
                <Form.Control name={"phoneNumber"} type={"text"} placeholder={t('phoneNumber')} onChange={onChange}/>
            </Form.Group>
            <p className={"mb-2"}>{t('haveAccount')} <Link to={AUTH_PAGE_PATH}>{t('authorize!')}</Link></p>
            {error && (
                <Alert variant={"danger"}>
                    { error }
                </Alert>
            )}
            <Button variant={"primary"} className={"col-md-12 mb-3"} onClick={handleRegistration} type={"button"}>
                {t('registrationButton')}
            </Button>
        </Form>
    );
});

export default RegistrationForm;