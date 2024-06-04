import React, {useEffect, useState} from 'react';
import Loader from "../UI/Loader/Loader";
import {fetchUsers} from "../../API/adminUserApi";
import {Button, Table} from "react-bootstrap";
import {ADD_COMPLEXITY_ADMIN, ADMIN_ADD_USER_PAGE, ADMIN_USER_PAGE} from "../../utils/consts";
import CustomPagination from "../Pagination/CustomPagination";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const UserComponent = () => {
    const { t } = useTranslation();

    const tableHeaders = [
        'Id',
        'Email',
        t('surname'),
        t('name')
    ];

    const navigation = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([{}]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        fetchUsers(8, currentPage).then(response => {
            setUsers(response.users);
            setPagesCount(response.pagination.totalPages);
            setCurrentPage(response.pagination.currentPage);
            setIsLoading(false);
        });
    }, [currentPage]);

    return (
        isLoading ?
            <div className={"d-flex min-vh-100 align-items-center"}>
                <Loader />
            </div>
            :
            <div>
                <div>
                    <h2>{t('users')}</h2>
                </div>
                <hr />
                <Table striped border hover>
                    <thead>
                    <tr>
                        {tableHeaders.map(header => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td><a href={ADMIN_USER_PAGE.replace(":id", user.id)}>{user.id}</a></td>
                            <td>{user.email}</td>
                            <td>{user.secondName}</td>
                            <td>{user.firstName}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <div className={"d-flex justify-content-end"}>
                    <Button
                        variant={"primary"}
                        onClick={() => navigation(ADMIN_ADD_USER_PAGE)}
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

export default UserComponent;