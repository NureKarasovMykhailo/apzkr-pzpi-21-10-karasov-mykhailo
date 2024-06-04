import React, {useEffect, useState} from 'react';
import {getRoleTitles} from "../../utils/getRoleTitles";
import {Alert, Button, Form, ListGroup} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {addEducation, deleteEducation} from "../../API/adminUserApi";
import Loader from "../UI/Loader/Loader";
import {fetchEducations} from "../../API/educationApi";

const UserEducation = ({ educations, userId, onUpdate }) => {
    const { t } = useTranslation();

    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEducation, setSelectedEducation] = useState();
    const [allEducations, setAllEducations] = useState([{}]);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        fetchEducations(999, 1).then(response => {
            setAllEducations(response.educations);
            setIsLoading(false);
        })
    }, []);

    const handleDeleteClick = async (educationTitle) => {
        try {
            const formData = new FormData();
            formData.append('educationTitle', educationTitle);
            await deleteEducation(userId, formData);
            onUpdate(true);
        } catch (error) {
            console.log(error);
        }
    }

    const addEducationClick = async () => {
        try {
            const formData = new FormData();
            formData.append('educationTitle', selectedEducation);
            await addEducation(userId, formData);
            onUpdate(true);
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        !isLoading ?
            <div>
                <strong>{t('userEducations')}</strong>

                <ListGroup className={"mt-3"}>
                    {educations.map((education, index) => (
                        <ListGroup.Item key={education.id}>
                            <div className={"d-flex justify-content-between align-items-center"}>
                                {education.educationTitle}
                                <Button
                                    variant={"danger"}
                                    onClick={() => handleDeleteClick(education.educationTitle)}
                                >
                                    {t('deleteButton')}
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                {isAdding ?
                    <div>
                        <Form.Select
                            value={selectedEducation}
                            className={"mb-2"}
                            onChange={(e) => setSelectedEducation(e.target.value)}
                        >
                            { allEducations.map(education => (
                                <option
                                    key={education.id}
                                    value={education.educationTitle}
                                >
                                    {education.educationTitle}
                                </option>
                            )) }
                        </Form.Select>
                        <Button
                            className={"m-lg-1"}
                            onClick={addEducationClick}
                        >
                            {t('acceptButton')}
                        </Button>
                        <Button
                            variant={"danger"}
                            onClick={() => setIsAdding(false)}
                        >
                            {t('cancelButton')}
                        </Button>
                        { error &&
                            <Alert variant={"danger"}>
                                { error }
                            </Alert>
                        }
                    </div>
                    :
                    <div>
                        <Button
                            className={"mt-3"}
                            onClick={() => setIsAdding(true)}
                        >
                            {t('addButton')}
                        </Button>
                    </div>
                }
            </div>
            :
            <div>
                <Loader />
            </div>
    );
};

export default UserEducation;