import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import AddScannerForm from "../../forms/AddScannerForm/AddScannerForm";
import {fetchCompanyUsers} from "../../../API/companyApi";
import Loader from "../../UI/Loader/Loader";

const AddScannerModal = ({ onScannerAdd }) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([{}]);

    useEffect(() => {
        setIsLoading(true);
        fetchCompanyUsers(999, 1, '').then(response => {
            setUsers(response.users);
            setIsLoading(false);
        });
    }, []);

    return (
        isLoading
            ?
            <div>
                <Loader/>
            </div>
            :
            <div>
                <div>
                    <h5>{t('addingScanner')}</h5>
                </div>
                <div>
                    <AddScannerForm companiesUser={users} onScannerAdd={(onAdd) => onScannerAdd(onAdd)} />
                </div>
            </div>

    );
};

export default AddScannerModal;