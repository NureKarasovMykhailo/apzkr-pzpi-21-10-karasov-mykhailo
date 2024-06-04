import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {fetchOneScanner, updateScanner} from "../API/scannerApi";
import {Alert, Button, Container, Form, FormLabel} from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import {useTranslation} from "react-i18next";
import SmallWorkerItem from "../components/Worker/SmallWorkerItem/SmallWorkerItem";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {hasUserRole} from "../utils/hasUserRole";
import {RoleEnum} from "../utils/enums/RoleEnum";
import {getRoleTitles} from "../utils/getRoleTitles";
import {fetchCompanyUsers} from "../API/companyApi";
import {clearScannerHistory, fetchScannerHistoryByScannerId} from "../API/scannerHistoryApi";
import ScannerHistoryList from "../components/ScannerHistory/ScannerHistoryList";
import CustomPagination from "../components/Pagination/CustomPagination";

const OneScannerPage = observer(() => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { userStore } = useContext(Context);

    const [scanner, setScanner] = useState();
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [descriptionPreview, setDescriptionPreview] = useState('');
    const [isUpdate, setUpdate] = useState(false);
    const [isSetUser, setIsSetUser] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [error, setError] = useState('');
    const [scannerHistories, setScannerHistories] = useState([{}]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setIsLoading(true);
        setIsEdit(false);
        setIsSetUser(false);
        setUpdate(false);
        setError('');
        fetchOneScanner(id).then(response => {
            setScanner(response.scanner);
            setUser(response.scanner.user);
            setDescriptionPreview(response.scanner.description);
            fetchScannerHistoryByScannerId(id, 8, currentPage).then(fetchHistoryResponse => {
                setScannerHistories(fetchHistoryResponse.scannerHistories);
                setPageCount(fetchHistoryResponse.pagination.totalPages);
                setCurrentPage(fetchHistoryResponse.pagination.currentPage);
                setIsLoading(false);
            })
        });
    }, [isUpdate, currentPage]);

    const handleDescriptionCancelClick = (e) => {
        setIsEdit(false);
        setDescriptionPreview(scanner.description);
    }

    const handleUpdateScanner = async (userId) => {
        const formData = new FormData();
        if (isEdit) {
            formData.append('description', descriptionPreview);
        } else {
            formData.append('description', scanner.description);
        }

        formData.append('userId', userId);

        try {
            const response = await updateScanner(scanner.id, formData);
            setUpdate(true);
        } catch (error) {

        }
    }

    const handleChangeEmail = (e) => {
        setUserEmail(e.target.value);
    }

    const handleSetScanner = async () => {
        try {
            const response = await fetchCompanyUsers(1, 1, userEmail);
            if (response.users.length > 0) {
                await handleUpdateScanner(response.users[0].id);
            } else {
                setError(t('userWithThisEmailDoesNotExist'))
            }
        } catch (error) {

        }
    }

    const onDeleteScannerHistory = (onDelete) => {
        setUpdate(onDelete);
    }

    const handleClearScannerHistory = async () => {
        try {
            await clearScannerHistory(scanner.id);
            setUpdate(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        isLoading
            ?
            <Container className={"min-vh-100 w-100 border mt-3 mb-3 d-flex justify-content-center align-items-center"}>
                <Loader />
            </Container>
            :
            <Container className={"min-vh-100 w-100 border mt-3 mb-3 p-3"}>
                <div>
                    <h3>{t('scanner')}</h3>
                </div>
                <div className={"mt-3"}>
                    <Form>
                        <strong>{t('scannerId')}: {scanner.id}</strong>
                        <Form.Group className={"mb-3"} controlId={"description"}>
                            <Form.Label>{t('description')}</Form.Label>
                            <Form.Control
                                as={"textarea"}
                                rows={3}
                                value={descriptionPreview}
                                onChange={(e) => setDescriptionPreview(e.target.value)}
                                disabled={!isEdit}
                                name={"description"}
                            />
                        </Form.Group>
                        <div className={"w-100 d-flex justify-content-end"}>
                            { isEdit
                                ?
                                <div>
                                    <Button
                                        variant={"primary"}
                                        className={"m-1"}
                                        onClick={() => handleUpdateScanner(user ? user.id : null)}
                                    >
                                        {t('acceptButton')}
                                    </Button>
                                    <Button
                                        variant={"danger"}
                                        onClick={handleDescriptionCancelClick}
                                    >
                                        {t('cancelButton')}
                                    </Button>
                                </div>
                                :
                                <div>
                                    { hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.COMPANY_ADMIN, RoleEnum.SUBSCRIBER]) &&
                                        <Button
                                            variant={"success"}
                                            onClick={() => setIsEdit(true)}
                                        >
                                            {t('editButton')}
                                        </Button>
                                    }
                                </div>
                            }
                        </div>

                        <hr />
                        <div>
                            <p>{t('assignedEmployee')}</p>
                        </div>
                        {user
                            ?
                            <div>
                                <SmallWorkerItem worker={user}>
                                    { hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.COMPANY_ADMIN, RoleEnum.SUBSCRIBER]) &&
                                        <Button
                                            variant={"danger"}
                                            onClick={(e) => handleUpdateScanner(null)}
                                        >
                                            {t('unpin')}
                                        </Button>
                                    }
                                </SmallWorkerItem>
                            </div>
                            :
                            <div className={"d-flex flex-column align-items-center"}>
                                {!isSetUser && <p>{t('scannerIsNotPin')}</p>}
                                { hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.COMPANY_ADMIN, RoleEnum.SUBSCRIBER]) &&
                                    <div className={"w-100 d-flex justify-content-center"}>
                                        { !isSetUser
                                            ?
                                            <Button
                                                variant={"primary"}
                                                className={"mt-3"}
                                                onClick={() => setIsSetUser(true)}
                                            >
                                                {t('pin')}
                                            </Button>
                                            :
                                            <Form className={"d-flex flex-column align-items-center w-100"}>
                                                <Form.Group className={"mt-3 w-100"} controlId={"userId"}>
                                                    <Form.Control
                                                        name={"userId"}
                                                        type={"email"}
                                                        className={"w-50"}
                                                        onChange={handleChangeEmail}
                                                        value={userEmail}
                                                    />
                                                </Form.Group>
                                                { error &&
                                                    <Alert className={"mt-3 w-100"} variant={"danger"}>{error}</Alert>
                                                }
                                                <div className={"w-100 d-flex justify-content-end"}>
                                                    <Button
                                                        variant={"primary"}
                                                        className={"m-1"}
                                                        onClick={handleSetScanner}
                                                    >
                                                        {t('acceptButton')}
                                                    </Button>

                                                    <Button
                                                        variant={"danger"}
                                                        className={"m-1"}
                                                        onClick={() => setIsSetUser(false)}
                                                    >
                                                        {t('cancelButton')}
                                                    </Button>
                                                </div>
                                            </Form>
                                        }
                                    </div>
                                }
                            </div>
                        }
                        <hr/>
                        <div>
                            <strong>{t('informationFromThisScanner')}</strong>
                            {hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.COMPANY_ADMIN, RoleEnum.SUBSCRIBER]) &&
                                <div className={"w-100 pt-3 d-flex justify-content-start"}>
                                    <Button
                                        variant={"danger"}
                                        onClick={handleClearScannerHistory}
                                    >
                                        {t('clearScannerHistory')}
                                    </Button>
                                </div>
                            }
                            <ScannerHistoryList
                                scannerHistories={scannerHistories}
                                showUser={true}
                                onUpdate={onDeleteScannerHistory}
                            />
                            <CustomPagination
                                currentPage={currentPage}
                                pageCount={pageCount}
                                onClick={(newPage) => setCurrentPage(newPage)}
                            />
                        </div>
                    </Form>
                </div>
            </Container>
    );
});

export default OneScannerPage;