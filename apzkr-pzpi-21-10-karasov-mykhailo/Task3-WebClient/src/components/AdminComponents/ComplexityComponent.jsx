import React, {useEffect, useState} from 'react';
import {fetchComplexities} from "../../API/complexityApi";
import Loader from "../UI/Loader/Loader";
import {Button, Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import CustomPagination from "../Pagination/CustomPagination";
import {useNavigate} from "react-router-dom";
import {ADD_COMPLEXITY_ADMIN, ADMIN_COMPLEXITY_PAGE} from "../../utils/consts";

const ComplexityComponent = () => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const [complexities, setComplexities] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);

    const tableHeaders = [
        'Id',
        t('complexity'),
        t('numericalCoefficient')
    ];

    useEffect(() => {
        setIsLoading(true);
        fetchComplexities(8, currentPage).then(response => {
            setComplexities(response.complexities);
            setPagesCount(response.pagination.totalPages);
            setCurrentPage(response.pagination.currentPage);
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
                    <h2>{t('complexities')}</h2>
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
                    {complexities.map(complexity => (
                        <tr key={complexity.id}>
                            <td><a href={ADMIN_COMPLEXITY_PAGE.replace(':id', complexity.id)}>{complexity.id}</a></td>
                            <td>{complexity.complexityTitle}</td>
                            <td>{complexity.evaluation}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className={"d-flex justify-content-end"}>
                    <Button
                        variant={"primary"}
                        onClick={() => navigation(ADD_COMPLEXITY_ADMIN)}
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

export default ComplexityComponent;