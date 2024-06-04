import React from 'react';
import {Container} from "react-bootstrap";
import AdminEducationForm from "../components/forms/AdminEducationForm/AdminEducationForm";
import {useTranslation} from "react-i18next";

const AdminAddEducation = () => {
    const { t } = useTranslation();

    return (
        <Container className={"w-100 min-vh-100 border mt-3 mb-3 p-3"}>
            <div>
                <h2>{t('addEducation')}</h2>
            </div>
            <div>
                <AdminEducationForm />
            </div>
        </Container>
    );
};

export default AdminAddEducation;