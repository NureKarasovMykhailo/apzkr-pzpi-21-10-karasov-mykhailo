import IScannerHistoryRepository from "../../../core/repositories/ScannerHistoryRepository/IScannerHistoryRepository";
import CreateOrUpdateScannerHistoryDto
    from "../../../core/repositories/ScannerHistoryRepository/dto/CreateOrUpdateScannerHistoryDto";
import ScannerHistoryDomainModel from "../../../core/domain/models/ScannerHistory/ScannerHistory";
import ScannerHistory from "../../database/etities/ScannerHistory";
import Scanner from "../../database/etities/Scanner";
import ApiError from "../../../core/common/error/ApiError";
import User from "../../database/etities/User";
import i18n from "i18n";
import IMapper from "../../mappers/IMapper";
import MapperFabric from "../../mappers/MapperFabric";
import MappersEnum from "../../../core/common/enums/MappersEnum";

export default class ScannerHistoryRepositoryImpl implements IScannerHistoryRepository {

    private readonly scannerHistoryMapper: IMapper<any, any> = MapperFabric.getMapper(MappersEnum.ScannerHistoryMapper);

    async createScannerHistory(dto: CreateOrUpdateScannerHistoryDto): Promise<ScannerHistoryDomainModel> {
        const scannerHistory = await ScannerHistory.create({
            temperature: dto.temperature,
            pulse: dto.pulse,
            activeWorkedTime: dto.activeWorkedTime,
            userId: dto.userId,
            scannerId: dto.scannerId
        });

        return this.scannerHistoryMapper.toDomainModel(scannerHistory);
    }

    async getScannerHistoryByScannerId(scannerId: number): Promise<ScannerHistoryDomainModel[]> {
        const scannerHistories = await ScannerHistory.findAll({
            where: { scannerId },
            include: [User]
        });
        return scannerHistories.map(scannerHistory => {
            return this.scannerHistoryMapper.toDomainModel(scannerHistory);
        });
    }

    async deleteScannerHistoryById(id: number): Promise<void> {
        const scannerHistory = await ScannerHistory.findOne({ where: { id }});
        scannerHistory?.destroy();
        return;
    }

    async getScannerHistoryById(id: number): Promise<ScannerHistoryDomainModel | null> {
        const scannerHistory = await ScannerHistory.findOne({where: { id }});
        if (!scannerHistory) {
            return null;
        }
        return this.scannerHistoryMapper.toDomainModel(scannerHistory);
    }

    async deleteScannerHistoryByScannerId(scannerId: number): Promise<void> {
        await ScannerHistory.destroy({ where: { scannerId }});
        return;
    }

    async getAllScannerHistory(): Promise<ScannerHistoryDomainModel[]> {
        const scannerHistories = await ScannerHistory.findAll();

        return scannerHistories.map(scannerHistory => {
            return this.scannerHistoryMapper.toDomainModel(scannerHistory)
        });
    }

    async updateScannerHistory(id: number, dto: CreateOrUpdateScannerHistoryDto): Promise<ScannerHistoryDomainModel> {
        const scanner = await Scanner.findOne({ where: { id :dto.scannerId }} );
        if (!scanner) {
            throw ApiError.notFound(i18n.__('scannerNotFound'));
        }

        const user = await User.findOne({where: { id: dto.userId }});
        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }

        //if (user.companyId !== scanner.companyId) {
          //  throw ApiError.forbidden(i18n.__('youHaveNotAccessToThisInformation'));
        //}

        const scannerHistory = await ScannerHistory.findOne({ where: { id }});
        if (!scannerHistory) {
            throw ApiError.notFound(i18n.__('scannerNotFound'));
        }

        scannerHistory.temperature = dto.temperature;
        scannerHistory.pulse = dto.pulse;
        scannerHistory.activeWorkedTime = dto.activeWorkedTime;
        scannerHistory.userId = dto.userId;
        scannerHistory.scannerId = dto.scannerId;

        await scannerHistory.save();

        return this.scannerHistoryMapper.toDomainModel(scannerHistory);
    }

    async getScannerHistoryByUserId(userId: number): Promise<ScannerHistoryDomainModel[]> {
        const scannerHistories = await ScannerHistory.findAll({
            where: { userId }
        });

        return scannerHistories.map(scannerHistory => {
            return this.scannerHistoryMapper.toDomainModel(scannerHistory);
        });
    }

}