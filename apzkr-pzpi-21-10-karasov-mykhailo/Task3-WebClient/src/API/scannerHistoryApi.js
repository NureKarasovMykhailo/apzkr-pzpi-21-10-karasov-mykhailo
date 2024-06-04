import {$authHost} from "./index";

export const fetchScannerHistoryByScannerId = async (
    scannerId,
    limit = 8,
    page = 1) => {
    const { data } = await $authHost.get(`api/scanner-history/scanner/${scannerId}`, {
        params: {
            limit,
            page
        }
    });

    return data;
}

export const deleteScannerHistoryById = async (id) => {
    const { data } = await $authHost.delete(`api/scanner-history/${id}`);

    return data;
}

export const clearScannerHistory = async (id) => {
    const { data } = await $authHost.delete(`api/scanner-history/scanner/${id}`);

    return data;
}