import {$authHost} from "./index";

export const fetchCompaniesScanners = async(limit, page) => {
    const { data } = await $authHost.get(`api/scanner`, {
        params: {
            limit,
            page
        }
    });

    return data;
}

export const createScanner = async (formData) => {
    const { data } = await $authHost.post(`api/scanner`, formData);
    return data;
}

export const deleteScanner = async (scannerId) => {
    const { data } = await $authHost.delete(`api/scanner/${scannerId}`);

    return data;
}

export const fetchOneScanner = async (scannerId) => {
    const { data } = await $authHost.get(`api/scanner/${scannerId}`);
    return data;
}

export const updateScanner = async (scannerId, formData) => {
    const { data } = await $authHost.put(`api/scanner/${scannerId}`, formData);
    return data;
}