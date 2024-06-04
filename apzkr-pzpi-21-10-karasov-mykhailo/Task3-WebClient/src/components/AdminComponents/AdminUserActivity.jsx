import React from 'react';
import WorkerList from "../Worker/WorkerList/WorkerList";
import {deleteUserFromActivity} from "../../API/adminActivityApi";
import {useTranslation} from "react-i18next";

const AdminUserActivity = ({ users, activityId, onUpdate }) => {
    const { t } = useTranslation();

    const onDelete = async (id) => {
        try {
            const formData = new FormData();
            formData.append('userId', id);
            await deleteUserFromActivity(activityId, formData);
            onUpdate(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <strong>{t('assignedToActivityUsers')}</strong>
            <WorkerList workers={users} onDelete={onDelete} />
        </div>
    );
};

export default AdminUserActivity;