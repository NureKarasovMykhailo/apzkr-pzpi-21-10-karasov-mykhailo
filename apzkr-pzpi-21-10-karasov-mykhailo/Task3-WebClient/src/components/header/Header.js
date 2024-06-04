import React, {useContext} from 'react';
import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {ADMIN_PAGE, AUTH_PAGE_PATH, MAIN_PAGE_PATH, PROFILE_PAGE_PATH} from "../../utils/consts";
import './Header.css';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import {hasUserRole} from "../../utils/hasUserRole";
import {getRoleTitles} from "../../utils/getRoleTitles";
import {RoleEnum} from "../../utils/enums/RoleEnum";
import {useTranslation} from "react-i18next";

const Header = observer(() => {
    const { userStore } = useContext(Context);
    const navigation = useNavigate();
    const { t } = useTranslation();

    const handleAuthClick = (e) => {
        e.preventDefault();
        navigation(AUTH_PAGE_PATH);
    }

    const handleExitClick = () => {
        localStorage.clear();
        userStore.setUser(undefined);
        userStore.setIsAuth(false);
        navigation(MAIN_PAGE_PATH);
    }

    return (
        <Navbar expand="lg" className={ "header__container bg-body-tertiary"}>
            <Container>
                <Navbar.Brand href="#home">TaskSync</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href={MAIN_PAGE_PATH}>{t('toMain')}</Nav.Link>
                        <Nav.Link
                            href={"#"}
                            onClick={() => navigation(ADMIN_PAGE)}
                        >
                            {t('adminPanel')}
                        </Nav.Link>

                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className={"justify-content-end"}>
                    <LanguageSelector />
                    <Navbar.Text>
                        {userStore.isAuth ?
                            (<div className={"d-flex align-items-center"}>
                                <div className={"p-md-2"}>
                                    <Link to={PROFILE_PAGE_PATH}>{userStore.user.email}</Link>
                                </div>
                                <Button variant={"danger"} type={"submit"} onClick={handleExitClick}>
                                    {t('exitButton')}
                                </Button>
                            </div>)
                            :
                            (<Button
                                onClick={handleAuthClick}
                                variant={"outline-primary"}
                            >
                                {t('authorizeButton')}
                            </Button>)
                        }
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
});

export default Header;