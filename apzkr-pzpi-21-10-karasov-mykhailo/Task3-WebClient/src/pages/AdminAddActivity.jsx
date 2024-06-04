import React, { useEffect, useState } from 'react';
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import { fetchComplexities } from "../API/complexityApi";
import { fetchEducations } from "../API/educationApi";
import { fetchCompanies } from "../API/adminCompanyApi";
import { useTranslation } from "react-i18next";
import { getTimeInSeconds } from "../utils/getTimeInSeconds";
import { ADMIN_PAGE } from "../utils/consts";
import getFormattingErrors from "../utils/validationErrorsFormating";
import { useNavigate } from "react-router-dom";
import { createActivity } from "../API/adminActivityApi";

const AdminAddActivity = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [complexities, setComplexities] = useState([{}]);
    const [educations, setEducations] = useState([{}]);
    const [companies, setCompanies] = useState([{}]);
    const [activityInfo, setActivityInfo] = useState({
        activityTitle: '',
        description: '',
        requiredWorkerCount: '',
        minutesShift: '',
        hoursShift: '',
        complexityId: null,
        educationId: null,
        companyId: null
    });
    const [validationErrors, setValidationErrors] = useState({
        activityTitle: '',
        description: '',
        requiredWorkerCount: '',
        minutesShift: '',
        hoursShift: '',
        complexityId: null,
        educationId: null,
        companyId: null
    });
    const [error, setError] = useState('');

    const onChange = (e) => {
        setActivityInfo({
            ...activityInfo,
            [e.target.name]: e.target.value
        })
    };

    const handleCreateActivityClick = async () => {
        try {
            const formData = new FormData();
            formData.append('activityTitle', activityInfo.activityTitle);
            formData.append('description', activityInfo.description);
            formData.append('requiredWorkerCount', activityInfo.requiredWorkerCount);
            formData.append('timeShift', getTimeInSeconds(activityInfo.hoursShift, activityInfo.minutesShift));
            formData.append('complexityId', activityInfo.complexityId);
            formData.append('educationId', activityInfo.educationId);
            formData.append('companyId', activityInfo.companyId);

            await createActivity(formData);
            navigation(ADMIN_PAGE);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingErrors = getFormattingErrors(error.response.data.message)
                    setValidationErrors({
                        ...validationErrors,
                        ...formattingErrors
                    });
                }
            }
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchComplexities(999, 1).then(complexityResponse => {
            setComplexities(complexityResponse.complexities);
            fetchEducations(999, 1).then(educationsResponse => {
                setEducations(educationsResponse.educations);
                fetchCompanies(999, 1).then(companyResponse => {
                    setCompanies(companyResponse.companies);
                    setIsLoading(false);
                })
            })
        })
    }, []);



    return (
        isLoading ?
            <Container className={"min-vh-100 border mt-3 mb-3 p-3 d-flex align-items-center"}>
                <Loader />
            </Container>
            :
            <Container className={"min-vh-100 mt-3 mb-3 p-3 border"}>
                <div className={"mb-3"}>
                    <h2>{t('addActivity')}</h2>
                    <hr />
                    <Form>
                        <Form.Group className={"mb-3"} controlId={"activityTitle"}>
                            <Form.Label>{t('activityTitle')}</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type={"text"}
                                    name={"activityTitle"}
                                    placeholder={t('activityTitlePlaceholder')}
                                    value={activityInfo.activityTitle}
                                    onChange={onChange}
                                    isInvalid={!!validationErrors.activityTitle}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.activityTitle}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group  className={"mb-3"} controlId={"description"} >
                            <Form.Label>{t('description')}</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    as={"textarea"}
                                    name={"description"}
                                    placeholder={t('descriptionPlaceholder')}
                                    value={activityInfo.description}
                                    onChange={onChange}
                                    isInvalid={!!validationErrors.description}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.description}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className={"mb-3"} controlId={"requiredWorkerCount"}>
                            <Form.Label>{t('requiredWorkerCount')}</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control
                                    type={"number"}
                                    name={"requiredWorkerCount"}
                                    placeholder={t('requiredWorkerCountPlaceholder')}
                                    value={activityInfo.requiredWorkerCount}
                                    onChange={onChange}
                                    isInvalid={!!validationErrors.requiredWorkerCount}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.requiredWorkerCount}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className={"mb-3 w-50"} controlId={"requiredWorkerCount"}>
                            <Form.Label>{t('workShift')}</Form.Label>
                            <InputGroup className={"d-flex align-items-center"} hasValidation>
                                <Form.Control
                                    className={"w-25 m-1"}
                                    type={"number"}
                                    name={"hoursShift"}
                                    placeholder={t('hours')}
                                    value={activityInfo.hoursShift}
                                    onChange={onChange}
                                    isInvalid={!!validationErrors.timeShift}
                                />
                                <strong>{t('hours')}</strong>
                                <Form.Control
                                    className={"w-25 m-1"}
                                    type={"number"}
                                    name={"minutesShift"}
                                    placeholder={t('minutes')}
                                    value={activityInfo.minutesShift}
                                    onChange={onChange}
                                    isInvalid={!!validationErrors.timeShift}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.timeShift}
                                </Form.Control.Feedback>
                                <strong>{t('minutes')}</strong>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className={"mb-3"} controlId={"educationId"}>
                            <Form.Label>{t('requiredEducation')}</Form.Label>
                            <Form.Select name={"educationId"} onChange={onChange} value={activityInfo.educationId}>
                                <option disabled selected>{t('selectEducation')}</option>
                                {
                                    educations.map(education => (
                                        <option
                                            key={education.id}
                                            value={education.id}
                                        >
                                            {education.educationTitle}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className={"mb-3"} controlId={"complexityId"}>
                            <Form.Label>{t('activityComplexity')}</Form.Label>
                            <Form.Select name={"complexityId"} onChange={onChange} value={activityInfo.complexityId}>
                                <option disabled selected>{t('selectComplexity')}</option>
                                { complexities.map(complexity => (
                                    <option
                                        key={complexity.id}
                                        value={complexity.id}
                                        selected={complexity.id === activityInfo.complexityId}
                                    >
                                        { complexity.complexityTitle }
                                    </option>
                                )) }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className={"mb-3"} controlId={"companyId"}>
                            <Form.Label>{t('companyName')}</Form.Label>
                            <Form.Select name={"companyId"} onChange={onChange} value={activityInfo.companyId}>
                                <option disabled selected>{t('selectCompany')}</option>
                                { companies.map(company => (
                                    <option
                                        key={company.id}
                                        value={company.id}
                                        selected={company.id === activityInfo.companyId}
                                    >
                                        { company.companyName }
                                    </option>
                                )) }
                            </Form.Select>
                        </Form.Group>
                        <Button
                            className={"w-50"}
                            onClick={handleCreateActivityClick}
                        >
                            {t('addButton')}
                        </Button>
                    </Form>
                </div>

            </Container>
    );
};

export default AdminAddActivity;
