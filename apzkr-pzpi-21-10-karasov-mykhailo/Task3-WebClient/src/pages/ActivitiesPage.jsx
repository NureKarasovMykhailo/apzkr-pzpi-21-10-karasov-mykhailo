import React, { useContext, useEffect, useState } from 'react';
import { Button, Container } from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import { fetchActivity } from "../API/activityApi";
import { useTranslation } from "react-i18next";
import ActivityList from "../components/Activity/ActivityList";
import { useNavigate } from "react-router-dom";
import { ADD_ACTIVITY_PAGE } from "../utils/consts";
import CustomPagination from "../components/Pagination/CustomPagination";
import { hasUserRole } from "../utils/hasUserRole";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { getRoleTitles } from "../utils/getRoleTitles";
import { RoleEnum } from "../utils/enums/RoleEnum";
import { getTimeTable } from "../API/timeTableApi";

const ActivitiesPage = observer(() => {
    const { t } = useTranslation();
    const navigation = useNavigate();
    const { userStore } = useContext(Context);

    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState([{}]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPageCounts] = useState(1);
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        setIsUpdate(false);
        setIsLoading(true);
        fetchActivity(6, currentPage).then(response => {
            setActivities(response.activities);
            setPageCounts(response.pagination.totalPages);
            setCurrentPage(response.pagination.currentPage);
            setIsLoading(false);
        });
    }, [isUpdate]);

    const handleDeleteActivity = (onDelete) => {
        setIsUpdate(true);
    }

    const handleGetTimeTableClick = async () => {
        try {
            setIsLoading(true);
            await getTimeTable();
            setIsUpdate(true);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }

    return (
        isLoading ?
            <Container className={"w-100 mt-3 mb-3 min-vh-100 border d-flex justify-content-start align-items-center"}>
                <Loader />
            </Container>
            :
            <Container className={"w-100 mt-3 mb-3 border min-vh-100"}>
                <div className={"p-3"}>
                    <h2>{t('companyActivities')}</h2>
                </div>
                {activities.length > 0 ?
                    <div className={'p-3'}>
                        <ActivityList activities={activities} onDelete={handleDeleteActivity} />
                        <CustomPagination
                            currentPage={currentPage}
                            pageCount={pagesCount}
                            onClick={(newPage) => setCurrentPage(newPage)}
                        />
                        <hr />
                        {hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.SUBSCRIBER, RoleEnum.COMPANY_ADMIN]) &&
                            <div className={"d-flex w-100 justify-content-end"}>
                                <Button
                                    onClick={() => navigation(ADD_ACTIVITY_PAGE)}
                                    className={"w-25 m-1"}
                                >
                                    {t('addActivityButton')}
                                </Button>

                                <Button
                                    variant={"success"}
                                    className={"m-1 w-25"}
                                    onClick={handleGetTimeTableClick}
                                >
                                    {t('developOptimalSchedule')}
                                </Button>
                            </div>
                        }
                    </div>
                    :
                    <div className={"d-flex w-100 min-vh-100 flex-column justify-content-center align-items-center"}>
                        <strong>{t('noActivitiesInCompany')}</strong>
                        <div className={"w-100 d-flex justify-content-end"}>
                            <Button
                                className={"mt-3 w-25"}
                                variant={"primary"}
                                onClick={() => navigation(ADD_ACTIVITY_PAGE)}
                            >
                                {t('addButton')}
                            </Button>
                        </div>
                    </div>
                }
            </Container>
    );
});

export default ActivitiesPage;
