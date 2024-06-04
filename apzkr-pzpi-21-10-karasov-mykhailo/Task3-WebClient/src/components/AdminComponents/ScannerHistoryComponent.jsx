import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {fetchScanners} from "../../API/adminScannerApi";
import Loader from "../UI/Loader/Loader";
import {Button, Table} from "react-bootstrap";
import {
    ADMIN_ADD_SCANNER,
    ADMIN_ADD_SCANNER_HISTORY,
    ADMIN_COMPANY_PAGE,
    ADMIN_ONE_SCANNER, ADMIN_ONE_SCANNER_HISTORY,
    ADMIN_USER_PAGE
} from "../../utils/consts";
import CustomPagination from "../Pagination/CustomPagination";
import {fetchScannerHistory} from "../../API/adminScannerHistoryApi";
import {getTimeInHours} from "../../utils/getTimeInHours";
import {formatTime} from "../../utils/formatTime";

const ScannerHistoryComponent = () => {
    const navigation = useNavigate();
    const { t } = useTranslation();
    const tableHeaders = [
        'Id',
        t('temperature'),
        t('pulse'),
        t('activeWorkTime'),
        t('userId')
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [scannerHistories, setScannerHistories] = useState([{}]);
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setIsLoading(true);
        fetchScannerHistory(8, currentPage).then(response => {
            console.log(response)
            setScannerHistories(response.scannerHistories);
            setPagesCount(response.pagination.currentPage);
            setPagesCount(response.pagination.totalPages);

            setIsLoading(false);
        });
    }, [currentPage]);

    return (
        isLoading ?
            <div className={"h-100 d-flex justify-content-center align-items-center"}>
                <Loader />
            </div>
            :
            <div className={"h-100"}>
                <div>
                    <h2>{t('scannerHistories')}</h2>
                </div>
                <hr/>
                <Table striped border hover>
                    <thead>
                    <tr>
                        {tableHeaders.map(header => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {scannerHistories.map(history => (
                        <tr key={history.id}>
                            <td><a href={ADMIN_ONE_SCANNER_HISTORY.replace(':id', history.id)}>{history.id}</a></td>
                            <td>{history.temperature}°C </td>
                            <td>{history.pulse} уд.з.хв</td>
                            <td>{formatTime(history.activeWorkedTime)}</td>
                            <td><a href={ADMIN_USER_PAGE.replace(':id', history.userId)}>{history.userId}</a></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className={"d-flex justify-content-end"}>
                    <Button
                        variant={"primary"}
                        onClick={() => navigation(ADMIN_ADD_SCANNER_HISTORY)}
                    >
                        {t('addButton')}
                    </Button>
                </div>
                <div>
                    <CustomPagination
                        currentPage={currentPage}
                        pageCount={pagesCount}
                        onClick={(newPage) => setCurrentPage(newPage)}
                    />
                </div>

            </div>
    )
};

export default ScannerHistoryComponent;