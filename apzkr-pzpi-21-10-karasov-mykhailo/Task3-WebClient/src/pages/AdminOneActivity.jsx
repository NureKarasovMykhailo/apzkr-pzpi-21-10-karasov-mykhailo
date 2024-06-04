import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchComplexities } from '../API/complexityApi';
import { fetchEducations } from '../API/educationApi';
import { fetchCompanies } from '../API/adminCompanyApi';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';
import Loader from '../components/UI/Loader/Loader';
import {
    createActivity,
    deleteActivity,
    fetchActivityById,
    updateActivity,
} from '../API/adminActivityApi';
import { useTranslation } from 'react-i18next';
import { getTimeInHours } from '../utils/getTimeInHours';
import { getTimeInSeconds } from '../utils/getTimeInSeconds';
import { ADMIN_PAGE } from '../utils/consts';
import getFormattingErrors from '../utils/validationErrorsFormating';
import AdminUserActivity from '../components/AdminComponents/AdminUserActivity';
import Modal from '../components/UI/Modal/Modal';
import SetWorkerAdmin from '../components/Modal/SetWorkerAdmin/SetWorkerAdmin';

const AdminOneActivity = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [complexities, setComplexities] = useState([{}]);
    const [educations, setEducations] = useState([{}]);
    const [companies, setCompanies] = useState([{}]);
    const [activity, setActivity] = useState();
    const [update, setUpdate] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);
    const [activityPreview, setActivityPreview] = useState({
        activityTitle: '',
        description: '',
        requiredWorkerCount: '',
        minutesShift: '',
        hoursShift: '',
        complexityId: null,
        educationId: null,
        companyId: null,
    });
    const [validationErrors, setValidationErrors] = useState({
        activityTitle: '',
        description: '',
        requiredWorkerCount: '',
        minutesShift: '',
        hoursShift: '',
        complexityId: null,
        educationId: null,
        companyId: null,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setIsEdit(false);
        setUpdate(false);
        setIsModalActive(false);
        fetchComplexities(999, 1).then((complexityResponse) => {
            setComplexities(complexityResponse.complexities);
            fetchEducations(999, 1).then((educationResponse) => {
                setEducations(educationResponse.educations);
                fetchCompanies(999, 1).then((companyResponse) => {
                    setCompanies(companyResponse.companies);
                    fetchActivityById(id).then((activityResponse) => {
                        setActivity(activityResponse.activity);
                        setActivityPreview({
                            ...activityResponse.activity,
                            hoursShift: getTimeInHours(activityResponse.activity.timeShift).split(':')[0],
                            minutesShift: getTimeInHours(activityResponse.activity.timeShift).split(':')[1],
                        });

                        setIsLoading(false);
                    });
                });
            });
        });
    }, [update]);

    const onChange = (e) => {
        setActivityPreview({
            ...activityPreview,
            [e.target.name]: e.target.value,
        });
    };

    const handleCancelClick = () => {
        setActivityPreview({
            ...activity,
            hoursShift: getTimeInHours(activity.timeShift).split(':')[0],
            minutesShift: getTimeInHours(activity.timeShift).split(':')[1],
        });
        setIsEdit(false);
    };

    const handleUpdateClick = async () => {
        try {
            const formData = new FormData();
            formData.append('activityTitle', activityPreview.activityTitle);
            formData.append('description', activityPreview.description);
            formData.append('requiredWorkerCount', activityPreview.requiredWorkerCount);
            formData.append('timeShift', getTimeInSeconds(activityPreview.hoursShift, activityPreview.minutesShift));
            formData.append('complexityId', activityPreview.complexityId);
            formData.append('educationId', activityPreview.educationId);
            formData.append('companyId', activityPreview.companyId);

            const response = await updateActivity(id, formData);
            setActivity(response.activity);
            setActivityPreview({
                ...response.activity,
                hoursShift: getTimeInHours(response.activity.timeShift).split(':')[0],
                minutesShift: getTimeInHours(response.activity.timeShift).split(':')[1],
            });
            setIsEdit(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingErrors = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
                        ...validationErrors,
                        ...formattingErrors,
                    });
                }
            }
        }
    };

    const handleDeleteClick = async () => {
        try {
            await deleteActivity(id);
            navigation(ADMIN_PAGE);
        } catch (error) {
            console.log(error);
        }
    };

    const onDeleteUser = (onUpdate) => {
        setUpdate(onUpdate);
    };

    const onAddWorker = (onUpdate) => {
        setUpdate(onUpdate);
    };

    return (
        isLoading ? (
            <Container className={'min-vh-100 border mt-3 mb-3 d-flex align-items-center'}>
                <Loader />
            </Container>
        ) : (
            <Container className={'w-100 border min-vh-100 mt-3 mb-3 p-3'}>
                <div>
                    <h2>{t('activity')}</h2>
                </div>
                <hr />
                <Form>
                    <Form.Group className={'mb-3'} controlId={'activityTitle'}>
                        <Form.Label>{t('activityTitle')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={'text'}
                                name={'activityTitle'}
                                placeholder={t('activityTitlePlaceholder')}
                                value={activityPreview.activityTitle}
                                onChange={onChange}
                                isInvalid={!!validationErrors.activityTitle}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.activityTitle}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className={'mb-3'} controlId={'description'}>
                        <Form.Label>{t('descriptionPlaceholder')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                as={'textarea'}
                                name={'description'}
                                placeholder={t('descriptionPlaceholder')}
                                value={activityPreview.description}
                                onChange={onChange}
                                isInvalid={!!validationErrors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.description}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className={'mb-3'} controlId={'requiredWorkerCount'}>
                        <Form.Label>{t('requiredWorkerCountPlaceholder')}</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type={'number'}
                                name={'requiredWorkerCount'}
                                placeholder={t('requiredWorkerCountPlaceholder')}
                                value={activityPreview.requiredWorkerCount}
                                onChange={onChange}
                                isInvalid={!!validationErrors.requiredWorkerCount}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.requiredWorkerCount}
                            </Form.Control.Feedback>
                        </InputGroup>

                    </Form.Group>

                    <Form.Group className={'mb-3 w-50'} controlId={'requiredWorkerCount'}>
                        <Form.Label>{t('workShift')}</Form.Label>
                        <InputGroup className={'d-flex align-items-center'} hasValidation>
                            <Form.Control
                                className={'w-25 m-1'}
                                type={'number'}
                                name={'hoursShift'}
                                placeholder={t('workShift')}
                                value={activityPreview.hoursShift}
                                onChange={onChange}
                                isInvalid={!!validationErrors.timeShift}
                            />
                            <strong>{t('hours')}</strong>
                            <Form.Control
                                className={'w-25 m-1'}
                                type={'number'}
                                name={'minutesShift'}
                                placeholder={t('workShift')}
                                value={activityPreview.minutesShift}
                                onChange={onChange}
                                isInvalid={!!validationErrors.timeShift}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.timeShift}
                            </Form.Control.Feedback>
                            <strong>{t('minutes')}</strong>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className={'mb-3'} controlId={'educationId'}>
                        <Form.Label>{t('addEducation')}</Form.Label>
                        <Form.Select name={'educationId'} onChange={onChange} value={activityPreview.educationId}>
                            <option disabled selected>{t('addEducation')}</option>
                            {educations.map((education) => (
                                <option key={education.id} value={education.id}>
                                    {education.educationTitle}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className={'mb-3'} controlId={'complexityId'}>
                        <Form.Label>{t('addActivity')}</Form.Label>
                        <Form.Select name={'complexityId'} onChange={onChange} value={activityPreview.complexityId}>
                            <option disabled selected>{t('addActivity')}</option>
                            {complexities.map((complexity) => (
                                <option
                                    key={complexity.id}
                                    value={complexity.id}
                                    selected={complexity.id === activityPreview.complexityId}
                                >
                                    {complexity.complexityTitle}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className={'mb-3'} controlId={'companyId'}>
                        <Form.Label>{t('addCompany')}</Form.Label>
                        <Form.Select name={'companyId'} onChange={onChange} value={activityPreview.companyId}>
                            <option disabled selected>{t('addCompany')}</option>
                            {companies.map((company) => (
                                <option
                                    key={company.id}
                                    value={company.id}
                                    selected={company.id === activityPreview.companyId}
                                >
                                    {company.companyName}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {isEdit ? (
                        <div>
                            <Button onClick={handleUpdateClick}>{t('updateButton')}</Button>
                            <Button className={'m-lg-2'} variant={'danger'} onClick={handleCancelClick}>
                                {t('cancelButton')}
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Button className={'m-lg-2'} variant={'secondary'} onClick={() => setIsEdit(true)}>
                                {t('editButton')}
                            </Button>
                            <Button variant={'danger'} onClick={handleDeleteClick}>
                                {t('deleteButton')}
                            </Button>
                        </div>
                    )}
                </Form>
                <hr />
                <AdminUserActivity users={activityPreview.users} activityId={id} onUpdate={onDeleteUser} />
                <Button onClick={() => setIsModalActive(true)} className={'mt-3'}>
                    {t('addWorker')}
                </Button>
                <Modal active={isModalActive} setActive={setIsModalActive}>
                    <SetWorkerAdmin activityId={id} onUpdate={onAddWorker} />
                </Modal>
            </Container>
        )
    );
};

export default AdminOneActivity;
