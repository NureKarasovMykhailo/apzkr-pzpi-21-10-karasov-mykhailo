import React, {useEffect, useState} from 'react';
import {Alert, Button, Form, InputGroup} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {fetchUsers} from "../../../API/adminUserApi";
import getFormattingErrors from "../../../utils/validationErrorsFormating";
import {createComplexity} from "../../../API/complexityApi";
import {ADMIN_PAGE} from "../../../utils/consts";
import {createCompany} from "../../../API/adminCompanyApi";

const AdminAddCompanyForm = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([{}]);
    const [companyData, setCompanyData] = useState({
        companyName: '',
        description: '',
        companyImage: null,
        userId: null
    });
    const [validationErrors, setValidationErrors] = useState({
        companyName: '',
        description: '',
        companyImage: null,
        userId: null
    });
    const [error, setError] = useState('');

    const onChange = (e) => {
        if (e.target.type === 'file') {
            setCompanyData({
                ...companyData,
                companyImage: e.target.files[0]
            });
        } else {
            setCompanyData({
                ...companyData,
                [e.target.name]: e.target.value
            });
        }
    }

    const handleCreateCompanyClick = async () => {
        try {
            const formData = new FormData();
            formData.append('companyName', companyData.companyName);
            formData.append('description', companyData.description);
            formData.append('companyImage', companyData.companyImage);
            if (companyData.userId) {
                formData.append('userId', companyData.userId);
            }

            await createCompany(formData);
            navigation(ADMIN_PAGE);

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingErrors = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
                        ...formattingErrors
                    });
                } else {
                    setError(error.response.data.message);
                }
            }
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchUsers(999, 1).then(response => {
            setUsers(response.users);
            setIsLoading(false);
        });
    }, []);

    return (
        <Form>
            <Form.Group controlId={"companyName"} className={"mb-3"}>
                <Form.Label>{t('companyName')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        type={"text"}
                        placeholder={t('companyName')}
                        name={"companyName"}
                        required
                        value={companyData.companyName}
                        onChange={onChange}
                        isInvalid={!!validationErrors.companyName}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        { validationErrors.companyName }
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>
            <Form.Group controlId={"description"} className={"mb-3"}>
                <Form.Label>{t('description')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        as={"textarea"}
                        placeholder={t('description')}
                        name={"description"}
                        required
                        value={companyData.description}
                        onChange={onChange}
                        isInvalid={!!validationErrors.description}
                    />
                    <Form.Control.Feedback type={"invalid"}>
                        { validationErrors.description }
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <Form.Group controlId={'companyImage'} className={"mb-3"}>
                <Form.Label>{t('companyLogo')}</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        type={"file"}
                        name={"companyImage"}
                        onChange={onChange}
                    />
                </InputGroup>
            </Form.Group>

            <Form.Group controlId={"userId"} className={"mb-3"}>
                <Form.Label>{t('userId')}</Form.Label>
                <Form.Select
                    name={"userId"}
                    onChange={onChange}
                >
                    <option value={null}>{t('dontUnpinToUser')}</option>
                    { users.map(user => (
                        <option
                            key={user.id}
                            value={user.id}
                        >
                            { user.email }
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
                onClick={handleCreateCompanyClick}
            >
                {t('addButton')}
            </Button>
        </Form>
    );
};

export default AdminAddCompanyForm;