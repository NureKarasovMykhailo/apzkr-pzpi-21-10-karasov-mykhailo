import express, {Router} from "express";
const router: Router = express.Router();
import authRouter from './AuthRouter';
import roleRouter from "./RoleRouter";
import educationRouter from "./EducationRouter";
import adminUserRouter from "./AdminUserRouter";
import publicUserRouter from "./PublicUserRouter";
import publicCompanyRouter from './CompanyPublicRouter';
import scannerRouter from "./ScannerRouter";
import scannerHistoryRouter from "./ScannerHistoryRouter";
import complexityRouter from "./ComplexityRouter";
import activityRouter from "./ActivityRouter";
import companyAdminRouter from "./CompanyAdminRouter";
import adminActivityRouter from "./AdminActivityRouter";
import adminScannerRouter from "./AdminScannerRouter";
import adminScannerHistoryRouter from "./AdminScannerHistoryRouter";
import timeTableRouter from "./TimeTableRouter";
import dbRouter from "./DbRouter";
import subscribeRouter from "./SubscribeRouter";

router.use('/education', educationRouter);
router.use('/auth', authRouter);
router.use('/role', roleRouter);
router.use('/admin-user', adminUserRouter);
router.use('/public-user', publicUserRouter)
router.use('/public-company', publicCompanyRouter);
router.use('/scanner', scannerRouter);
router.use('/scanner-history', scannerHistoryRouter);
router.use('/complexity', complexityRouter);
router.use('/activity', activityRouter);
router.use('/company-admin', companyAdminRouter);
router.use('/activity-admin', adminActivityRouter);
router.use('/scanner-admin', adminScannerRouter);
router.use('/admin-scanner-history', adminScannerHistoryRouter);
router.use('/timetable', timeTableRouter);
router.use('/db', dbRouter);
router.use('/subscribe', subscribeRouter);

export default router;