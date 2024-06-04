import {$authHost} from "./index";

export const fetchComplexities = async (limit, page) => {
    const { data } = await $authHost.get(`api/complexity`, {
        params: {
            limit,
            page
        }
    });
    return data;
}

export const createComplexity = async (formData) => {
    const { data } = await $authHost.post('api/complexity', formData);
    return data;
}

export const fetchComplexityById = async (id) => {
    const { data } = await $authHost.get(`api/complexity/${id}`);
    return data;
}

export const updateComplexity = async (id, formData) => {
    const { data } = await $authHost.put(`api/complexity/${id}`, formData);
    return data;
}

export const deleteComplexity = async (id) => {
    const { data } = await $authHost.delete(`api/complexity/${id}`);
    return data;
}