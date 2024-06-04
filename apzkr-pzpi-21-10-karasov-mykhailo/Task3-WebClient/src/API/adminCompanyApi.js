import {$authHost} from "./index";

export const fetchCompanies = async (limit, page) => {
    const { data } = await $authHost.get(`api/company-admin/`, {
        params: {
            limit,
            page
        }
    });
    return data;
}

export const createCompany = async (formData) => {
    const { data } = await $authHost.post(`api/company-admin/`, formData);
    return data;
}

export const updateCompany = async (companyId, formData) => {
    const { data } = await $authHost.put(`api/company-admin/${companyId}`, formData);
    return data;
}

export const deleteCompany = async (id) => {
    const { data } = await $authHost.delete(`api/company-admin/${id}`);
    return data;
}