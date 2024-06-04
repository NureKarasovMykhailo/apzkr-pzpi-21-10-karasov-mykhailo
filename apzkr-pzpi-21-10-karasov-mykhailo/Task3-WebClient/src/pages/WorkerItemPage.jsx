import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {addRole, fetchUserById} from "../API/userApi";
import {Alert, Button, Container} from "react-bootstrap";
import Loader from "../components/UI/Loader/Loader";
import WorkerItem from "../components/Worker/WorkerItem/WorkerItem";
import RolesList from "../components/Worker/RolesList/RolesList";
import {getRoleTitles} from "../utils/getRoleTitles";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {hasUserRole} from "../utils/hasUserRole";
import {RoleEnum} from "../utils/enums/RoleEnum";


const WorkerItemPage = observer(() => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { userStore } = useContext(Context);

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [educations, setEducations] = useState([{}]);
    const [roles, setRoles] = useState([{}]);
    const [update, setUpdate] = useState(false);
    const [roleError, setRoleError] = useState('');

    const handleAddAdminRoleClick = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('roleTitle', RoleEnum.COMPANY_ADMIN);
            const response = await addRole(user.id, formData);
            console.log(response);
            setUpdate(true);
        } catch (error) {
            if (error.response) {
                setRoleError(error.response.data.message);
            }
            setIsLoading(false);
        }
    }

    const handleRoleDeleted = (onDeleteRole) => {
        setUpdate(onDeleteRole);
    }

    useEffect(() => {
        setRoleError('');
        setIsLoading(true);
        setUpdate(false);
        fetchUserById(id).then(response => {
            setUser(response.user);
            setEducations(response.educations);
            setRoles(response.role);
            setIsLoading(false);
        });
    }, [update]);

    console.log(getRoleTitles(userStore.user.roles))

    return (
        !isLoading
        ?
        <Container className={"w-100 min-vh-100 d-flex justify-content-between  border mt-3 mb-3"}>
            <div className={"w-100"}>
                <WorkerItem worker={user} educations={educations}/>
                <hr/>
                <div className={"pb-3 w-30"}>
                    <RolesList roleTitles={getRoleTitles(roles)} userRoles={getRoleTitles(userStore.user.roles)} userId={user.id} onDeleteRole={handleRoleDeleted} />
                </div>
                { hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.COMPANY_ADMIN, RoleEnum.SUBSCRIBER])  &&
                    <div>
                        <Button
                            variant={"primary"}
                            onClick={handleAddAdminRoleClick}
                        >
                            {t('addCompanyAdminRole')}
                        </Button>
                        { roleError &&
                            <Alert
                                variant={"danger"}
                                className={"mt-3"}
                            >
                                {roleError}
                            </Alert>
                        }
                    </div>
                }
            </div>


        </Container>
        :
        <Container className={"w-100 min-vh-100 d-flex justify-content-center align-items-center border mt-3 mb-3"}>
            <Loader />
        </Container>

    );
});

export default WorkerItemPage;