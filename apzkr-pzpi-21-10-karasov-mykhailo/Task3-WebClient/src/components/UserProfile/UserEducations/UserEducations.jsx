import React, {useEffect, useState} from 'react';
import {Button, Container} from "react-bootstrap";
import './UserEducatios.css';
import {fetchUserByToken} from "../../../API/userApi";
import Loader from "../../UI/Loader/Loader";
import Modal from "../../UI/Modal/Modal";
import AddEducationModel from "../../Modal/AddEducationModal/AddEducationModel";
import {fetchEducations} from "../../../API/educationApi";
import EducationList from "./EducationList/EducationList";
import {useTranslation} from "react-i18next";

const UserEducations = () => {
    const [isAddEducationSuccess, setIsAddEducationSuccess] = useState(false);
    const [isDeleteEducationSuccess, setIsDeleteEducationSuccess] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [educations, setEducations] = useState([{}]);
    const { t } = useTranslation();

    useEffect(() => {
        fetchUserByToken().then(response => {
            setUserData(response.user);
            fetchEducations().then(educationResponse => {
                setEducations(educationResponse.educations);
                setIsLoading(false);
                setIsAddEducationSuccess(false);
                setIsDeleteEducationSuccess(false);
            });
        });
    }, [isAddEducationSuccess, isDeleteEducationSuccess]);

    const handleAddEducation = (success) => {
        setIsAddEducationSuccess(success);
        setIsModalActive(false);
    }

    const handleDeleteEducation = (success) => {
        setIsDeleteEducationSuccess(success);
    }

    return (
        isLoading ?
            <Container className={"w-100 h-100"}>
                <Loader />
            </Container>
        :
            <Container className={"border user-educations__container p-4 h-100"} >
                <div className={"user-educations__header w-100 d-flex justify-content-center"}>
                    <h2>{t('educations')}</h2>
                </div>
                <div className={"user-educations__list h-100 w-100 d-flex flex-column align-items-center justify-content-center"}>
                    { !userData.educations || userData.educations.length === 0 ?
                        <div className={"w-100 h-100 p-4 d-flex justify-content-center"}>
                            <p>{t('noEducations')}</p>
                        </div>
                        :
                        <div className={"w-100 p-4 mb-4"}>
                            <EducationList educations={userData.educations} onDeleteSuccess={handleDeleteEducation} />
                        </div>
                    }
                    <div className={"w-100 h-100 d-flex justify-content-end"}>
                        <Button
                            onClick={() => {
                                setIsModalActive(true);
                            }}
                        >
                            {t('addEducationButton')}
                        </Button>
                    </div>
                </div>
                <Modal
                    active={isModalActive}
                    setActive={setIsModalActive}
                >
                    <AddEducationModel educations={educations} onAddSuccess={handleAddEducation} />
                </Modal>
            </Container>
    );
};

export default UserEducations;