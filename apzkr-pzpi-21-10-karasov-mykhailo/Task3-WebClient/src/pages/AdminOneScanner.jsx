import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchUsers } from "../API/adminUserApi";
import { fetchCompanies } from "../API/adminCompanyApi";
import { deleteScanner, getScannerById, updateScanner } from "../API/adminScannerApi";
import { Alert, Button, Container, Form } from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import { ADMIN_PAGE } from "../utils/consts";

const AdminOneScanner = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [scanner, setScanner] = useState();
    const [scannerData, setScannerData] = useState({
        description: '',
        userId: null,
        companyId: null
    });
    const [users, setUsers] = useState([{}]);
    const [companies, setCompanies] = useState([{}]);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setIsEditing(false);
        fetchUsers(999, 1).then(userResponse => {
            setUsers(userResponse.users);
            fetchCompanies(999, 1).then(companyResponse => {
                setCompanies(companyResponse.companies);
                getScannerById(id).then(scannerResponse => {
                    setScanner(scannerResponse.scanner);
                    setScannerData({
                        ...scannerResponse.scanner
                    })
                    setIsLoading(false);
                })
            })
        })
    }, []);

    const onChange = (e) => {
        setScannerData({
            ...scannerData,
            [e.target.name]: e.target.value
        });
    }

    const handleCancelClick = () => {
        setIsEditing(false);
        setScannerData({
            ...scanner
        });
    }

    const handleUpdateClick = async () => {
        try {
            const formData = new FormData();
            formData.append('description', scannerData.description);
            formData.append('userId', scannerData.userId);
            formData.append('companyId', scannerData.companyId);

            const response = await updateScanner(id, formData);
            setScannerData({
                ...response.scanner
            });
            setScanner(response.scanner);
            setIsEditing(false);

        } catch (error) {
            if (error.response) {
                setError(error.response);
            }
        }
    }

    const handleDeleteScanner = async () => {
        try {
            await deleteScanner(id);
            navigation(ADMIN_PAGE);

        } catch (error) {
            console.log(error);
        }
    }


    return (
        isLoading ?
            <Container className={"min-vh-100 border mt-3 mb-3 p-3 d-flex align-items-center"}>
                <Loader />
            </Container>
            :
            <Container className={"min-vh-100 border mt-3 mb-3 p-3"}>
                <div>
                    <h2>{t('scanner')}</h2>
                </div>
                <hr/>
                <Form className={"mt-3"}>
                    <Form.Group className={"mb-3"} controlId={"description"}>
                        <Form.Label>{t('description')}</Form.Label>
                        <Form.Control
                            disabled={!isEditing}
                            as={"textarea"}
                            placeholder={t('description')}
                            name={"description"}
                            value={scannerData.description}
                            onChange={onChange}
                        />
                    </Form.Group>

                    <Form.Group className={"mb-3"} controlId={"companyId"}>
                        <Form.Label>{t('companyName')}</Form.Label>
                        <Form.Select onChange={onChange} name={"companyId"} value={scannerData.companyId} disabled={!isEditing}>
                            { companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.companyName}
                                </option>
                            )) }
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className={"mb-3"} controlId={"userId"}>
                        <Form.Label>{t('userEmail')}</Form.Label>
                        <Form.Select onChange={onChange} name={"userId"} value={scannerData.userId} disabled={!isEditing}>
                            { users.map(user => (
                                <option key={user.id} value={user.id}>
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

                    { isEditing ?
                        <div>
                            <Button
                                onClick={handleUpdateClick}
                                className={"m-sm-1"}
                            >
                                {t('acceptButton')}
                            </Button>
                            <Button
                                variant={"danger"}
                                onClick={handleCancelClick}
                            >
                                {t('cancelButton')}
                            </Button>
                        </div>
                        :
                        <div>
                            <Button
                                onClick={() => setIsEditing(true)}
                                className={"m-sm-1"}
                            >
                                {t('editButton')}
                            </Button>
                            <Button
                                variant={"danger"}
                                onClick={handleDeleteScanner}
                            >
                                {t('deleteButton')}
                            </Button>
                        </div>
                    }

                </Form>
            </Container>
    );
};

export default AdminOneScanner;
