import React, {useContext, useState} from 'react';
import {Alert, Button, Form} from "react-bootstrap";
import {authorization} from "../../../API/authApi";
import {MAIN_PAGE_PATH, REGISTRATION_PAGE_PATH, UNEXPECTED_ERROR} from "../../../utils/consts";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import {decodeToken} from "react-jwt";
import {useTranslation} from "react-i18next";

const AuthForm = observer(() => {
    const { t } = useTranslation();
    const [authData, setAuthData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const { userStore } = useContext(Context);
    const navigation = useNavigate();

    const handleChange = (e) => {
        setAuthData({
            ...authData,
            [e.target.name]: e.target.value
        })
    }

    const handleAuthClick = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('email', authData.email);
            formData.append('password', authData.password);
            const response = await authorization(formData);
            if (response.token) {
                localStorage.setItem('token', response.token);
                userStore.setUser(decodeToken(response.token));
                userStore.setIsAuth(true);
                navigation(MAIN_PAGE_PATH);
            }
        } catch (error) {
            if (error.response && error.response.status === 400){
                setError(error.response.data.message);
            } else {
                setError(UNEXPECTED_ERROR);
            }
        }
    }

    return (
        <Form>
            <Form.Group className={"mb-3"} controlId={"authFormEmail"}>
                <Form.Label>Email</Form.Label>
                <Form.Control name={"email"} type={"email"} placeholder={"Email"} onChange={handleChange}/>
                <Form.Control.Feedback type={'invalid'}>{t('enterEmail')}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className={"mb-3"} controlId={"authPassword"}>
                <Form.Label>{t('password')}</Form.Label>
                <Form.Control name={"password"} type={"password"} placeholder={t('password')} onChange={handleChange}/>
            </Form.Group>
            <p className={"mb-2"}>{t('dontHaveAccount')} <Link to={REGISTRATION_PAGE_PATH}>{t('registration!')}</Link></p>
            {error && (
                <Alert variant={"danger"}>
                    {error}
                </Alert>
            )}
            <Button variant={"primary"} type={"button"} className={"col-md-3"} onClick={handleAuthClick}>
                {t('enter')}
            </Button>
        </Form>
    );
});

export default AuthForm;