import {$authHost} from "./index";

export const fetchScanners = async (limit, page) => {
    const { data } = await $authHost.get(`api/scanner-admin/`, {
        params: {
            limit,
            page
        }
    });
    return data;
}

export const createScanner = async (formData) => {
    const { data } = await $authHost.post(`api/scanner-admin/`, formData);
    return data;
}

export const getScannerById = async (id) => {
    const { data } = await $authHost.get(`api/scanner-admin/${id}`);
    return data;
}

export const updateScanner = async (id, formData) => {
    const { data } = await $authHost.put(`api/scanner-admin/${id}`, formData);
    return data;
}

export const deleteScanner = async (id) => {
    const { data } = await $authHost.delete(`api/scanner-admin/${id}`);
    return data;
}