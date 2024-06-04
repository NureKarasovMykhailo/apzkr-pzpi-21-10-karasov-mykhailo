import React from 'react';
import './Footer.css';
import {useTranslation} from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <div className={"footer__container"}>
            <div className="footer__content">
                <div className={"footer__content-logo-container"}>
                    <p>TaskSync</p>
                </div>
                <div className={"footer__content-main-container"}>
                    <div className="footer__content-first-row">
                        <p>{t('aboutCompany')}</p>
                        <p>{t('payment')}</p>
                        <p>{t('reviews')}</p>
                        <p>{t('contacts')}</p>
                    </div>
                    <div className="footer__content-second-row">
                        <p>{t('platform')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;