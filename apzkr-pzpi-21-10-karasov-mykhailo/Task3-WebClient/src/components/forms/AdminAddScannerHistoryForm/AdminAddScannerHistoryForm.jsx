import React, {useEffect, useState} from 'react';
import {Alert, Button, Form, InputGroup} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {fetchScanners} from "../../../API/adminScannerApi";
import {fetchUsers} from "../../../API/adminUserApi";
import Loader from "../../UI/Loader/Loader";
import getFormattingErrors from "../../../utils/validationErrorsFormating";
import {getTimeInSeconds} from "../../../utils/getTimeInSeconds";
import {createScannerHistory} from "../../../API/adminScannerHistoryApi";
import {ADMIN_PAGE} from "../../../utils/consts";

const AdminAddScannerHistoryForm = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [scanners, setScanners] = useState([{}]);
    const [users, setUsers] = useState([{}]);
    const [error, setError] = useState('');
    const [scannerHistoryData, setScannerHistoryData] = useState({
        temperature: '',
        pulse: '',
        hours: '',
        minutes: '',
        scannerId: null,
        userId: null
    });
    const [validationErrors, setValidationErrors] = useState({
        temperature: '',
        pulse: '',
        activeWorkedTime: '',
        scannerId: null,
        userId: null
    });

    useEffect(() => {
        setIsLoading(true);
        fetchScanners(999, 1).then(scannerResponse => {
            setScanners(scannerResponse.paginatedItems);
            fetchUsers(999, 1).then(userResponse => {
                setUsers(userResponse.users);
                setIsLoading(false);
            })
        })

    }, []);

    const onChange = (e) => {
        setScannerHistoryData({
            ...scannerHistoryData,
            [e.target.name]: e.target.value
        });
    }

    const handleAddScannerHistory = async () => {
        try {
            const formData = new FormData();
            formData.append('temperature', scannerHistoryData.temperature);
            formData.append('pulse', scannerHistoryData.pulse);
            formData.append('activeWorkedTime', getTimeInSeconds(scannerHistoryData.hours, scannerHistoryData.minutes));
            formData.append('scannerId', scannerHistoryData.scannerId);
            formData.append('userId', scannerHistoryData.userId);

            await createScannerHistory(formData);
            navigation(ADMIN_PAGE);


        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    const formattingError = getFormattingErrors(error.response.data.message);
                    setValidationErrors({
                        ...formattingError
                    })
                } else {
                    setError(error.response.data.message);
                }
            }
        }
    }

    return (
        isLoading ?
            <div>
                <Loader />
            </div>
            :
            <Form>
                <Form.Group className={"mb-3"}>
                    <Form.Label>{t('temperature')}</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text>°C</InputGroup.Text>
                        <Form.Control
                            type={'number'}
                            placeholder={t('temperature')}
                            name={"temperature"}
                            value={scannerHistoryData.temperature}
                            onChange={onChange}
                            isInvalid={!!validationErrors.temperature}

                        />
                        <Form.Control.Feedback type={"invalid"}>
                            { validationErrors.temperature }
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group className={"mb-3"}>
                    <Form.Label>{t('pulse')}</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text>уд.з.хв</InputGroup.Text>
                        <Form.Control
                            type={'number'}
                            placeholder={t('pulse')}
                            name={"pulse"}
                            value={scannerHistoryData.pulse}
                            onChange={onChange}
                            isInvalid={!!validationErrors.pulse}

                        />
                        <Form.Control.Feedback type={"invalid"}>
                            { validationErrors.pulse }
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Form.Group className={"mb-3 w-50"} controlId={"requiredWorkerCount"}>
                    <Form.Label>{t('timeShift')}</Form.Label>
                    <InputGroup className={"d-flex align-items-center"} hasValidation>
                        <Form.Control
                            className={"w-25 m-1"}
                            type={"number"}
                            name={"hours"}
                            placeholder={t('timeShift')}
                            value={scannerHistoryData.hours}
                            onChange={onChange}
                            isInvalid={!!validationErrors.activeWorkedTime}
                        />
                        <strong>{t('hours')}</strong>
                        <Form.Control
                            className={"w-25 m-1"}
                            type={"number"}
                            name={"minutes"}
                            placeholder={t('timeShift')}
                            value={scannerHistoryData.minutes}
                            onChange={onChange}
                            isInvalid={!!validationErrors.activeWorkedTime}
                        />
                        <Form.Control.Feedback type="invalid">
                            {validationErrors.activeWorkedTime}
                        </Form.Control.Feedback>
                        <strong>{t('minutes')}</strong>
                    </InputGroup>
                </Form.Group>

                <Form.Group className={"mb-3"} controlId={"scannerId"}>
                    <Form.Label>{t('scannerId')}</Form.Label>
                    <Form.Select name={"scannerId"} onChange={onChange} value={scannerHistoryData.scannerId}>
                        <option disabled selected>{t('scannerId')}</option>
                        {scanners.map(scanner => (
                            <option
                                key={scanner.id}
                                value={scanner.id}
                            >
                                {scanner.id}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className={"mb-3"} controlId={"userId"}>
                    <Form.Label>{t('userEmail')}</Form.Label>
                    <Form.Select name={"userId"} onChange={onChange} value={scannerHistoryData.userId}>
                        <option disabled selected>{t('userEmail')}</option>
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
                    <Alert variant={"danger"}>
                        { error }
                    </Alert>
                }

                <div>
                    <Button className={"mt-3 w-25"} onClick={handleAddScannerHistory}>
                        {t('addButton')}
                    </Button>
                </div>

            </Form>
    );
};

export default AdminAddScannerHistoryForm;