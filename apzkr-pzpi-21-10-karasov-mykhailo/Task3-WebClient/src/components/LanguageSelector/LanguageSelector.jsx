import React, {useEffect, useState} from 'react';
import i18n from "../../i18n";
import {Form} from "react-bootstrap";
import {setupAxios} from "../../API";

const LanguageSelector = () => {

    const [selectedLanguage, setSelectedLanguage] = useState('uk');

    const changeLanguage = (e) => {
        const lng = e.target.value;
        setSelectedLanguage(e.target.value);
        localStorage.setItem('selectedLanguage', selectedLanguage);
        i18n.changeLanguage(lng);
    };

    useEffect(() => {
        localStorage.setItem('selectedLanguage', selectedLanguage);
        setupAxios(selectedLanguage);
        return () => {}
    }, [selectedLanguage]);

    return (
        <div className={"w-10 p-3"}>
            <Form.Select onChange={changeLanguage}>
                <option value={'uk'}>УКР</option>
                <option value={'en'}>ENG</option>
            </Form.Select>
        </div>
    );
};

export default LanguageSelector;