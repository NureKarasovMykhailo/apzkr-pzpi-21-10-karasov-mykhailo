import IScannerHistoryRepository from "../../repositories/ScannerHistoryRepository/IScannerHistoryRepository";
import CreateOrUpdateScannerHistoryDto
    from "../../repositories/ScannerHistoryRepository/dto/CreateOrUpdateScannerHistoryDto";
import IScannerRepository from "../../repositories/ScannerRepository/IScannerRepository";
import ApiError from "../../common/error/ApiError";
import ScannerHistoryDomainModel from "../../domain/models/ScannerHistory/ScannerHistory";
import PaginationClass from "../../common/uttils/PaginationClass";
import i18n from "i18n";

export default class ScannerHistoryService {
    constructor(
       private readonly scannerHistoryRepository: IScannerHistoryRepository,
       private readonly scannerRepository: IScannerRepository,
    ) {}

    public async createScannerHistory(dto: CreateOrUpdateScannerHistoryDto) {
        return await this.scannerHistoryRepository.createScannerHistory(dto);
    }

    public async getHistoryOfScanner(scannerId: number, companyId: number, limit: number, offset: number) {
        await this.checkScanner(scannerId, companyId);

        const scannerHistories = await this.scannerHistoryRepository.getScannerHistoryByScannerId(scannerId);
        const pagination: PaginationClass<ScannerHistoryDomainModel> = new PaginationClass();
        return pagination.paginateItems(scannerHistories, offset, limit);
    }

    public async deleteScannerHistory(scannerHistoryId: number) {
        await this.scannerHistoryRepository.deleteScannerHistoryById(scannerHistoryId);
    }

    public async getOneScannerHistory(scannerHistoryId: number) {
        const scannerHistory = await this.scannerHistoryRepository.getScannerHistoryById(scannerHistoryId);
        if (!scannerHistory) {
            throw ApiError.notFound(i18n.__('scannerHistoryNotFound'));
        }
        return scannerHistory;
    }

    public async clearScannerHistory(scannerId: number, companyId: number) {
        await this.checkScanner(scannerId, companyId);
        await this.scannerHistoryRepository.deleteScannerHistoryByScannerId(scannerId);
        return;
    }

    public async getAllScannerHistory(scannerId: number, userId: number, limit: number, offset: number) {
        let scannerHistories = await this.scannerHistoryRepository.getAllScannerHistory();

        if (scannerId) {
            scannerHistories = this.filterHistoryByScannerId(scannerId, scannerHistories);
        }

        if (userId) {
            scannerHistories = this.filterHistoryByUserId(userId, scannerHistories);
        }

        const pagination: PaginationClass<ScannerHistoryDomainModel> = new PaginationClass();

        return pagination.paginateItems(scannerHistories, offset, limit);

    }

    public async updateScannerHistory(id: number, dto: CreateOrUpdateScannerHistoryDto) {
        return await this.scannerHistoryRepository.updateScannerHistory(id, dto);
    }

    private async checkScanner(scannerId: number, companyId: number): Promise<void> {
        const scanner = await this.scannerRepository.getScannerById(scannerId);
        if (!scanner) {
            throw ApiError.notFound(i18n.__('scannerNotFound'));
        }
        if (scanner.companyId !== companyId) {
            throw ApiError.forbidden(i18n.__('youHaveNotAccessToThisInformation'));
        }
        return;
    }

    private filterHistoryByScannerId(scannerId: number, scannerHistories: ScannerHistoryDomainModel[]) {
        return scannerHistories.filter(scannerHistory => scannerHistory.scannerId === scannerId);
    }

    private filterHistoryByUserId(userId: number, scannerHistories: ScannerHistoryDomainModel[]) {
        return scannerHistories.filter(scannerHistory => scannerHistory.userId === userId);
    }
}