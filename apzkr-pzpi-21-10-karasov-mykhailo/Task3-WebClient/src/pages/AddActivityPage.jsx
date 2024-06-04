import React from 'react';
import {Container} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import AddActivityForm from "../components/forms/AddActivityForm/AddActivityForm";

const AddActivityPage = () => {
    const { t } = useTranslation();

    return (
        <Container className={"w-100 min-vh-100 border mt-3 mb-3 p-3"}>
            <div>
                <h2>{t('addingActivity')}</h2>
            </div>
            <div className={"mt-3"}>
                <AddActivityForm />
            </div>
        </Container>
    );
};

export default AddActivityPage;