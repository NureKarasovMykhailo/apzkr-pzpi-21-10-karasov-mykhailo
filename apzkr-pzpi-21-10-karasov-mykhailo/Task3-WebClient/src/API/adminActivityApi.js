import {$authHost} from "./index";

export const fetchActivities = async (limit, page) => {
    const { data } = await $authHost.get(`api/activity-admin`, {
        params: {
            limit,
            page
        }
    });

    return data;
}

export const createActivity = async (formData) => {
    const { data } = await $authHost.post(`api/activity-admin/`, formData);
    return data;
}

export const fetchActivityById = async (id) => {
    const { data } = await $authHost.get(`api/activity-admin/${id}`);
    return data;
}

export const updateActivity = async (id, formData) => {
    const { data } = await $authHost.put(`api/activity-admin/${id}`, formData);
    return data;
}

export const deleteActivity = async (id) => {
    const { data } = await $authHost.delete(`api/activity-admin/${id}`);
    return data;
}

export const deleteUserFromActivity = async (id, formData) => {
    const { data } = await $authHost.post(`api/activity-admin/delete-employee/${id}`, formData);
    return data;
}

export const addUserToActivity = async (id, formData) => {
    const { data } = await $authHost.post(`api/activity-admin/add-employee/${id}`, formData);
    return data;
}