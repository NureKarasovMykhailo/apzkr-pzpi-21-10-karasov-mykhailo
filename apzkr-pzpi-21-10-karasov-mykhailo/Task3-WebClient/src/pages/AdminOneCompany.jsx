import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCompanyById } from '../API/adminCompany';
import { fetchUsers } from '../API/adminUserApi';
import Loader from '../components/UI/Loader/Loader';
import { Alert, Button, Container, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { createCompany, deleteCompany, updateCompany } from '../API/adminCompanyApi';
import { ADMIN_PAGE } from '../utils/consts';
import getFormattingErrors from '../utils/validationErrorsFormating';

const AdminOneCompany = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState({});
    const [imagePreview, setImagePreview] = useState();
    const [error, setError] = useState('');
    const [companyPreview, setCompanyPreview] = useState({
        companyName: '',
        description: '',
        ownerId: null,
        companyImage: null,
    });
    const [validationErrors, setValidationErrors] = useState({
        companyName: '',
        description: '',
        ownerId: null,
        companyImage: null,
    });
    const [users, setUsers] = useState([{}]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setIsEditing(false);
        fetchCompanyById(id).then((companyResponse) => {
            setCompany(companyResponse.company);
            setCompanyPreview({
                ...companyResponse.company,
            });
            fetchUsers(999, 1).then((userResponse) => {
                setUsers(userResponse.users);
                setIsLoading(false);
            });
        });
    }, []);

    console.log(companyPreview);

    const onChange = (e) => {
        if (e.target.type === 'file') {
            setCompanyPreview({
                ...companyPreview,
                companyImage: e.target.files[0],
            });

            const reader = new FileReader();

            reader.onload = () => {
                setImagePreview(reader.result);
            };

            if (companyPreview.userImage) {
                reader.readAsDataURL(e.target.files[0]);
            }
        } else {
            setCompanyPreview({
                ...companyPreview,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleCancel = () => {
        setCompanyPreview({
            ...company,
        });
        setIsEditing(false);
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('companyName', companyPreview.companyName);
            formData.append('description', companyPreview.description);
            formData.append('companyImage', companyPreview.companyImage);

            if (companyPreview.ownerId) {
                formData.append('userId', companyPreview.ownerId);
            } else {
                formData.append('userId', null);
            }

            const response = await updateCompany(id, formData);
            setCompanyPreview({
                ...response.company,
            });
            setCompany(response.company);
            setIsEditing(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingErrors = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
                        ...formattingErrors,
                    });
                } else {
                    setError(error.response.data.message);
                }
            }
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCompany(id);
            navigation(ADMIN_PAGE);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        isLoading ? (
            <Container className={'w-100 min-vh-100 border mt-3 mb-3 d-flex align-items-center'}>
                <Loader />
            </Container>
        ) : (
            <Container className={'w-100 min-vh-100 border mt-3 mb-3 border p-3'}>
                <div>
                    <h2>{t('company')}</h2>
                </div>
                <Form>
                    <Form.Group controlId={'companyName'} className={'mb-3'}>
                        <Form.Label>{t('companyName')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={'text'}
                                placeholder={t('companyNamePlaceholder')}
                                name={'companyName'}
                                required
                                value={companyPreview.companyName}
                                onChange={onChange}
                                isInvalid={!!validationErrors.companyName}
                                disabled={!isEditing}
                            />
                            <Form.Control.Feedback type={'invalid'}>
                                {validationErrors.companyName}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId={'description'} className={'mb-3'}>
                        <Form.Label>{t('description')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                as={'textarea'}
                                placeholder={t('descriptionPlaceholder')}
                                name={'description'}
                                required
                                value={companyPreview.description}
                                onChange={onChange}
                                isInvalid={!!validationErrors.description}
                                disabled={!isEditing}
                            />
                            <Form.Control.Feedback type={'invalid'}>
                                {validationErrors.description}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId={'companyImage'} className={'mb-3'}>
                        <Form.Label>{t('companyImage')}</Form.Label>
                        <div className={'p-3'}>
                            {imagePreview ? (
                                <img
                                    style={{ maxHeight: '250px', width: 'auto', borderRadius: '5px' }}
                                    src={imagePreview}
                                    alt={'Error while loading image'}
                                />
                            ) : (
                                <img
                                    style={{ maxHeight: '250px', width: 'auto', borderRadius: '5px' }}
                                    src={process.env.REACT_APP_API_URL + company.companyImage}
                                    alt="Error while loading image"
                                />
                            )}
                        </div>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={'file'}
                                name={'companyImage'}
                                onChange={onChange}
                                disabled={!isEditing}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId={'userId'} className={'mb-3'}>
                        <Form.Label>{t('userId')}</Form.Label>
                        <Form.Select
                            name={'ownerId'}
                            onChange={onChange}
                            value={companyPreview.ownerId}
                            disabled={!isEditing}
                        >
                            <option value={null}>{t('unassignedUser')}</option>
                            {users.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.email}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {error && (
                        <Alert variant={'danger'}>
                            {error}
                        </Alert>
                    )}

                    {isEditing ? (
                        <div>
                            <Button className={'m-sm-1'} onClick={handleUpdate}>
                                {t('acceptButton')}
                            </Button>
                            <Button variant={'danger'} onClick={handleCancel}>
                                {t('cancelButton')}
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Button variant={'secondary'} onClick={() => setIsEditing(true)}>
                                {t('editButton')}
                            </Button>
                            <Button className ={'m-sm-1'} variant={'danger'} onClick={handleDelete}>
                                {t('deleteButton')}
                            </Button>
                        </div>
                    )}

                </Form>
            </Container>
        )
    );
};

export default AdminOneCompany;

