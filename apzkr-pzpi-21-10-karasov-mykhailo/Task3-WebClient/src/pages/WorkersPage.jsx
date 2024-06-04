import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { deleteWorker, fetchCompanyUsers } from "../API/companyApi";
import { observer } from "mobx-react-lite";
import Loader from "../components/UI/Loader/Loader";
import '../styles/WorkerPage.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ADD_WORKER_ITEM_PAGE, ADD_WORKER_PAGE, COMPANY_WORKER_ITEM_PAGE, PROFILE_PAGE_PATH } from "../utils/consts";
import { calculateAge } from "../utils/calculateAge";
import CustomPagination from "../components/Pagination/CustomPagination";
import { Context } from "../index";
import { hasUserRole } from "../utils/hasUserRole";
import { getRoleTitles } from "../utils/getRoleTitles";
import { RoleEnum } from "../utils/enums/RoleEnum";

const WorkersPage = observer(() => {
    const { t } = useTranslation();
    const { userStore } = useContext(Context);
    const navigation = useNavigate();

    const [workers, setWorkers] = useState([{}]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [update, setUpdate] = useState(false);

    const handleDeleteWorkerClick = async (id) => {
        try {
            setIsLoading(true);
            const response = await deleteWorker(id);
            setUpdate(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleUserDetailClick = (id) => {
        if (id === userStore.user.id) {
            navigation(PROFILE_PAGE_PATH);
        } else {
            navigation(COMPANY_WORKER_ITEM_PAGE.replace(':id', id));
        }
    }

    useEffect(() => {
        setIsLoading(true);
        setUpdate(false);
        fetchCompanyUsers(8, currentPage).then(response => {
            setWorkers(response.users)
            setCurrentPage(response.pagination.currentPage);
            setPageCount(response.pagination.totalPages);
            setIsLoading(false);
        });
    }, [currentPage, update]);

    return (
        !isLoading ?
            <div className={"worker-page__container w-100 border p-3 m-2"}>
                {workers.length === 0 ?
                    <div className={"worker-page__empty-container"}>
                        <h3>{t('yourCompanyHasNoUser')}</h3>
                        <p className={"worker-page__empty-container-label"}>{t('addWorkerNow')}</p>
                        <div className={"w-50 p-3"}>
                            {hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.SUBSCRIBER, RoleEnum.COMPANY_ADMIN]) &&
                                <Button
                                    className={"w-100"}
                                    onClick={() => navigation(ADD_WORKER_PAGE)}
                                >
                                    {t('addButton')}
                                </Button>
                            }
                        </div>
                    </div>
                    :
                    <Container className={"w-100 "} style={{ minHeight: "100vh", height: "auto" }}>
                        <h3>{t('companyWorkers')}</h3>
                        <Row className={"d-flex"}>
                            {workers.map(user => (
                                <Col key={user.id} md={3} className={"mt-3"}>
                                    <Card>
                                        <div className={"d-flex justify-content-center p-2"}>
                                            <Image width={150} height={150} src={process.env.REACT_APP_API_URL + user.userImage} />
                                        </div>
                                        <div className={"text-black-50 mt-1 justify-content-between align-items-center p-1"}>
                                            <hr />
                                            <div>{t('email')}: {user.email}</div>
                                            <div>{t('firstName')}: {user.firstName}</div>
                                            <div>{t('secondName')}: {user.secondName}</div>
                                            <div>{t('age')}: {calculateAge(user.birthday)}</div>
                                            <div className={"w-100 p-2"}>
                                                <Button
                                                    variant={"outline-primary"}
                                                    className={"w-100"}
                                                    onClick={() => handleUserDetailClick(user.id)}
                                                >
                                                    {t('viewButton')}
                                                </Button>
                                                {hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.COMPANY_ADMIN, RoleEnum.SUBSCRIBER]) &&
                                                    <Button
                                                        variant={"outline-danger"}
                                                        className={"w-100 mt-3"}
                                                        onClick={() => handleDeleteWorkerClick(user.id)}
                                                        disabled={user.id === userStore.user.id}
                                                    >
                                                        {t('deleteButton')}
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div className={"w-100 mt-3"}>
                            <CustomPagination
                                pageCount={pageCount}
                                currentPage={currentPage}
                                onClick={(newPage) => setCurrentPage(newPage)}
                            />
                        </div>
                        <hr />
                        <div className={"w-100 d-flex justify-content-end"}>
                            {hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.SUBSCRIBER, RoleEnum.COMPANY_ADMIN]) &&
                                <Button
                                    variant={"primary"}
                                    onClick={() => navigation(ADD_WORKER_PAGE)}
                                >
                                    {t('addWorkersButton')}
                                </Button>
                            }
                        </div>
                    </Container>
                }
            </div>
            :
            <Container className={"worker-page__container"}>
                <Loader />
            </Container>
    );
});

export default WorkersPage;
