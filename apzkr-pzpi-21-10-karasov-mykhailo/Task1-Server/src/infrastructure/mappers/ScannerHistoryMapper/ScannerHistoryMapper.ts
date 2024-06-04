import IMapper from "../IMapper";
import ScannerHistory from "../../database/etities/ScannerHistory";
import ScannerHistoryDomainModel from "../../../core/domain/models/ScannerHistory/ScannerHistory";
import UserMapper from "../UserMapper/UserMapper";

export default class ScannerHistoryMapper implements IMapper<ScannerHistory, ScannerHistoryDomainModel> {
    private readonly userMapper: UserMapper = new UserMapper();

    toDomainModel(data: ScannerHistory): ScannerHistoryDomainModel {
        let user = data.user ? this.userMapper.toDomainModel(data.user) : null;

        return new ScannerHistoryDomainModel(
            data.id,
            data.temperature,
            data.pulse,
            data.activeWorkedTime,
            data.userId,
            data.scannerId,
            data.createdAt,
            user
        );
    }

    toPersistenceModel(data: ScannerHistoryDomainModel): ScannerHistory {
        const scannerHistory = new ScannerHistory();
        let user = data.user ? this.userMapper.toPersistenceModel(data.user) : null;

        scannerHistory.id = data.id;
        scannerHistory.temperature = data.temperature;
        scannerHistory.pulse = data.pulse;
        scannerHistory.activeWorkedTime = data.activeWorkedTime;
        scannerHistory.userId = data.userId;
        scannerHistory.scannerId = data.scannerId;
        scannerHistory.createdAt = data.createdAt;
        if (user) {
            scannerHistory.user = user;
        }

        return scannerHistory;
    }

}