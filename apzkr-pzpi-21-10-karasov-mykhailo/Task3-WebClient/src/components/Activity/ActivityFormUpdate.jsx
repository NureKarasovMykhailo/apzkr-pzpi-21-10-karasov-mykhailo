import React, {useEffect, useState} from 'react';
import {Button, Container, Form, InputGroup} from "react-bootstrap";
import {fetchEducations} from "../../API/educationApi";
import {fetchComplexities} from "../../API/complexityApi";
import {getTimeInHours} from "../../utils/getTimeInHours";
import {useTranslation} from "react-i18next";
import {getTimeInSeconds} from "../../utils/getTimeInSeconds";
import {updateActivityById} from "../../API/activityApi";
import getFormattingErrors from "../../utils/validationErrorsFormating";

const ActivityFormUpdate = ({ activity, onUpdate }) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [educations, setEducation] = useState([{}]);
    const [complexities, setComplexities] = useState([{}]);
    const [activityInfo, setActivityInfo] = useState({
        activityTitle: activity.activityTitle,
        description: activity.description,
        requiredWorkerCount: activity.requiredWorkerCount,
        educationId: activity.educationId,
        complexityId: activity.complexityId,
        hoursShift: getTimeInHours(activity.timeShift).split(':')[0],
        minutesShift: getTimeInHours(activity.timeShift).split(':')[1],
    });
    const [validationErrors, setValidationErrors] = useState({
        activityTitle: '',
        description: '',
        requiredWorkerCount: '',
        educationId: '',
        complexityId: '',
        hoursShift: '',
        minutesShift: '',
    });


    useEffect(() => {
        setIsLoading(true);
        setIsEdit(false);
        fetchEducations().then(response => {
            setEducation(response.educations);
            fetchComplexities(999, 1).then(complexityResponse => {
                setComplexities(complexityResponse.complexities);
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

    const handleCancelClick = () => {
        setActivityInfo({
            activityTitle: activity.activityTitle,
            description: activity.description,
            requiredWorkerCount: activity.requiredWorkerCount,
            educationId: activity.educationId,
            complexityId: activity.complexityId,
            hoursShift: getTimeInHours(activity.timeShift).split(':')[0],
            minutesShift: getTimeInHours(activity.timeShift).split(':')[1],
        });
        setIsEdit(false);
    }

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('activityTitle', activityInfo.activityTitle);
            formData.append('description', activityInfo.description);
            formData.append('requiredWorkerCount', activityInfo.requiredWorkerCount);
            formData.append('timeShift', getTimeInSeconds(activityInfo.hoursShift, activityInfo.minutesShift));
            formData.append('complexityId', activityInfo.complexityId);
            formData.append('educationId', activityInfo.educationId);

            await updateActivityById(activity.id, formData);
            onUpdate(true);
        } catch (error) {
            if (error.response) {
                const formattingErrors = getFormattingErrors(error.response.data.message)
                setValidationErrors({
                    ...validationErrors,
                    ...formattingErrors
                });
            }
        }
    }

    return (
        isLoading ?
            <Container>

            </Container>
            :
            <Form>
                <Form.Group className={"mb-3"} controlId={"activityTitle"}>
                    <Form.Label>{t('activityName')}</Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            type={"text"}
                            name={"activityTitle"}
                            value={activityInfo.activityTitle}
                            disabled={!isEdit}
                            onChange={onChange}
                            isInvalid={validationErrors.activityTitle}
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
                            disabled={!isEdit}
                            onChange={onChange}
                            isInvalid={validationErrors.description}
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
                            disabled={!isEdit}
                            onChange={onChange}
                            isInvalid={validationErrors.requiredWorkerCount}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validationErrors.description}
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
                            disabled={!isEdit}
                            onChange={onChange}
                        />
                        <strong>{t('hours')}</strong>
                        <Form.Control
                            className={"w-25 m-1"}
                            type={"number"}
                            name={"minutesShift"}
                            placeholder={t('timeShift')}
                            value={activityInfo.minutesShift}
                            disabled={!isEdit}
                            onChange={onChange}
                        />
                        <Form.Control.Feedback type="invalid">

                        </Form.Control.Feedback>
                        <strong>{t('minutes')}</strong>
                    </InputGroup>
                </Form.Group>

                <Form.Group className={"mb-3"} controlId={"educationId"}>
                    <Form.Label>{t('requiredEducation')}</Form.Label>
                    <Form.Select name={"educationId"}  disabled={!isEdit} onChange={onChange} >
                        <option disabled selected>Необхідна освіта</option>
                        {educations.map(education => (
                            <option
                                key={education.id}
                                value={education.id}
                                selected={education.id === activityInfo.educationId}
                            >
                                {education.educationTitle}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className={"mb-3"} controlId={"complexityId"}>
                    <Form.Label>{t('activityComplexity')}</Form.Label>
                    <Form.Select name={"complexityId"} disabled={!isEdit} onChange={onChange}>
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
                <div className={"w-100 d-flex justify-content-end mt-3"}>
                    {isEdit ?
                        <div>
                            <Button
                                onClick={handleUpdate}
                            >
                                {t('acceptButton')}
                            </Button>
                            <Button
                                variant={"danger"}
                                className={"m-1"}
                                onClick={handleCancelClick}
                            >
                                {t('cancelButton')}
                            </Button>
                        </div>
                        :
                        <div>
                            <Button
                                variant={"success"}
                                className={"m-1"}
                                onClick={() => setIsEdit(true)}
                            >
                                {t('editButton')}
                            </Button>
                        </div>
                    }
                </div>
            </Form>
    );
};

export default ActivityFormUpdate;