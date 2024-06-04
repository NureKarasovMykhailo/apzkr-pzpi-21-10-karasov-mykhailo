import React from 'react';
import {Container} from "react-bootstrap";
import AdminAddUserForm from "../components/forms/AdminAddUserForm/AdminAddUserForm";
import {useTranslation} from "react-i18next";

const AdminAddUser = () => {
    const { t } = useTranslation();

    return (
        <Container className={"w-100 min-vh-100 border mt-3 mb-3 p-3"}>
            <div className={"mb-3"}>
                <h2>{t('addUser')}</h2>
            </div>
            <div>
                <AdminAddUserForm />
            </div>
        </Container>
    );
};

export default AdminAddUser;