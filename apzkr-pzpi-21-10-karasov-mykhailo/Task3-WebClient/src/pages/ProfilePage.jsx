import React, { useContext, useState } from 'react';
import '../styles/ProfilePage.css';
import { Container, Nav } from "react-bootstrap";
import UserProfile from "../components/UserProfile/Profile/UserProfile";
import UserEducations from "../components/UserProfile/UserEducations/UserEducations";
import UserSubscription from "../components/UserProfile/UserSubscription/UserSubscription";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import Company from "../components/UserProfile/Company/Company";
import { useTranslation } from 'react-i18next';

const ProfilePage = observer(() => {
    const { userStore } = useContext(Context);
    const { t } = useTranslation();

    const navLinks = [
        { eventKey: 'profile', label: t('profile') },
        { eventKey: 'educations', label: t('educations') },
        { eventKey: 'subscription', label: t('subscription') },
        { eventKey: 'company', label: t('company') }
    ];

    const [selectedKey, setSelectedKey] = useState('profile');

    const renderComponent = () => {
        switch (selectedKey) {
            case 'profile':
                return <UserProfile />;
            case 'educations':
                return <UserEducations />;
            case 'subscription':
                return <UserSubscription user={userStore.user} />;
            case 'company':
                return <Company user={userStore.user} />;
            default:
                return null;
        }
    }

    return (
        <Container fluid className={"py-4 px-5 d-flex h-100"}>
            <Nav
                className={"profile_page__navbar-nav flex-column align-items-center"}
                style={{ height: "20%" }}
                variant={"tabs"}
                defaultActiveKey={"profile"}
                onSelect={(selectedKey) => setSelectedKey(selectedKey)}
            >
                {navLinks.map(link => (
                    <Nav.Item key={link.eventKey} className={"profile_page__nav-link"}>
                        <Nav.Link eventKey={link.eventKey}>{link.label}</Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            <div className={"h-100 d-flex align-items-center"} style={{ width: '100%' }}>
                {renderComponent()}
            </div>
        </Container>
    );
});

export default ProfilePage;
