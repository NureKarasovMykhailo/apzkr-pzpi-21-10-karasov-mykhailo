import React from 'react';
import {Button, Container} from "react-bootstrap";
import './Company.css';
import {useNavigate} from "react-router-dom";
import {ADD_COMPANY} from "../../../utils/consts";
import UserCompany from "../../Company/UserCompany";
import {getRoleTitles} from "../../../utils/getRoleTitles";
import {useTranslation} from "react-i18next";

const Company = ({ user }) => {
    const navigation = useNavigate();
    const { t } = useTranslation();

    const handleCreateCompanyClick = (e) => {
        navigation(ADD_COMPANY);
    }




    return (
        <Container className={"w-100 h-100 border p-3 company-page__container"}>
            <div className={"w-100 d-flex justify-content-center"}>
                <h2>{t('company')}</h2>
            </div>
            {user.companyId ?
                <UserCompany userRoleTitles={getRoleTitles(user.roles)} />
                :
                <div className={"company-page__no-company-container"}>
                    <p>{t('youHasNotAddCompany')}</p>
                    <div className={"company-page__add-company-button"}>
                        <Button
                            className={"company-page__add-button"}
                            type={"button"}
                            onClick={handleCreateCompanyClick}
                        >
                            {t('addButton')}
                        </Button>
                    </div>
                </div>
            }
        </Container>
    );
};

export default Company;