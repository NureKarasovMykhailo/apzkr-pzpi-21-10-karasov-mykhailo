import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {fetchActivities} from "../../API/adminActivityApi";
import Loader from "../UI/Loader/Loader";
import {Button, Table} from "react-bootstrap";
import {
    ADMIN_ACTIVITY_PAGE,
    ADMIN_ADD_ACTIVITY_PAGE,
    ADMIN_ADD_EDUCATION,
    ADMIN_COMPANY_PAGE,
    ADMIN_EDUCATION_PAGE
} from "../../utils/consts";
import CustomPagination from "../Pagination/CustomPagination";
import {getTimeInHours} from "../../utils/getTimeInHours";
import {formatTime} from "../../utils/formatTime";

const ActivityComponent = () => {
    const { t }  = useTranslation();
    const tableHeaders = [
        t('activityId'),
        t('activityName'),
        t('requiredWorkerCount'),
        t('timeShift'),
        t('complexity'),
        t('requiredEducation'),
        t('companyId')
    ];

    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState([{}]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);

    useEffect(() => {
        fetchActivities(8, currentPage).then(response => {
            setActivities(response.activities);
            setCurrentPage(response.pagination.currentPage);
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
                    <h2>{t('activities')}</h2>
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
                    {activities.map(activity => (
                        <tr key={activity.id}>
                            <td><a href={ADMIN_ACTIVITY_PAGE.replace(':id', activity.id)}>{activity.id}</a></td>
                            <td>{activity.activityTitle}</td>
                            <td>{activity.requiredWorkerCount}</td>
                            <td>{formatTime(activity.timeShift)}</td>
                            <td>{activity.education?.educationTitle}</td>
                            <td>{activity.complexity?.complexityTitle}</td>
                            <td><a href={ADMIN_COMPANY_PAGE.replace(':id', activity.companyId)}>{activity.companyId}</a></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className={"d-flex justify-content-end"}>
                    <Button
                        variant={"primary"}
                        onClick={() => navigation(ADMIN_ADD_ACTIVITY_PAGE)}
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

export default ActivityComponent;