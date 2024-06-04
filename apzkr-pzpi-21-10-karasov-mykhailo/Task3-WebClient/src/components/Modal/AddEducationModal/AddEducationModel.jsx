import React, {useState} from 'react';
import {Alert, Button, Container, Form} from "react-bootstrap";
import {addUserEducation} from "../../../API/userApi";
import {useTranslation} from "react-i18next";

const AddEducationModel = ({ educations, onAddSuccess }) => {
    const [error, setError] = useState('');
    const { t } = useTranslation();
    const [educationTitle, setEducationTitle] = useState('');

    const handleAddEducation = async () => {
        try {
            const formData = new FormData();
            formData.append('educationTitle', educationTitle);
            const response = await addUserEducation(formData);
            onAddSuccess(true);

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            }
        }
    }

    return (
        <Container className={"w-100 h-100"}>
            <div className={"w-100 d-flex justify-content-center"}>
                <h4>{t('selectEducation')}</h4>
            </div>

            <Form>
                <Form.Group controlId={"educationTitle"}>
                    <Form.Label>{t('education')}</Form.Label>
                    <Form.Control
                        list={"educations"}
                        placeholder={t('enterEducationTitle')}
                        value={educationTitle}
                        onChange={(e) => setEducationTitle(e.target.value)}
                    />
                    <datalist id={"educations"}>
                        { educations.map(education => (
                            <option key={education.id} value={education.educationTitle} />
                        )) }
                    </datalist>
                </Form.Group>
                { error &&
                    <Alert variant={"danger"} className={"mt-3"}>
                        { error }
                    </Alert>
                }
                <Button className={"mt-3"} onClick={handleAddEducation}>{t('acceptButton')}</Button>
            </Form>

        </Container>
    );
};

export default AddEducationModel;