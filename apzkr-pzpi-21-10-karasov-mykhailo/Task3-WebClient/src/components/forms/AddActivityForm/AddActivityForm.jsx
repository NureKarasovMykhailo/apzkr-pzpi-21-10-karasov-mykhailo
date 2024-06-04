import React, {useEffect, useState} from 'react';
import {Button, Form, InputGroup} from "react-bootstrap";
import {fetchComplexities} from "../../../API/complexityApi";
import {fetchEducations} from "../../../API/educationApi";
import Loader from "../../UI/Loader/Loader";
import {useTranslation} from "react-i18next";
import {getTimeInSeconds} from "../../../utils/getTimeInSeconds";
import {createActivity} from "../../../API/activityApi";
import getFormattingErrors from "../../../utils/validationErrorsFormating";
import {useNavigate} from "react-router-dom";
import {ACTIVITIES_LIST_PAGE} from "../../../utils/consts";

const AddActivityForm = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [complexities, setComplexities] = useState([{}]);
    const [educations, setEducations] = useState([{}]);
    const [activityInfo, setActivityInfo] = useState({
        activityTitle: '',
        description: '',
        requiredWorkerCount: '',
        hoursShift: '',
        minutesShift: '',
        complexityId: complexities[0].complexityId,
        educationId: educations[0].educationId
    });
    const [validationErrors, setValidationErrors] = useState({
        activityTitle: '',
        description: '',
        requiredWorkerCount: '',
        timeShift: '',
    });

    useEffect(() => {
        setIsLoading(true);
        setValidationErrors({
            activityTitle: '',
            description: '',
            requiredWorkerCount: '',
            timeShift: '',
        });
        fetchComplexities(999, 1).then(responseComplexity => {
            setComplexities(responseComplexity.complexities);
            fetchEducations(999, 1).then(responseEducations => {
                setEducations(responseEducations.educations);
                setIsLoading(false);
            });
        });
    }, []);

    const onChange = (e) => {
        setActivityInfo({
            ...activityInfo,
            [e.target.name]: e.target.value
        });
    }

    const handleCreateActivityClick = async () => {
        try {
            const formData = new FormData();
            formData.append('activityTitle', activityInfo.activityTitle);
            formData.append('description', activityInfo.description);
            formData.append('requiredWorkerCount', activityInfo.requiredWorkerCount);
            formData.append('timeShift', getTimeInSeconds(activityInfo.hoursShift, activityInfo.minutesShift));
            formData.append('complexityId', activityInfo.complexityId);
            formData.append('educationId', activityInfo.educationId);

            const response = await createActivity(formData);
            navigation(ACTIVITIES_LIST_PAGE);
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

    return (
        !isLoading ?
            <Form>
                <Form.Group className={"mb-3"} controlId={"activityTitle"}>
                    <Form.Label>{t('activityName')}</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            type={"text"}
                            name={"activityTitle"}
                            placeholder={t('activityName')}
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
                            placeholder={t('description')}
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
                            placeholder={t('requiredWorkerCount')}
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
                    <Form.Label>{t('timeShift')}</Form.Label>
                    <InputGroup className={"d-flex align-items-center"} hasValidation>
                        <Form.Control
                            className={"w-25 m-1"}
                            type={"number"}
                            name={"hoursShift"}
                            placeholder={t('timeShift')}
                            value={activityInfo.hoursShift}
                            onChange={onChange}
                            isInvalid={!!validationErrors.timeShift}
                        />
                        <strong>{t('hours')}</strong>
                        <Form.Control
                            className={"w-25 m-1"}
                            type={"number"}
                            name={"minutesShift"}
                            placeholder={t('timeShift')}
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
                        <option disabled selected>{t('requiredEducation')}</option>
                        {educations.map(education => (
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
                    <Form.Label>{t('complexity')}</Form.Label>
                    <Form.Select name={"complexityId"} onChange={onChange} value={activityInfo.complexityId}>
                        <option disabled selected>{t('complexity')}</option>
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
                <Button
                    className={"w-50"}
                    onClick={handleCreateActivityClick}
                >
                    {t('addButton')}
                </Button>
            </Form>
            :
            <div className={"w-100 min-vh-100 d-flex align-items-center justify-content-center"}>
                <Loader />
            </div>
    );
};

export default AddActivityForm;