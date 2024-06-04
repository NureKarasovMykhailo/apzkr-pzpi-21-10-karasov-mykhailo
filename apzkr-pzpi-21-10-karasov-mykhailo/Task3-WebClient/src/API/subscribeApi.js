import {$authHost} from "./index";

export const fetchSubscribe = async (userId) => {
    const { data } = await $authHost.get(`api/subscribe/${userId}`);
    return data;
}