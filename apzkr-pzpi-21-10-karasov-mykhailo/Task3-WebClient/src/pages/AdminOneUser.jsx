import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Container, Form, FormGroup, FormLabel, InputGroup, ListGroup } from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import { deleteUser, fetchUserById, updateUser } from "../API/adminUserApi";
import { useTranslation } from "react-i18next";
import { fetchAdminCompany } from "../API/adminCompany";
import getFormattingErrors from "../utils/validationErrorsFormating";
import { ADMIN_PAGE } from "../utils/consts";
import { getRoleTitles } from "../utils/getRoleTitles";
import { addRole, deleteRole } from "../API/userApi";
import { RoleEnum } from "../utils/enums/RoleEnum";
import UserEducation from "../components/AdminComponents/UserEducation";

const AdminOneUser = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [imagePreview, setImagePreview] = useState(null);
    const [update, setUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isRoleAdding, setIsRoleAdding] = useState(false);
    const [user, setUser] = useState();
    const [selectedRole, setSelectedRole] = useState('');
    const [roleError, setRoleError] = useState('');
    const [companies, setCompanies] = useState([{}]);
    const [userPreview, setUserPreview] = useState({
        email: '',
        firstName: '',
        secondName: '',
        birthday: '',
        phoneNumber: '',
        companyId: null
    });
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        firstName: '',
        secondName: '',
        birthday: '',
        phoneNumber: '',
    });
    const [error, setError] = useState('');
    const [roles, setRoles] = useState([{}]);
    const [educations, setEducations] = useState([{}]);

    useEffect(() => {
        setIsLoading(true);
        setIsEditing(false);
        setIsRoleAdding(false);
        setUpdate(false);
        setRoleError('');
        setError('');
        fetchUserById(id).then(response => {
            setUserPreview({
                ...response.user
            });
            setUser(response.user);
            setRoles(response.role);
            setEducations(response.educations)
            fetchAdminCompany(999, 1).then(companyResponse => {
                setCompanies(companyResponse.companies);
                setIsLoading(false);
            })
        });
    }, [update]);

    const onChange = (e) => {
        if (e.target.type === 'file') {
            setUserPreview({
                ...userPreview,
                userImage: e.target.files[0]
            });

            const reader = new FileReader();

            reader.onload = () => {
                setImagePreview(reader.result);
            }

            if (userPreview.userImage) {
                reader.readAsDataURL(e.target.files[0]);
            }
        } else {
            setUserPreview({
                ...userPreview,
                [e.target.name]: e.target.value
            });
        }
    }

    const handleCancelClick = () => {
        setUserPreview({
            ...user
        });
        setIsEditing(false);
    }

    const handleUpdateClick = async () => {
        try {
            const formData = new FormData();
            formData.append('email', userPreview.email);
            formData.append('firstName', userPreview.firstName);
            formData.append('secondName', userPreview.secondName);
            formData.append('password', userPreview.password);
            formData.append('birthday', userPreview.birthday);
            formData.append('phoneNumber', userPreview.phoneNumber);
            if (userPreview.userImage) {
                formData.append('userImage', userPreview.userImage);
            }
            if (userPreview.companyId) {
                formData.append('companyId', userPreview.companyId);
            }

            const response = await updateUser(id, formData);
            setUser(response.user);
            setUserPreview({
                ...response.user
            });
            setIsEditing(false);

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingError = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
                        ...formattingError
                    });
                } else {
                    setError(error.response.data.message);
                }
            }
        }
    }

    const handleDelete = async () => {
        try {
            await deleteUser(id);
            navigation(ADMIN_PAGE);

        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteRole = async (roleTitle) => {
        try {

            const formData = new FormData();
            formData.append('roleTitle', roleTitle);
            await deleteRole(id, formData);
            setUpdate(true);
        } catch (error) {

            if (error.response) {
                setRoleError(error.response.data.message);
            }
        }
    }

    const handleAddRoleClick = async () => {
        try {
            const formData = new FormData();
            formData.append('roleTitle', selectedRole);
            await addRole(id, formData);
            setUpdate(true);
        } catch (error) {
            console.log(error);
        }
    }

    const onDeleteEducation = (onDelete) => {
        setUpdate(onDelete)
    }

    return (
        isLoading ?
            <Container className={"w-100 min-vh-100 d-flex justify-content-center align-items-center border mt-3 mb-3"}>
                <Loader />
            </Container>
            :
            <Container className={"w-100 min-vh-100 mt-3 mb-3 border p-3"}>
                <div>
                    <h2>{t('user')}</h2>
                </div>
                <Form className={"mt-3"}>
                    <Form.Group controlId={"email"} className={"mb-3"}>
                        <Form.Label>{t('email')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={"email"}
                                placeholder={t('emailPlaceholder')}
                                name={"email"}
                                required
                                value={userPreview.email}
                                onChange={onChange}
                                disabled={!isEditing}
                                isInvalid={!!validationErrors.email}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                { validationErrors.email }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId={"firstName"} className={"mb-3"}>
                        <Form.Label>{t('firstName')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={"text"}
                                placeholder={t('firstNamePlaceholder')}
                                name={"firstName"}
                                required
                                value={userPreview.firstName}
                                onChange={onChange}
                                isInvalid={!!validationErrors.firstName}
                                disabled={!isEditing}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                { validationErrors.firstName }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId={"secondName"} className={"mb-3"}>
                        <Form.Label>{t('secondName')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={"text"}
                                placeholder={t('secondNamePlaceholder')}
                                name={"secondName"}
                                required
                                value={userPreview.secondName}
                                onChange={onChange}
                                isInvalid={!!validationErrors.secondName}
                                disabled={!isEditing}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                { validationErrors.secondName }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId={"birthday"} className={"mb-3"}>
                        <Form.Label>{t('birthday')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={"date"}
                                name={"birthday"}
                                required
                                value={userPreview.birthday}
                                onChange={onChange}
                                isInvalid={!!validationErrors.birthday}
                                disabled={!isEditing}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                { validationErrors.birthday }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId={"phoneNumber"} className={"mb-3"}>
                        <Form.Label>{t('phoneNumber')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={"text"}
                                name={"phoneNumber"}
                                placeholder={t('phoneNumberPlaceholder')}
                                required
                                value={userPreview.phoneNumber}
                                onChange={onChange}
                                isInvalid={!!validationErrors.phoneNumber}
                                disabled={!isEditing}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                { validationErrors.phoneNumber }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <FormGroup className={"mb-3"} controlId={"userImage"}>
                        <FormLabel>{t('userImage')}</FormLabel>
                        <div className={"p-3"}>
                            {imagePreview ?
                                <img
                                    style={{maxHeight: "250px", width: "auto", borderRadius: "5px"}}
                                    src={imagePreview}
                                    alt={t('errorImage')}
                                />
                                :
                                <img
                                    style={{maxHeight: "250px", width: "auto", borderRadius: "5px"}}
                                    src={process.env.REACT_APP_API_URL + user.userImage}
                                    alt={t('errorImage')}
                                />
                            }
                        </div>
                        <Form.Control type={"file"} name={"userImage"} onChange={onChange} disabled={!isEditing}/>
                    </FormGroup>

                    <Form.Group controlId={"companyId"} className={"mb-3"}>
                        <Form.Label>{t('companyId')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Select
                                name={"companyId"}
                                value={userPreview.companyId}
                                onChange={onChange}
                                isInvalid={!!validationErrors.phoneNumber}
                                disabled={!isEditing}
                            >
                                <option
                                    value={null}
                                >
                                    {t('notAssignedCompany')}
                                </option>
                                { companies.map(company => (
                                    <option
                                        key={company.id}
                                        value={company.id}
                                    >
                                        {company.id}
                                    </option>
                                )) }
                            </Form.Select>
                            <Form.Control.Feedback type={"invalid"}>
                                { validationErrors.phoneNumber }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    { error &&
                        <Alert variant={"danger"}>
                            {error}
                        </Alert>
                    }
                    {isEditing ?
                        <div>
                            <Button
                                className={"m-sm-1"}
                                onClick={handleUpdateClick}
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
                                variant={"secondary"}
                                onClick={() => setIsEditing(true)}
                            >
                                {t('editButton')}
                            </Button>
                            <Button
                                className={"m-sm-1"}
                                variant={"danger"}
                                onClick={handleDelete}
                            >
                                {t('deleteButton')}
                            </Button>
                        </div>
                    }
                </Form>
                <hr/>
                <div className={"w-30"}>
                    <strong>{t('rolesList')}</strong>
                    <ListGroup className={"mt-3"}>
                        {getRoleTitles(roles).map((title, index) => (
                            <ListGroup.Item key={index}>
                                <div className={"d-flex justify-content-between align-items-center"}>
                                    {t(title)}
                                    <Button
                                        variant={"danger"}
                                        onClick={() => handleDeleteRole(title)}
                                    >
                                        {t('deleteButton')}
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    { roleError &&
                        <Alert
                            className={"mt-3"}
                            variant={"danger"}
                        >
                            { roleError }
                        </Alert>
                    }
                    <div className={"mt-3 w-100 d-flex justify-content-start"}>
                        { isRoleAdding ?
                            <div className={"w-100"}>
                                <Form.Select
                                    className={"w-100"}
                                    name={"roleTitle"}
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    <option value={RoleEnum.SUBSCRIBER}>{t('subscriber')}</option>
                                    <option value={RoleEnum.COMPANY_ADMIN}>{t('companyAdmin')}</option>
                                    <option value={RoleEnum.ADMIN}>{t('systemAdmin')}</option>
                                </Form.Select>
                                <div className={"w-100 mt-1"}>
                                    <Button
                                        className={"m-lg-1"}
                                        onClick={handleAddRoleClick}
                                    >
                                        {t('acceptButton')}
                                    </Button>
                                    <Button
                                        variant={'danger'}
                                        onClick={() => setIsRoleAdding(false)}
                                    >
                                        {t('cancelButton')}
                                    </Button>
                                </div>
                            </div>
                            :
                            <Button                                className={"w-25"}
                                                                   onClick={() => setIsRoleAdding(true)}
                            >
                                {t('addButton')}
                            </Button>
                        }
                    </div>
                    <hr />
                    <UserEducation educations={educations} userId={id} onUpdate={onDeleteEducation}/>
                </div>

            </Container>
    );
};

export default AdminOneUser;


