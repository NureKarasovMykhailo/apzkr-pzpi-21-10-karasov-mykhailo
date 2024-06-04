import IMapperCreator from "../IMapperCreator";
import IMapper from "../IMapper";
import ScannerHistory from "../../database/etities/ScannerHistory";
import ScannerHistoryDomainModel from "../../../core/domain/models/ScannerHistory/ScannerHistory";
import ScannerHistoryMapper from "./ScannerHistoryMapper";

export default class ScannerHistoryMapperCreator implements IMapperCreator<ScannerHistory, ScannerHistoryDomainModel> {
    createMapper(): IMapper<ScannerHistory, ScannerHistoryDomainModel> {
        return new ScannerHistoryMapper();
    }

}