import React from 'react';
import {Container} from "react-bootstrap";
import AdminAddScannerHistoryForm from "../components/forms/AdminAddScannerHistoryForm/AdminAddScannerHistoryForm";
import {useTranslation} from "react-i18next";

const AdminAddScannerHistory = () => {
    const { t } = useTranslation();

    return (
        <Container className={"min-vh-100 border mt-3 mb-3 border p-3"}>
            <div>
                <h2>{t('addScannerHistory')}</h2>
            </div>
            <hr />
            <AdminAddScannerHistoryForm />
        </Container>
    );
};

export default AdminAddScannerHistory;