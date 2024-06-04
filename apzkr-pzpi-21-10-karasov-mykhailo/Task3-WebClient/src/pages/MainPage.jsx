import React from 'react';
import { Container } from "react-bootstrap";
import CarouselMain from "../components/Carousel/Carousel";
import { useTranslation } from 'react-i18next';
import '../styles/MainPage.css';

const MainPage = () => {
    const { t } = useTranslation();

    return (
        <Container style={{height: '100%'}}>
            <CarouselMain />

            <div className={"main-page__text-block"}>
                <div className={"main-page__text-block-image-container"}>
                    <img
                        className={"main-page__text-block-image"}
                        src={"Assets/main-page-middle-image.jpg"}
                        alt={t("mainPageMiddleImageAlt")}
                    />
                </div>
                <div className={"main-page__text-block-text"}>
                    <h3 className={"main-page__text-block-text-header"}>{t("welcomeHeader")}</h3>
                    <ul>
                        <li>{t("toolsHeader")}</li>
                        <li>{t("innovativeSolutionsHeader")}</li>
                        <li>{t("manageEmployeesHeader")}</li>
                        <li>{t("platformFeaturesHeader")}</li>
                    </ul>
                </div>
            </div>

            <div className={"main_page__image-container"}>
                <img
                    src={"Assets/main-page-end-image.jpg"}
                    alt={t("mainPageEndImageAlt")}
                    className={"main_page__image"}
                />
            </div>

        </Container>
    );
};

export default MainPage;
