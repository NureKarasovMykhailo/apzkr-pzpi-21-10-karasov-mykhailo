import axios from "axios";

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

const $authHost = axios.create({
   baseURL: process.env.REACT_APP_API_URL
});

const hostInterceptor = (config, selectedLanguage) => {
    config.headers['Accept-Language'] = localStorage.getItem('selectedLanguage');
    return config;
}

const authInterceptor = (config, selectedLanguage) => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    config.headers['Accept-Language'] = localStorage.getItem('selectedLanguage');
    return config;
}

const setupAxios = (selectedLanguage) => {
    $host.interceptors.request.use((config) => hostInterceptor(config, selectedLanguage))
    $authHost.interceptors.request.use((config) => authInterceptor(config, selectedLanguage));
}


export {
    $host,
    $authHost,
    setupAxios
}