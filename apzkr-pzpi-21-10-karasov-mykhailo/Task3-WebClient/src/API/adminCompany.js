import {$authHost} from "./index";

export const fetchAdminCompany = async (limit, page) => {
    const { data } = await $authHost.get(`api/company-admin`, {
        params: {
            limit,
            page
        }
    });
    return data;
}

export const fetchCompanyById = async (id) => {
    const { data } = await $authHost.get(`api/company-admin/${id}`);
    return data;
}