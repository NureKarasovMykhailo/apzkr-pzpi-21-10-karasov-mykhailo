import React, {useContext, useEffect, useState} from 'react';
import {Button, Container} from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import {fetchCompaniesScanners} from "../API/scannerApi";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import ScannerList from "../components/Scanner/ScannerList";
import {hasUserRole} from "../utils/hasUserRole";
import {getRoleTitles} from "../utils/getRoleTitles";
import {RoleEnum} from "../utils/enums/RoleEnum";
import Modal from "../components/UI/Modal/Modal";
import AddScannerModal from "../components/Modal/AddScannerModal/AddScannerModal";
import CustomPagination from "../components/Pagination/CustomPagination";

const ScannersPage = observer(() => {
    const { t } = useTranslation();
    const { userStore } = useContext(Context);

    const [isLoading, setIsLoading] = useState(false);
    const [scanners, setScanners] = useState([{}]);
    const [addModalActive, setAddModalActive] = useState(false);
    const [update, setUpdate] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        setIsLoading(true);
        setUpdate(false);
        setAddModalActive(false);
        fetchCompaniesScanners(12, currentPage).then(response => {
            setScanners(response.scanners);
            setPageCount(response.pagination.totalPages);
            setCurrentPage(response.pagination.currentPage);
            setIsLoading(false);
        });
    }, [update]);


    const handleDeleteClick = (onDelete) => {
        setUpdate(onDelete);
    }

    return (
        isLoading
        ?
        <Container className={"w-100 min-vh-100 d-flex justify-content-center align-items-center border mt-3 mb-3"}>
            <Loader />
        </Container>
        :
        <Container className={"w-100 min-vh-100 border mt-3 mb-3"}>
            <div className={"p-2"}>
                <h2>{t('companyScanners')}</h2>
            </div>
            <div>
                { scanners.length > 0 ?
                    <div className={"h-100"}>
                        <ScannerList scanners={scanners} onDelete={handleDeleteClick} />
                        <CustomPagination
                            pageCount={pageCount}
                            currentPage={currentPage}
                            onClick={(newPage) => setCurrentPage(newPage)}
                        />
                        <div className={"h-100 d-flex justify-content-end align-items-end"}>
                            <Button
                                onClick={() => setAddModalActive(true)}>
                                {t('addButton')}
                            </Button>
                        </div>
                    </div>
                    :
                    <div className={"w-100 min-vh-100 d-flex flex-column justify-content-center align-items-center text-black"}>
                        <h5>{t('yourCompanyHasNoScanner')}</h5>
                        {hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.SUBSCRIBER, RoleEnum.COMPANY_ADMIN]) &&
                            <div className={"w-100 d-flex justify-content-center"}>
                                <Button
                                    variant={"primary"}
                                    className={"w-25 mt-3"}
                                    onClick={() => setAddModalActive(true)}
                                >
                                    {t('addButton')}
                                </Button>
                            </div>
                        }
                    </div>
                }
            </div>
            <Modal
                setActive={setAddModalActive}
                active={addModalActive}
            >
                <AddScannerModal onScannerAdd={(onAdd) => setUpdate(onAdd)} />
            </Modal>
        </Container>

    );
});

export default ScannersPage;