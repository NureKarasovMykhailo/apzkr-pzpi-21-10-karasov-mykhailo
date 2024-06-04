import React from 'react';
import {Container} from "react-bootstrap";
import AdminAddCompanyForm from "../components/forms/AdminAddCompany/AdminAddCompanyForm";
import {useTranslation} from "react-i18next";

const AdminAddCompany = () => {
    const { t } = useTranslation();

    return (
        <Container className={"w-100 min-vh-100 border mt-3 mb-3 p-3"}>
            <div>
                <h2>{t('addCompany')}</h2>
            </div>
            <div className={"mt-3"}>
                <AdminAddCompanyForm />
            </div>
        </Container>
    );
};

export default AdminAddCompany;