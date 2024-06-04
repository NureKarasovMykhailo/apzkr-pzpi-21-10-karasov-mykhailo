import CreateOrUpdateScannerHistoryDto from "./dto/CreateOrUpdateScannerHistoryDto";
import ScannerHistoryDomainModel from "../../domain/models/ScannerHistory/ScannerHistory";

export default interface IScannerHistoryRepository {
    createScannerHistory(dto: CreateOrUpdateScannerHistoryDto): Promise<ScannerHistoryDomainModel>;
    getScannerHistoryByScannerId(scannerId: number): Promise<ScannerHistoryDomainModel[]>
    deleteScannerHistoryById(id: number): Promise<void>;
    getScannerHistoryById(id: number): Promise<ScannerHistoryDomainModel | null>;
    deleteScannerHistoryByScannerId(scannerId: number): Promise<void>;
    getAllScannerHistory(): Promise<ScannerHistoryDomainModel[]>;
    updateScannerHistory(id: number, dto: CreateOrUpdateScannerHistoryDto): Promise<ScannerHistoryDomainModel>;
    getScannerHistoryByUserId(userId: number): Promise<ScannerHistoryDomainModel[]>;
}