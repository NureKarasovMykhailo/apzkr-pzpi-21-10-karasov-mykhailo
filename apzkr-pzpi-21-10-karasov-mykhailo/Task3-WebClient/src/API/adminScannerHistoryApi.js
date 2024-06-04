import {$authHost} from "./index";

export const fetchScannerHistory = async (limit, page) => {
    const { data } = await $authHost.get(`api/admin-scanner-history/`, {
        params: {
            limit,
            page
        }
    });
    return data;
}

export const createScannerHistory = async (formData) => {
    const { data } = await $authHost.post(`api/admin-scanner-history/`, formData);
    return data;
}

export const fetchScannerHistoryById = async (id) => {
    const { data } = await $authHost.get(`api/admin-scanner-history/${id}`);
    return data;
}

export const updateScannerHistory = async (id, formData) => {
    const { data } = await $authHost.put(`api/admin-scanner-history/${id}`, formData);
    return data;
}

export const deleteScannerHistory = async (id) => {
    const { data } = await $authHost.delete(`api/admin-scanner-history/${id}`);
    return data;
}