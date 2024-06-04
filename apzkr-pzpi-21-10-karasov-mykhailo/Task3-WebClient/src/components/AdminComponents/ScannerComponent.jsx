import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Loader from "../UI/Loader/Loader";
import {Button, Table} from "react-bootstrap";
import {
    ADMIN_ADD_EDUCATION,
    ADMIN_ADD_SCANNER,
    ADMIN_COMPANY_PAGE,
    ADMIN_EDUCATION_PAGE, ADMIN_ONE_SCANNER,
    ADMIN_USER_PAGE
} from "../../utils/consts";
import CustomPagination from "../Pagination/CustomPagination";
import {fetchScanners} from "../../API/adminScannerApi";

const ScannerComponent = () => {
    const navigation = useNavigate();
    const { t } = useTranslation();
    const tableHeaders = [
        'Id',
        t('description'),
        t('companyId'),
        t('userId')
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [scanners, setScanners] = useState([{}]);
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setIsLoading(true);
        fetchScanners(8, currentPage).then(response => {
            setScanners(response.paginatedItems);
            setPagesCount(response.pagination.currentPage);
            setPagesCount(response.pagination.totalPages);
            console.log(response)
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
                    <h2>{t('scanners')}</h2>
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
                    {scanners.map(scanner => (
                        <tr key={scanner.id}>
                            <td><a href={ADMIN_ONE_SCANNER.replace(':id', scanner.id)}>{scanner.id}</a></td>
                            <td>{scanner.description}</td>
                            <td><a href={ADMIN_COMPANY_PAGE.replace(':id', scanner.companyId)}>{scanner.companyId}</a></td>
                            <td><a href={ADMIN_USER_PAGE.replace(':id', scanner.userId)}>{scanner.userId}</a></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className={"d-flex justify-content-end"}>
                    <Button
                        variant={"primary"}
                        onClick={() => navigation(ADMIN_ADD_SCANNER)}
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

export default ScannerComponent;