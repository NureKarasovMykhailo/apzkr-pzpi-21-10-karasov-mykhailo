import React, {useContext} from 'react';
import { Route, Routes} from "react-router-dom";
import defaultRoutes, {adminRoutes, authRoutes} from "../routes";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {hasUserRole} from "../utils/hasUserRole";
import {getRoleTitles} from "../utils/getRoleTitles";
import {RoleEnum} from "../utils/enums/RoleEnum";
import adminNavigation from "./AdminComponents/AdminNavigation";

const AppRouter = observer(() => {
    const { userStore } = useContext(Context);

    return (
        <Routes>
            { defaultRoutes.map(({path, Element} ) => (
                <Route key={path} path={path} element={<Element />} />
            ))}
            { userStore.isAuth && authRoutes.map(({path, Element}) => (
                <Route key={path} path={path} element={< Element />} />
            )) }
            { userStore.isAuth &&  getRoleTitles(userStore.user.roles).includes(RoleEnum.ADMIN) && adminRoutes.map(({path, Element}) => (
                <Route key={path} path={path} element={<Element />} />
            ))}
        </Routes>

    );
});

export default AppRouter;