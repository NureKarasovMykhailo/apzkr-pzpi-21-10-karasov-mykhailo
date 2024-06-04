import {$authHost} from "./index";

export const fetchActivity = async (
    limit = 8,
    page = 1
) => {
    const { data } = await $authHost.get(`api/activity`, {
        limit,
        page
    });

    return data;
}

export const createActivity = async (formData) => {
    const { data } = await $authHost.post(`api/activity`, formData);
    return data;
}

export const deleteActivity = async (activityId) => {
    const { data } = await $authHost.delete(`api/activity/${activityId}`)
    return data;
}

export const fetchActivityById = async (activityId) => {
    const { data } = await $authHost.get(`api/activity/${activityId}`);
    return data;
}

export const updateActivityById = async (activityId, formData) => {
    const { data } = await $authHost.put(`api/activity/${activityId}`, formData);
    return data;
}

export const addWorkerToActivity = async (activityId, formData) => {
    const { data } = await $authHost.post(`api/activity/add-employee/${activityId}`, formData);
    return data;
}

export const deleteWorkerFromActivity = async (activityId, formData) => {
    const { data } = await $authHost.post   (`api/activity/delete-employee/${activityId}`, formData);
    return data;
}
