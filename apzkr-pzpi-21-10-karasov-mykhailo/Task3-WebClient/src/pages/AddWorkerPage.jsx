import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import '../styles/AddWorkerPage.css';
import { fetchUsersWithoutCompany } from "../API/userApi";
import { calculateAge } from "../utils/calculateAge";
import CustomPagination from "../components/Pagination/CustomPagination";
import { useNavigate } from "react-router-dom";
import { ADD_WORKER_ITEM_PAGE } from "../utils/consts";
import { useTranslation } from "react-i18next";

const AddWorkerPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([{}]);
    const [totalCount, setTotalCount] = useState(0);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const navigation = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        setIsLoading(true);
        fetchUsersWithoutCompany(8, currentPage).then(response => {
            setUsers(response.users);
            setTotalCount(response.pagination.totalItems);
            setPages(response.pagination.totalPages);
            setCurrentPage(response.pagination.currentPage);
            setIsLoading(false);
        });
    }, [currentPage]);

    return (
        isLoading
            ?
            <Container
                className={'add-worker__container w-100 d-flex justify-content-center align-items-center border m-3'}
            >
                <Loader />
            </Container>
            :
            <Container
                className={'add-worker__container m-3 border p-4'}
                style={{ height: "100%" }}
            >
                <h2>{t('users')}:</h2>
                <hr />
                {users.length > 0
                    ?
                    <Row className={"d-flex"}>
                        {users.map(user => (
                            <Col key={user.id} md={3} className={"mt-3"} >
                                <Card>
                                    <div className={"d-flex justify-content-center"}>
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
                                                onClick={() => navigation(ADD_WORKER_ITEM_PAGE.replace(':id', user.id))}
                                            >
                                                {t('viewButton')}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    :
                    <div className={"w-100 h-100 d-flex align-items-center justify-content-center"} style={{ height: "100vh" }}>
                        <h3>{t('noUsersToAdd')}</h3>
                    </div>
                }
                <div
                    className={"h-100 d-flex p-4"}
                >
                    <CustomPagination pageCount={pages} currentPage={currentPage} onClick={(newPage) => setCurrentPage(newPage)} />
                </div>
            </Container>
    );
};

export default AddWorkerPage;
