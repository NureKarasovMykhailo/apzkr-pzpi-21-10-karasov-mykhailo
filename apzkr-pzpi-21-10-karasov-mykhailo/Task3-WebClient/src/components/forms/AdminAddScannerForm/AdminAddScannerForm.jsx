import React, {useEffect, useState} from 'react';
import {Alert, Button, Form} from "react-bootstrap";
import Loader from "../../UI/Loader/Loader";
import {fetchCompanies} from "../../../API/adminCompanyApi";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {fetchUsers} from "../../../API/adminUserApi";
import {createScanner} from "../../../API/adminScannerApi";
import {ADMIN_PAGE} from "../../../utils/consts";

const AdminAddScannerForm = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState([{}]);
    const [users, setUsers] = useState([{}]);
    const [scannerData, setScannerData] = useState({
        description: '',
        companyId: null,
        userId: null
    })
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        fetchCompanies(999, 1).then(response => {
            fetchUsers(999, 1).then(userResponse => {
                setCompanies(response.companies);
                setUsers(userResponse.users);
                setIsLoading(false);
            })
        })
    }, []);

    const onChange = (e) => {
        setScannerData({
            ...scannerData,
            [e.target.name]: e.target.value
        });
    }

    const handleCreateScanner = async () => {
        try {
            const formData = new FormData();
            formData.append('userId', scannerData.userId);
            formData.append('companyId', scannerData.companyId);
            formData.append('description', scannerData.description);

            await createScanner(formData);
            navigation(ADMIN_PAGE);

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            }
        }
    }


    return (
        isLoading ?
            <div>
                <Loader />
            </div>
            :
            <Form className={"mt-3"}>
                <Form.Group className={"mb-3"} controlId={"description"}>
                    <Form.Label>{t('description')}</Form.Label>
                    <Form.Control
                        as={"textarea"}
                        placeholder={t('description')}
                        name={"description"}
                        value={scannerData.description}
                        onChange={onChange}
                    />
                </Form.Group>

                <Form.Group className={"mb-3"} controlId={"companyId"}>
                    <Form.Label>{t('companyName')}</Form.Label>
                    <Form.Select onChange={onChange} name={"companyId"} value={scannerData.companyId}>
                        <option value={null}>{t('dontUnpinToUser')}</option>
                        { companies.map(company => (
                            <option value={company.id}>
                                {company.companyName}
                            </option>
                        )) }
                    </Form.Select>
                </Form.Group>

                <Form.Group className={"mb-3"} controlId={"userId"}>
                    <Form.Label>{t('userEmail')}</Form.Label>
                    <Form.Select onChange={onChange} name={"userId"} value={scannerData.userId}>
                        <option value={null}>{t('dontUnpinToUser')}</option>
                        { users.map(user => (
                            <option value={user.id}>
                                {user.email}
                            </option>
                        )) }
                    </Form.Select>
                </Form.Group>

                { error &&
                    <Alert variant={'danger'}>
                        { error }
                    </Alert>
                }

                <Button
                    className={"w-25"}
                    onClick={handleCreateScanner}
                >
                    {t('addButton')}
                </Button>
            </Form>
    );
};

export default AdminAddScannerForm;