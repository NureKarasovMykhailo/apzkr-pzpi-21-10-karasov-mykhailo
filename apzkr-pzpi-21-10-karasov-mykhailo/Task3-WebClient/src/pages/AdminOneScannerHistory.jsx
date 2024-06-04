import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { fetchScanners } from "../API/adminScannerApi";
import { fetchUsers } from "../API/adminUserApi";
import { deleteScannerHistory, fetchScannerHistoryById, updateScannerHistory } from "../API/adminScannerHistoryApi";
import { getTimeInHours } from "../utils/getTimeInHours";
import { Alert, Button, Container, Form, InputGroup } from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import { useTranslation } from "react-i18next";
import getFormattingErrors from "../utils/validationErrorsFormating";
import { getTimeInSeconds } from "../utils/getTimeInSeconds";
import { ADMIN_PAGE } from "../utils/consts";

const AdminOneScannerHistory = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState([{}]);
    const [scanners, setScanners] = useState([{}]);
    const [scannerHistory, setScannerHistory] = useState();
    const [validationErrors, setValidationErrors] = useState({
        temperature: '',
        pulse: '',
        activeWorkedTime: '',
        scannerId: null,
        userId: null
    });
    const [error, setError] = useState('');
    const [scannerHistoryPreview, setScannerHistoryPreview] = useState({
        temperature: '',
        pulse: '',
        hours: '',
        minutes: '',
        userId: null,
        scannerId: null
    });

    useEffect(() => {
        setIsLoading(true);
        setIsEditing(false);
        fetchScanners(999, 1).then(scannerResponse => {
            setScanners(scannerResponse.paginatedItems);
            fetchUsers(999, 1).then(userResponse => {
                setUsers(userResponse.users);
                fetchScannerHistoryById(id).then(scannerHistoryResponse => {
                    setScannerHistory(scannerHistoryResponse.scannerHistory);
                    setScannerHistoryPreview({
                        ...scannerHistoryResponse.scannerHistory,
                        hours: getTimeInHours(scannerHistoryResponse.scannerHistory.activeWorkedTime).split(':')[0],
                        minutes: getTimeInHours(scannerHistoryResponse.scannerHistory.activeWorkedTime).split(':')[1]
                    })
                    setIsLoading(false);
                })
            })
        })
    }, []);

    const onChange = (e) => {
        setScannerHistoryPreview({
            ...scannerHistoryPreview,
            [e.target.name]: e.target.value
        })
    }

    const handleCancelClick = () => {
        setScannerHistoryPreview({
            ...scannerHistory,
            hours: getTimeInHours(scannerHistory.activeWorkedTime).split(':')[0],
            minutes: getTimeInHours(scannerHistory.activeWorkedTime).split(':')[1]
        })
        setIsEditing(false);
    }

    const handleUpdateClick = async () => {
        try {
            const formData = new FormData();
            formData.append('temperature', scannerHistoryPreview.temperature);
            formData.append('pulse', scannerHistoryPreview.pulse);
            formData.append('activeWorkedTime', getTimeInSeconds(scannerHistoryPreview.hours, scannerHistoryPreview.minutes));
            formData.append('scannerId', scannerHistoryPreview.scannerId);
            formData.append('userId', scannerHistoryPreview.userId);
            setIsEditing(false);
            const response = await updateScannerHistory(id, formData);
            setScannerHistory(response.scannerHistory);
            setScannerHistoryPreview({
                ...response.scannerHistory,
                hours: getTimeInHours(response.scannerHistory.activeWorkedTime).split(':')[0],
                minutes: getTimeInHours(response.scannerHistory.activeWorkedTime).split(':')[1]
            });


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

    const handleDeleteClick = async () => {
        try {
            await deleteScannerHistory(id);
            navigation(ADMIN_PAGE);

        } catch (error) {
            console.log(error);
        }
    }


    return (
        isLoading ?
            <Container className={"min-vh-100 mb-3 mt-3 border p-3 d-flex align-items-center"}>
                <Loader />
            </Container>
            :
            <Container className={"min-vh-100 mb-3 mt-3 border p-3"}>
                <div>
                    <h2>{t('scannerHistoryTitle')}</h2>
                </div>
                <hr />
                <Form>
                    <Form.Group className={"mb-3"}>
                        <Form.Label>{t('temperatureLabel')}</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text>°C</InputGroup.Text>
                            <Form.Control
                                type={'number'}
                                placeholder={t('temperaturePlaceholder')}
                                name={"temperature"}
                                value={scannerHistoryPreview.temperature}
                                onChange={onChange}
                                isInvalid={!!validationErrors.temperature}
                                disabled={!isEditing}

                            />
                            <Form.Control.Feedback type={"invalid"}>
                                { validationErrors.temperature }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className={"mb-3"}>
                        <Form.Label>{t('pulseLabel')}</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text>{t('pulseUnit')}</InputGroup.Text>
                            <Form.Control
                                type={'number'}
                                placeholder={t('pulsePlaceholder')}
                                name={"pulse"}
                                value={scannerHistoryPreview.pulse}
                                onChange={onChange}
                                isInvalid={!!validationErrors.pulse}
                                disabled={!isEditing}

                            />
                            <Form.Control.Feedback type={"invalid"}>
                                { validationErrors.pulse }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className={"mb-3 w-50"} controlId={"requiredWorkerCount"}>
                        <Form.Label>{t('workTimeLabel')}</Form.Label>
                        <InputGroup className={"d-flex align-items-center"} hasValidation>
                            <Form.Control
                                className={"w-25 m-1"}
                                type={"number"}
                                name={"hours"}
                                placeholder={t('hoursPlaceholder')}
                                value={scannerHistoryPreview.hours}
                                onChange={onChange}
                                isInvalid={!!validationErrors.activeWorkedTime}
                                disabled={!isEditing}
                            />
                            <strong>{t('hoursUnit')}</strong>
                            <Form.Control
                                className={"w-25 m-1"}
                                type={"number"}
                                name={"minutes"}
                                placeholder={t('minutesPlaceholder')}
                                value={scannerHistoryPreview.minutes}
                                onChange={onChange}
                                isInvalid={!!validationErrors.activeWorkedTime}
                                disabled={!isEditing}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.activeWorkedTime}
                            </Form.Control.Feedback>
                            <strong>{t('minutesUnit')}</strong>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className={"mb-3"} controlId={"scannerId"}>
                        <Form.Label>{t('scannerIdLabel')}</Form.Label>
                        <Form.Select name={"scannerId"} onChange={onChange} value={scannerHistoryPreview.scannerId} disabled={!isEditing}>
                            <option disabled selected>{t('selectScannerId')}</option>
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
                        <Form.Label>{t('userEmailLabel')}</Form.Label>
                        <Form.Select name={"userId"} onChange={onChange} value={scannerHistoryPreview.userId} disabled={!isEditing}>
                            <option disabled selected>{t('selectUserEmail')}</option>
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
                                className={"m-sm-1"}
                                onClick={() => setIsEditing(true)}
                            >
                                {t('editButton')}
                            </Button>
                            <Button
                                variant={"danger"}
                                onClick={handleDeleteClick}
                            >
                                {t('deleteButton')}
                            </Button>
                        </div>
                    }

                </Form>
            </Container>
    );
};

export default AdminOneScannerHistory;

