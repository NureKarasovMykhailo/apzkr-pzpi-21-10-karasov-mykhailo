import React, {useEffect, useState} from 'react';
import {fetchEducations} from "../../API/educationApi";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../UI/Loader/Loader";
import {Button, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {ADMIN_ADD_EDUCATION, ADMIN_EDUCATION_PAGE} from "../../utils/consts";

const EducationComponent = () => {
    const navigation = useNavigate();
    const { t } = useTranslation();
    const tableHeaders = [
        'Id',
        t('educationName'),
        t('description')
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [educations, setEducations] = useState([{}]);
    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchEducations(8, currentPage).then(response => {
           setEducations(response.educations);
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
                    <h2>{t('educationName')}</h2>
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
                    {educations.map(education => (
                        <tr key={education.id}>
                            <td><a href={ADMIN_EDUCATION_PAGE.replace(':id', education.id)}>{education.id}</a></td>
                            <td>{education.educationTitle}</td>
                            <td>{education.description}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className={"d-flex justify-content-end"}>
                    <Button
                        variant={"primary"}
                        onClick={() => navigation(ADMIN_ADD_EDUCATION)}
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

export default EducationComponent;