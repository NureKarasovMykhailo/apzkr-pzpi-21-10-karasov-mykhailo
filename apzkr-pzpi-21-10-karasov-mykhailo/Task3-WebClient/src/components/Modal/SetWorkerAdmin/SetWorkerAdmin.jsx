import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {fetchCompanyUsers} from "../../../API/companyApi";
import {Alert, Button, Form} from "react-bootstrap";
import {addUserToActivity} from "../../../API/adminActivityApi";
import {fetchUsers} from "../../../API/adminUserApi";

const SetWorkerAdmin = ({ activityId, onUpdate }) => {
    const { t } = useTranslation();

    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    const handleAddWorker = async () => {
        try {
            const userResponse = await fetchUsers(1, 1, email);
            if (userResponse.users.length === 0 || !email) {
                setError('Користувача з даним email не існує');
            } else {
                const formData = new FormData();

                formData.append('userId', userResponse.users[0].id);
                await addUserToActivity(activityId, formData);
                onUpdate(true);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            }
        }
    }

    return (
        <Form>
            <Form.Group className={"p-1"}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type={"email"}
                    placeholder={"Email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>
            { error &&
                <Alert variant={"danger"} className={"mt-3 mb-3"}>
                    { error }
                </Alert>
            }
            <div className={"w-100 d-flex justify-content-center"}>
                <Button
                    className={"mt-3 mb-3"}
                    onClick={handleAddWorker}
                >
                    {t('addButton')}
                </Button>
            </div>
        </Form>
    );
};

export default SetWorkerAdmin;