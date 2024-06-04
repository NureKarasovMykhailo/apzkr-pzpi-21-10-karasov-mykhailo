import {$authHost} from "./index";

export const fetchEducations = async (limit = 999, page = 1) => {
    const { data } = await $authHost.get(`api/education/`, {
        params: {
            limit,
            page
        }
    });
    return data;
}

export const addEducation = async (formData) => {
    const { data } = await $authHost.post(`api/education/`, formData);
    return data;
}

export const fetchEducationById = async (id) => {
    const { data } = await $authHost.get(`api/education/${id}`);
    return data;
}

export const updateEducation = async (id, formData) => {
    const { data } = await $authHost.put(`api/education/${id}`, formData);
    return data;
}

export const deleteEducationById = async (id) => {
    const { data } = await $authHost.delete(`api/education/${id}`);
    return data;
}