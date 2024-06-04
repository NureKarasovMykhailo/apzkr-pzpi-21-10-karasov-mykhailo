import React, {useState} from 'react';
import {Alert, Button, ListGroup} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {hasUserRole} from "../../../utils/hasUserRole";
import {RoleEnum} from "../../../utils/enums/RoleEnum";
import {deleteRole} from "../../../API/userApi";

const RolesList = ({ roleTitles, userRoles, userId, onDeleteRole }) => {
    const { t } = useTranslation();

    const [error, setError] = useState('');

    const handleDeleteAdminRoleClick = async (roleTitle) => {
        try {
            console.log(roleTitle)
            const formData = new FormData();
            formData.append('roleTitle', roleTitle);
            const response = await deleteRole(userId, formData);
            onDeleteRole(true);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            }
        }
    }

    return (
        <div className={"w-30"}>
            <h2>{t('rolesList')}</h2>
            <ListGroup className={"mt-3"}>
                {roleTitles.map((title, index) => (
                    <ListGroup.Item key={index}>
                        <div className={"d-flex justify-content-between align-items-center"}>
                            {t(title)}
                            { hasUserRole(userRoles, [RoleEnum.COMPANY_ADMIN, RoleEnum.SUBSCRIBER]) &&
                                <Button
                                    variant={"danger"}
                                    onClick={() => handleDeleteAdminRoleClick(title)}
                                >
                                    {t('deleteButton')}
                                </Button>
                            }
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            { error &&
                <Alert
                    className={"mt-3"}
                    variant={"danger"}
                >
                    { error }
                </Alert>
            }
        </div>
    );
};

export default RolesList;