import CreateOrUpdateScannerDto from "./dto/CreateOrUpdateScannerDto";
import ScannerDomainModel from "../../domain/models/Scanner/Scanner";

export default interface IScannerRepository {
    createScanner(dto: CreateOrUpdateScannerDto): Promise<ScannerDomainModel>;
    getScannerById(id: number): Promise<ScannerDomainModel | null>;
    updateScanner(dto: CreateOrUpdateScannerDto, id: number): Promise<ScannerDomainModel>
    deleteScanner(id: number): Promise<void>;
    getScanners(): Promise<ScannerDomainModel[]>;
    getScannersByCompany(companyId: number): Promise<ScannerDomainModel[]>;
}