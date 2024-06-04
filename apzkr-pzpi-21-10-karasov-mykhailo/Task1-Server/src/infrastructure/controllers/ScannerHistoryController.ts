import ScannerHistoryService from "../../core/services/ScannerHistoryService/ScannerHistoryService";
import {NextFunction, Request, Response} from "express";
import ScannerService from "../../core/services/ScannerService/ScannerService";
import CreateOrUpdateScannerHistoryDto
    from "../../core/repositories/ScannerHistoryRepository/dto/CreateOrUpdateScannerHistoryDto";
import ApiError from "../../core/common/error/ApiError";
import i18n from "i18n";
import IMapper from "../mappers/IMapper";

export default class ScannerHistoryController {
    constructor(
       private readonly scannerHistoryService: ScannerHistoryService,
       private readonly scannerHistoryMapper: IMapper<any, any>,
       private readonly scannerService: ScannerService,
    ) {}

    public async createScannerHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                temperature,
                pulse,
                activeWorkedTime,
                scannerId
            } = req.body;

            const scannerDomainModel = await this.scannerService.getScannerById(Number(scannerId));
            const dto: CreateOrUpdateScannerHistoryDto = new CreateOrUpdateScannerHistoryDto(
                temperature,
                pulse,
                activeWorkedTime,
                scannerDomainModel.userId,
                scannerId
            );

            const scannerHistoryDomainModel = await this.scannerHistoryService.createScannerHistory(dto);
            const scannerHistory = this.scannerHistoryMapper.toPersistenceModel(scannerHistoryDomainModel);
            return res.status(201).json({ scannerHistory: scannerHistory });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getHistoryOfScanner(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                const { limit = '10', page = '1'} = req.query;
                const offset = Number(limit) * Number(page) - Number(limit);
                const scannerHistoriesDomainModel = await this.scannerHistoryService.getHistoryOfScanner(Number(id), req.user.companyId, Number(limit), offset);

                return res.status(200).json({
                    scannerHistories: scannerHistoriesDomainModel.paginatedItems,
                    pagination: {
                        totalItems: scannerHistoriesDomainModel.itemsCount,
                        totalPages: scannerHistoriesDomainModel.totalPages,
                        currentPage: page,
                        itemsPerPage: limit
                    }
                });
            } else {
                return next(ApiError.forbidden(i18n.__('youHaveNotAccessToThisInformation')));
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteScannerHistory(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                await this.scannerHistoryService.deleteScannerHistory(Number(id));
                return res.status(200).json({});
            } else {
                return next(ApiError.forbidden(i18n.__('youHaveNotAccessToThisInformation')));
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getOneScannerHistory(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                const scannerHistoryDomainModel = await this.scannerHistoryService.getOneScannerHistory(Number(id));
                return res.status(200).json({ scannerHistory: this.scannerHistoryMapper.toPersistenceModel(scannerHistoryDomainModel)});

            } else {
                return next(ApiError.forbidden(i18n.__('youHaveNotAccessToThisInformation')));
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async clearScannerHistory(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                await this.scannerHistoryService.clearScannerHistory(Number(id), req.user.companyId);
                return res.status(200).json({ });
            } else {
                return next(ApiError.forbidden(i18n.__('youHaveNotAccessToThisInformation')));
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}