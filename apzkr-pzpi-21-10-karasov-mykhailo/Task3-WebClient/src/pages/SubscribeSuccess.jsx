import React from 'react';
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PROFILE_PAGE_PATH } from "../utils/consts";
import { useTranslation } from 'react-i18next';

const SubscribeSuccess = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    return (
        <Container className={"h-100 w-100 d-flex justify-content-center align-items-center p-4 flex-column"} style={{ minHeight: '50vh' }}>
            <div className={"mb-3"}>
                <h2>{t('subscribeSuccess')}</h2>
            </div>
            <div>
                <p style={{ fontSize: "20px" }}>{t('subscribeInfo')}</p>
            </div>
            <div className={"p-3"}>
                <Button onClick={() => navigation(PROFILE_PAGE_PATH)}>{t('goToProfile')}</Button>
            </div>
        </Container>
    );
};

export default SubscribeSuccess;
