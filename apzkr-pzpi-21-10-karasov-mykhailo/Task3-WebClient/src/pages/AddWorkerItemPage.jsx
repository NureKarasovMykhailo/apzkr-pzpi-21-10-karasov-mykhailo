import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {fetchUserById} from "../API/userApi";
import {Button, Container} from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import WorkerItem from "../components/Worker/WorkerItem/WorkerItem";
import {useTranslation} from "react-i18next";
import {addWorker} from "../API/companyApi";
import {ADD_WORKER_PAGE} from "../utils/consts";

const AddWorkerItemPage = () => {
    const { id } = useParams();
    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({});
    const [educations, setEducations] = useState([{}]);
    const { t } = useTranslation();
    const [addButtonText, setAddButtonText] = useState(t('addButton'));
    const [isAddButtonActive, setIsAddButtonActive] = useState(true);

    const handleAddClick = () => {
        try {
            const response = addWorker(id);
            setIsAddButtonActive(false);
            setAddButtonText('Даний користувач був доданий')
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchUserById(id).then(response => {
            console.log(response);
            setUser(response.user);
            setEducations(response.educations)
            setIsLoading(false);
        })
    }, []);

    return (
        isLoading ?
            <Container className={"w-100 d-flex align-items-center justify-content-center"} style={{minHeight: '100vh'}}>
                <Loader />
            </Container>
            :
            <Container
                style={{height: '60vh'}}
                className={"border mt-3 mb-3"}
            >
                < WorkerItem worker={user} educations={educations} />
                <hr />
                <div className={"w-100 d-flex p-4 align-items-center justify-content-end"}>
                    <Button
                        variant={"primary"}
                        className={"w-50"}
                        onClick={handleAddClick}
                        disabled={!isAddButtonActive}
                    >
                        {t('addButton')}
                    </Button>
                </div>
            </Container>
    );
};

export default AddWorkerItemPage;