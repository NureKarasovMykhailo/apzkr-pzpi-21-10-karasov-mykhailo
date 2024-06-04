import React, {useState} from 'react';
import {Button, Form} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {createScanner} from "../../../API/scannerApi";

const AddScannerForm = ({ companiesUser, onScannerAdd }) => {
    const { t } = useTranslation();

    const [scannerInfo, setScannerInfo] = useState({
        description: '',
        userId: null
    });

    const handleCreateScanner = async () => {
        try {
            const formData = new FormData();
            formData.append('userId', scannerInfo.userId);
            formData.append('description', scannerInfo.description);
            const response = await createScanner(formData);
            onScannerAdd(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form className={"p-1"}>
            <Form.Group
                className={"mb-3"}
                controlId={"description"}
            >
                <Form.Label>{t('description')}</Form.Label>
                <Form.Control
                    as={"textarea"}
                    name={"description"}
                    value={scannerInfo.description}
                    onChange={(e) => setScannerInfo({...scannerInfo, description: e.target.value})}
                />
            </Form.Group>
            <Form.Group
                className={"mb-3"}
                controlId={"userId"}
            >
                <Form.Label>{t('worker')}</Form.Label>
                <Form.Select
                    value={scannerInfo.userId}
                    onChange={(e) => setScannerInfo({...scannerInfo, userId: e.target.value})}
                >
                    <option value={null} selected={!scannerInfo.userId}>{t('unassignedScanner')}</option>
                    { companiesUser.map(user => (
                        <option
                            key={user.id}
                            value={user.id}
                            selected={user.id === scannerInfo.userId}
                        >
                            {user.email}
                        </option>
                    )) }
                </Form.Select>
            </Form.Group>

            <Button
                onClick={handleCreateScanner}
            >
                {t('addButton')}
            </Button>
        </Form>
    );
};

export default AddScannerForm;