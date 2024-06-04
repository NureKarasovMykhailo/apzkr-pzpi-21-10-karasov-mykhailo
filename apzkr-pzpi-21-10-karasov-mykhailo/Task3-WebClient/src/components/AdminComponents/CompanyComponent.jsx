import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {fetchCompanies} from "../../API/adminCompanyApi";
import Loader from "../UI/Loader/Loader";
import {Button, Table} from "react-bootstrap";
import {ADD_COMPLEXITY_ADMIN, ADMIN_ADD_COMPANY, ADMIN_COMPANY_PAGE, ADMIN_COMPLEXITY_PAGE} from "../../utils/consts";
import CustomPagination from "../Pagination/CustomPagination";
import {useNavigate} from "react-router-dom";

const CompanyComponent = () => {
    const { t } = useTranslation();

    const tableHeaders = [
        'Id',
        t('companyName'),
        t('description')
    ];

    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState([{}]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);

    useEffect(() => {
        fetchCompanies(8, currentPage).then(response => {
            setCompanies(response.companies);
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
                    <h2>{t('companies')}</h2>
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
                    {companies.map(company => (
                        <tr key={company.id}>
                            <td><a href={ADMIN_COMPANY_PAGE.replace(':id', company.id)}>{company.id}</a></td>
                            <td>{company.companyName}</td>
                            <td>{company.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className={"d-flex justify-content-end"}>
                    <Button
                        variant={"primary"}
                        onClick={() => navigation(ADMIN_ADD_COMPANY)}
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
    );
};

export default CompanyComponent;