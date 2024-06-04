import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import { deleteWorkerFromActivity, fetchActivityById } from "../API/activityApi";
import ActivityFormUpdate from "../components/Activity/ActivityFormUpdate";
import WorkerList from "../components/Worker/WorkerList/WorkerList";
import Modal from "../components/UI/Modal/Modal";
import SetWorkerOnActivityModal from "../components/Modal/SetWorkerOnActivityModal/SetWorkerOnActivityModal";
import { hasUserRole } from "../utils/hasUserRole";
import { getRoleTitles } from "../utils/getRoleTitles";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { RoleEnum } from "../utils/enums/RoleEnum";
import { useTranslation } from "react-i18next";

const ActivityPage = observer(() => {
    const { id } = useParams();
    const { userStore } = useContext(Context);
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(true);
    const [activity, setActivity] = useState();
    const [update, setUpdate] = useState(false);
    const [isModalActive, setModalActive] = useState(false);

    const isUserAdmin = hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.COMPANY_ADMIN, RoleEnum.SUBSCRIBER]);

    useEffect(() => {
        setIsLoading(true);
        setModalActive(false);
        setUpdate(false);
        fetchActivityById(id).then(response => {
            setActivity(response.activity);
            setIsLoading(false);
        });
    }, [update]);

    const handleUpdate = (onUpdate) => {
        setUpdate(onUpdate);
    }

    const handleDelete = async (userId) => {
        try {
            const formData = new FormData();
            formData.append('userId', userId);
            await deleteWorkerFromActivity(activity.id, formData);
            setUpdate(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        isLoading ?
            <Container className={"w-100 min-vh-100 border mt-3 mb-3 d-flex justify-content-center align-items-center"}>
                <Loader />
            </Container>
            :
            <Container className={"w-100 min-vh-100 border mt-3 mb-3 p-3 "}>
                <div>
                    <h2>{t('activity')}</h2>
                </div>
                <div>
                    <ActivityFormUpdate activity={activity} onUpdate={handleUpdate} />
                </div>
                <hr/>
                <div>
                    <strong>{t('assignedUsers')}</strong>
                    <WorkerList workers={activity.users} onDelete={handleDelete} />
                    { isUserAdmin  &&
                        <div className={"w-100 d-flex justify-content-center"}>
                            <Button
                                className={"mt-3"}
                                onClick={() => setModalActive(true)}
                            >
                                {t('addButton')}
                            </Button>
                        </div>
                    }
                </div>
                <Modal
                    active={isModalActive}
                    setActive={setModalActive}
                >
                    <SetWorkerOnActivityModal activityId={activity.id} />
                </Modal>
            </Container>
    );
});

export default ActivityPage;
