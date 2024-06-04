import {
    ACTIVITIES_LIST_PAGE,
    ACTIVITY_PAGE,
    ADD_ACTIVITY_PAGE,
    ADD_COMPANY,
    ADD_COMPLEXITY_ADMIN,
    ADD_WORKER_ITEM_PAGE,
    ADD_WORKER_PAGE, ADMIN_ACTIVITY_PAGE, ADMIN_ADD_ACTIVITY_PAGE, ADMIN_ADD_COMPANY,
    ADMIN_ADD_EDUCATION, ADMIN_ADD_SCANNER, ADMIN_ADD_SCANNER_HISTORY, ADMIN_ADD_USER_PAGE, ADMIN_COMPANY_PAGE,
    ADMIN_COMPLEXITY_PAGE, ADMIN_EDUCATION_PAGE, ADMIN_ONE_SCANNER, ADMIN_ONE_SCANNER_HISTORY,
    ADMIN_PAGE, ADMIN_USER_PAGE,
    AUTH_PAGE_PATH,
    COMPANY_SCANNERS,
    COMPANY_WORKER_ITEM_PAGE,
    MAIN_PAGE_PATH,
    ONE_SCANNER_PAGE,
    PROFILE_PAGE_PATH,
    REGISTRATION_PAGE_PATH,
    SUCCESS_SUBSCRIBE,
    WORKER_PAGE
} from "./utils/consts";
import AuthPage from "./pages/AuthPage";
import RegistrationPage from "./pages/RegistrationPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import SubscribeSuccess from "./pages/SubscribeSuccess";
import AddCompanyPage from "./pages/AddCompanyPage";
import WorkersPage from "./pages/WorkersPage";
import AddWorkerPage from "./pages/AddWorkerPage";
import AddWorkerItemPage from "./pages/AddWorkerItemPage";
import WorkerItemPage from "./pages/WorkerItemPage";
import ScannersPage from "./pages/ScannersPage";
import OneScannerPage from "./pages/OneScannerPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import AddActivityPage from "./pages/AddActivityPage";
import ActivityPage from "./pages/ActivityPage";
import AdminPage from "./pages/AdminPage";
import AddComplexityAdminPage from "./pages/AddComplexityAdminPage";
import AdminOneComplexityPage from "./pages/AdminOneComplexityPage";
import AdminAddEducation from "./pages/AdminAddEducation";
import AdminOneEducation from "./pages/AdminOneEducation";
import AdminAddUser from "./pages/AdminAddUser";
import AdminOneUser from "./pages/AdminOneUser";
import AdminAddCompany from "./pages/AdminAddCompany";
import AdminOneCompany from "./pages/AdminOneCompany";
import AdminAddActivity from "./pages/AdminAddActivity";
import AdminOneActivity from "./pages/AdminOneActivity";
import AdminAddScanner from "./pages/AdminAddScanner";
import AdminOneScanner from "./pages/AdminOneScanner";
import AdminAddScannerHistory from "./pages/AdminAddScannerHistory";
import AdminOneScannerHistory from "./pages/AdminOneScannerHistory";

const defaultRoutes = [
    {
        path: AUTH_PAGE_PATH,
        Element: AuthPage
    },
    {
        path: REGISTRATION_PAGE_PATH,
        Element: RegistrationPage
    },
    {
        path: MAIN_PAGE_PATH,
        Element: MainPage
    }
];

export const authRoutes = [
    {
        path: PROFILE_PAGE_PATH,
        Element: ProfilePage
    },
    {
        path: SUCCESS_SUBSCRIBE,
        Element: SubscribeSuccess
    },
    {
        path: ADD_COMPANY,
        Element: AddCompanyPage
    },
    {
        path: WORKER_PAGE,
        Element: WorkersPage
    },
    {
        path: ADD_WORKER_PAGE,
        Element: AddWorkerPage
    },
    {
        path: ADD_WORKER_ITEM_PAGE,
        Element: AddWorkerItemPage
    },
    {
        path: COMPANY_WORKER_ITEM_PAGE,
        Element: WorkerItemPage
    },
    {
      path: COMPANY_SCANNERS,
      Element: ScannersPage
    },
    {
        path: ONE_SCANNER_PAGE,
        Element: OneScannerPage
    },
    {
        path: ACTIVITIES_LIST_PAGE,
        Element: ActivitiesPage
    },
    {
        path: ADD_ACTIVITY_PAGE,
        Element: AddActivityPage
    },
    {
        path: ACTIVITY_PAGE,
        Element: ActivityPage
    },

];

export const adminRoutes = [
    {
        path: ADMIN_PAGE,
        Element: AdminPage
    },
    {
        path: ADD_COMPLEXITY_ADMIN,
        Element: AddComplexityAdminPage
    },
    {
        path: ADMIN_COMPLEXITY_PAGE,
        Element: AdminOneComplexityPage
    },
    {
        path: ADMIN_ADD_EDUCATION,
        Element: AdminAddEducation
    },
    {
        path: ADMIN_EDUCATION_PAGE,
        Element: AdminOneEducation
    },
    {
        path: ADMIN_ADD_USER_PAGE,
        Element: AdminAddUser
    },
    {
        path: ADMIN_USER_PAGE,
        Element: AdminOneUser
    },
    {
        path: ADMIN_ADD_COMPANY,
        Element: AdminAddCompany
    },
    {
        path: ADMIN_COMPANY_PAGE,
        Element: AdminOneCompany
    },
    {
        path: ADMIN_ADD_ACTIVITY_PAGE,
        Element: AdminAddActivity
    },
    {
        path: ADMIN_ACTIVITY_PAGE,
        Element: AdminOneActivity
    },
    {
        path: ADMIN_ADD_SCANNER,
        Element: AdminAddScanner
    },
    {
        path: ADMIN_ONE_SCANNER,
        Element: AdminOneScanner
    },
    {
        path: ADMIN_ADD_SCANNER_HISTORY,
        Element: AdminAddScannerHistory
    },
    {
        path: ADMIN_ONE_SCANNER_HISTORY,
        Element: AdminOneScannerHistory
    }
]

export default defaultRoutes;