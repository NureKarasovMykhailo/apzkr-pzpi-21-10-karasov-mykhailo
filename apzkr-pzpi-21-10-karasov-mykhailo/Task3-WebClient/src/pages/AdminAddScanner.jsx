import React from 'react';
import {Container} from "react-bootstrap";
import AdminAddScannerForm from "../components/forms/AdminAddScannerForm/AdminAddScannerForm";
import {useTranslation} from "react-i18next";

const AdminAddScanner = () => {
    const { t } = useTranslation();

    return (
        <Container className={"mt-3 mb-3 p-3 border min-vh-100"}>
            <div>
                <h2>{t('addScanner')}</h2>
            </div>
            <AdminAddScannerForm />
        </Container>
    );
};

export default AdminAddScanner;