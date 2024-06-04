import ScannerHistoryService from "../../core/services/ScannerHistoryService/ScannerHistoryService";
import {NextFunction, Response, Request} from "express";
import CreateOrUpdateScannerHistoryDto
    from "../../core/repositories/ScannerHistoryRepository/dto/CreateOrUpdateScannerHistoryDto";

export default class AdminScannerHistoryController {
    constructor(
        private readonly scannerHistoryService: ScannerHistoryService
    ) {}

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                temperature,
                pulse,
                activeWorkedTime,
                scannerId,
                userId
            } = req.body;

            const dto = new CreateOrUpdateScannerHistoryDto(
                temperature as number,
                pulse as number,
                activeWorkedTime as number,
                userId as number,
                scannerId as number
            );

            const scannerHistory = await this.scannerHistoryService.createScannerHistory(dto);

            return res.status(201).json({scannerHistory});

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getAllScannerHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                scannerId,
                userId,
                page = '1',
                limit = '10'
            } = req.query;

            const offset = Number(page) * Number(limit) - Number(limit);

            const paginatedScannerHistories = await this.scannerHistoryService.getAllScannerHistory(
                Number(scannerId),
                Number(userId),
                Number(limit),
                offset
            );

            return res.status(200).json({
                scannerHistories: paginatedScannerHistories.paginatedItems,
                pagination: {
                    totalItems: paginatedScannerHistories.itemsCount,
                    totalPages: paginatedScannerHistories.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
            }});

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getScannerHistoryById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const scannerHistory = await this.scannerHistoryService.getOneScannerHistory(Number(id));

            return res.status(200).json({scannerHistory});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updateScannerHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const {
                temperature,
                pulse,
                activeWorkedTime,
                scannerId,
                userId
            } = req.body;

            const dto = new CreateOrUpdateScannerHistoryDto(
                temperature as number,
                pulse as number,
                activeWorkedTime as number,
                userId as number,
                scannerId as number
            );

            const scannerHistory = await this.scannerHistoryService.updateScannerHistory(Number(id), dto);

            return res.status(200).json(scannerHistory);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteScanner(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await this.scannerHistoryService.deleteScannerHistory(Number(id));

            return res.status(200).json({});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}