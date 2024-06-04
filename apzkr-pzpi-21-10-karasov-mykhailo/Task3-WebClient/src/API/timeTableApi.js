import {$authHost} from "./index";

export const getTimeTable = async () => {
    const { data } = await $authHost.get(`api/timetable/`);
    return data;
}