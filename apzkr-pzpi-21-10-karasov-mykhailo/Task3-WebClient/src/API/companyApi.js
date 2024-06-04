import {$authHost} from "./index";

export const createCompany = async (formData) => {
    const { data } = await $authHost.post(`api/public-company`, formData);
    return data;
}

export const fetchCompanyByToken = async () => {
    const { data } = await $authHost.get(`api/public-company/`);
    return data;
}

export const updateCompany = async (formData) => {
    const { data } = await $authHost.patch(`api/public-company/`, formData);
    return data;
}

export const deleteCompanyByToken = async () => {
    const { data } = await $authHost.delete(`api/public-company/`);
    return data;
}

export const fetchCompanyUsers = async (
    limit = 8,
    page = 1,
    email = ''
) => {
    const { data } = await $authHost.get(`api/public-company/employees`, {
        params: {
            limit,
            page,
            email
        }
    });
    return data;
}

export const addWorker = async (id) => {
    const { data } = await $authHost.post(`api/public-company/add-employee/${id}`);
    return data;
}

export const deleteWorker = async(id) => {
    const { data } = await $authHost.delete(`api/public-company/delete-employee/${id}`);
    return data;

}