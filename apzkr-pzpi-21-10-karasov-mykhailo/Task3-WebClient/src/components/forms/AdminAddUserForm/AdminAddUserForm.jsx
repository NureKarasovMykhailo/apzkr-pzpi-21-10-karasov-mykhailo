import React, {useEffect, useState} from 'react';
import {Alert, Button, Form, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import Loader from "../../UI/Loader/Loader";
import {fetchAdminCompany} from "../../../API/adminCompany";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import getFormattingErrors from "../../../utils/validationErrorsFormating";
import {createUser} from "../../../API/adminUserApi";
import {ADMIN_PAGE} from "../../../utils/consts";

const AdminAddUserForm = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({
        email: '',
        firstName: '',
        secondName: '',
        password: '',
        birthday: '',
        phoneNumber: '',
        userImage: null,
        companyId: null
    });
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        firstName: '',
        secondName: '',
        password: '',
        birthday: '',
        phoneNumber: '',
        companyId: ''
    });
    const [companies, setCompanies] = useState([{}]);

    const onChange = (e) => {
        if (e.target.type === 'file') {
            setUserData({
                ...userData,
                userImage: e.target.files[0]
            });
        } else {
            setUserData({
                ...userData,
                [e.target.name]: e.target.value
            });
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchAdminCompany(999, 1).then(response => {
            setCompanies(response.companies);
            setIsLoading(false);
        })
    }, []);

    const handleCreateUser = async () => {
        try {
            const formData = new FormData();
            formData.append('email', userData.email);
            formData.append('firstName', userData.firstName);
            formData.append('secondName', userData.secondName);
            formData.append('password', userData.password);
            formData.append('birthday', userData.birthday);
            formData.append('phoneNumber', userData.phoneNumber);
            if (userData.userImage) {
                formData.append('userImage', userData.userImage);
            }
            if (userData.companyId) {
                formData.append('companyId', userData.companyId);
            }

            await createUser(formData);
            navigation(ADMIN_PAGE);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingErrors = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
                        ...validationErrors,
                        ...formattingErrors
                    });
                } else {
                    setError(error.response.data.message);
                }
            }
        }
    }

    return (
       isLoading ?
            <div className={"min-vh-100 d-flex align-items-center"}>
                <Loader />
            </div>
           :
           <Form>
               <Form.Group controlId={"email"} className={"mb-3"}>
                   <Form.Label>Email</Form.Label>
                   <InputGroup hasValidation>
                       <Form.Control
                           type={"email"}
                           placeholder={"Email"}
                           name={"email"}
                           required
                           value={userData.email}
                           onChange={onChange}
                           isInvalid={!!validationErrors.email}
                       />
                       <Form.Control.Feedback type={"invalid"}>
                           { validationErrors.email }
                       </Form.Control.Feedback>
                   </InputGroup>
               </Form.Group>

               <Form.Group controlId={"firstName"} className={"mb-3"}>
                   <Form.Label>{t('name')}</Form.Label>
                   <InputGroup hasValidation>
                       <Form.Control
                           type={"text"}
                           placeholder={t('name')}
                           name={"firstName"}
                           required
                           value={userData.firstName}
                           onChange={onChange}
                           isInvalid={!!validationErrors.firstName}
                       />
                       <Form.Control.Feedback type={"invalid"}>
                           { validationErrors.firstName }
                       </Form.Control.Feedback>
                   </InputGroup>
               </Form.Group>

               <Form.Group controlId={"secondName"} className={"mb-3"}>
                   <Form.Label>{t('surname')}</Form.Label>
                   <InputGroup hasValidation>
                       <Form.Control
                           type={"text"}
                           placeholder={t('surname')}
                           name={"secondName"}
                           required
                           value={userData.secondName}
                           onChange={onChange}
                           isInvalid={!!validationErrors.secondName}
                       />
                       <Form.Control.Feedback type={"invalid"}>
                           { validationErrors.secondName }
                       </Form.Control.Feedback>
                   </InputGroup>
               </Form.Group>

               <Form.Group controlId={"password"} className={"mb-3"}>
                   <Form.Label>{t('password')}</Form.Label>
                   <InputGroup hasValidation>
                       <Form.Control
                           type={"password"}
                           placeholder={t('password')}
                           name={"password"}
                           required
                           value={userData.password}
                           onChange={onChange}
                           isInvalid={!!validationErrors.password}
                       />
                       <Form.Control.Feedback type={"invalid"}>
                           { validationErrors.password }
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
                           value={userData.birthday}
                           onChange={onChange}
                           isInvalid={!!validationErrors.birthday}
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
                           placeholder={t('phoneNumber')}
                           required
                           value={userData.phoneNumber}
                           onChange={onChange}
                           isInvalid={!!validationErrors.phoneNumber}
                       />
                       <Form.Control.Feedback type={"invalid"}>
                           { validationErrors.phoneNumber }
                       </Form.Control.Feedback>
                   </InputGroup>
               </Form.Group>

               <FormGroup className={"mb-3"} controlId={"userImage"}>
                   <FormLabel>{t('userImage')}</FormLabel>
                   <Form.Control type={"file"} name={"userImage"} onChange={onChange} />
               </FormGroup>

               <Form.Group controlId={"companyId"} className={"mb-3"}>
                   <Form.Label>{t('companyId')}</Form.Label>
                   <InputGroup hasValidation>
                       <Form.Select
                           name={"companyId"}
                           value={userData.companyId}
                           onChange={onChange}
                           isInvalid={!!validationErrors.phoneNumber}
                       >
                           <option
                               value={null}
                           >
                               {t('dontPinToCompany')}
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
               <Button
                    className={"w-25"}
                    onClick={handleCreateUser}
               >
                   {t('addButton')}
               </Button>
           </Form>
    );
};

export default AdminAddUserForm;