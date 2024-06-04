import ScannerService from "../../core/services/ScannerService/ScannerService";
import {NextFunction, Response, Request} from "express";
import CreateOrUpdateScannerDto from "../../core/repositories/ScannerRepository/dto/CreateOrUpdateScannerDto";

export default class AdminScannerController {
    constructor(
        private readonly scannerService: ScannerService
    ) {}

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                description,
                userId,
                companyId
            } = req.body;

            const dto = new CreateOrUpdateScannerDto(
                description as string,
                userId as number,
                companyId as number
            );

            const scanner = await this.scannerService.createScanner(dto);


            return res.status(201).json({scanner});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getAllScanners(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                companyId ,
                limit = '10',
                page = '1'
            } = req.query;

            const offset = Number(page) * Number(limit) - Number(limit)
            let paginatedScanners: any;

            if (companyId) {
                paginatedScanners = await this.scannerService.getCompanyScanners(Number(companyId), Number(limit), offset);
            } else {
                paginatedScanners = await this.scannerService.getScanners(Number(offset), Number(limit));
            }

            return res.status(200).json({
                paginatedItems: paginatedScanners.paginatedItems,
                pagination: {
                    totalItems: paginatedScanners.itemsCount,
                    totalPages: paginatedScanners.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getScanner(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const scanner = await this.scannerService.getScannerById(Number(id));

            return res.status(200).json({scanner});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updateScanner(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const {
                description,
                userId,
                companyId
            } = req.body;

            const dto = new CreateOrUpdateScannerDto(
                description as string,
                userId as number,
                companyId as number
            );

            const scanner = await this.scannerService.updateScanner(dto, Number(id));
            return res.status(200).json({scanner});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteScanner(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.scannerService.deleteScannerAdmin(Number(id));
            return res.status(200).json({});

        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}