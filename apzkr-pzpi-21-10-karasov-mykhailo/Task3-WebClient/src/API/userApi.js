import {$authHost} from "./index";

export const updateProfile = async (formData) => {
    const { data } = await $authHost.patch('api/public-user/', formData);

    return data;
}

export const subscribeRequest = async () => {
    const { data } = await $authHost.post('api/public-user/subscribe');

    return data;
}

export const fetchUserByToken = async () => {
    const { data } = await $authHost.get(`api/public-user/`);

    return data;
}

export const addUserEducation = async (formData) => {
    const { data } = await $authHost.put(`api/public-user/add-education`, formData);
    return data;
}

export const deleteUserEducation = async (formData) => {
    const { data } = await $authHost.put(`api/public-user/delete-education`, formData);
    return data;
}

export const fetchUsersWithoutCompany = async (
    limit = 1,
    page = 1
) => {
    const { data } = await $authHost.get(`api/public-company/users/without-company`, {
        params: {
            limit: limit,
            page: page
        }
    });
    return data;
}

export const fetchUserById = async (userId) => {
    const { data } = await $authHost.get(`api/admin-user/${userId}`);
    return data;
}

export const addRole = async (userId, formData) => {
    const { data } = await $authHost.patch(`api/admin-user/add-role/${userId}`, formData);
    return data;
}

export const deleteRole = async (userId, formData) => {
    const { data } = await $authHost.patch(`api/admin-user/delete-role/${userId}`, formData)
}