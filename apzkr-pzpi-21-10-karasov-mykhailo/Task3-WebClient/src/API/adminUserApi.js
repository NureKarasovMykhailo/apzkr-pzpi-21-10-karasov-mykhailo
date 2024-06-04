import {$authHost} from "./index";

export const fetchUsers = async (limit, page, email = '') => {
    const { data } = await $authHost.get(`api/admin-user/`, {
        params: {
            limit,
            page,
            email
        }
    });
    return data;
}

export const createUser = async (formData) => {
    const { data } = await $authHost.post(`api/admin-user/`, formData);
    return data;
}

export const fetchUserById = async (id) => {
    const { data } = await $authHost.get(`api/admin-user/${id}`);
    return data;
}

export const updateUser = async (id, formData) => {
    const { data } = await $authHost.put(`api/admin-user/${id}`, formData);
    return data;
}

export const deleteUser = async (id) => {
    const { data } = await $authHost.delete(`api/admin-user/${id}`);
    return data;
}

export const deleteEducation = async (id, formData) => {
    const { data } = await $authHost.patch(`api/admin-user/delete-education/${id}`, formData);
    return data;
}

export const addEducation = async (id, formData) => {
    const { data } = await $authHost.patch(`api/admin-user/add-education/${id}`, formData);
    return data;
}