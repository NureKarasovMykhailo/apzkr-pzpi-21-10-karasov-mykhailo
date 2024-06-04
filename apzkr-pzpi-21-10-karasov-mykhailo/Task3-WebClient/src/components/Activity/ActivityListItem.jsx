import React, {useContext} from 'react';
import {Button, Card, Col} from "react-bootstrap";
import {formatTime} from "../../utils/formatTime";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {hasUserRole} from "../../utils/hasUserRole";
import {getRoleTitles} from "../../utils/getRoleTitles";
import {RoleEnum} from "../../utils/enums/RoleEnum";
import {deleteActivity} from "../../API/activityApi";
import {useNavigate} from "react-router-dom";
import {ACTIVITY_PAGE} from "../../utils/consts";
import {useTranslation} from "react-i18next";

const ActivityListItem = observer(({ activity, onDelete }) => {
    const { userStore } = useContext(Context);
    const { t } = useTranslation();
    const navigation = useNavigate();

    const handleDeleteActivity = async (activityId) => {
        try {
            await deleteActivity(activityId);
            onDelete(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Col md={4} className={"p-3"}>
            <Card className={"d-flex p-3"}>
                <div className={"d-flex w-100 justify-content-center h-100"} >
                    <strong>{ activity.activityTitle }</strong>
                </div>
                <hr />
                <div className={"mt-2 w-100"}>
                    <p><strong>{t('description')}:</strong> {activity.description}</p>
                </div>
                <div>
                    <p><strong>{t('requiredEducation')}:</strong> {activity.education.educationTitle}</p>
                    <p><strong>{t('timeShift')}:</strong> {formatTime(activity.timeShift)} </p>
                    <p><strong>{t('requiredWorkerCount')}:</strong> {activity.requiredWorkerCount} </p>
                </div>
                < hr/>
                <div className={"mt-3 w-100 d-flex flex-column align-items-center"}>
                    <Button
                        className={"w-50"}
                        variant={"outline-primary"}
                        onClick={() => navigation(ACTIVITY_PAGE.replace(':id', activity.id))}
                    >
                        {t('seeDetailButton')}
                    </Button>
                    { hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.SUBSCRIBER, RoleEnum.COMPANY_ADMIN]) &&
                        <Button
                            className={"w-50 mt-3"}
                            variant={"outline-danger"}
                            onClick={() => handleDeleteActivity(activity.id)}
                        >
                            {t('deleteButton')}
                        </Button>
                    }
                </div>
            </Card>
        </Col>
    );
});

export default ActivityListItem;