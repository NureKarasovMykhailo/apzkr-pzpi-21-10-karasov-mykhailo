import IMapperCreator from "../IMapperCreator";
import IMapper from "../IMapper";
import ScannerDomainModel from "../../../core/domain/models/Scanner/Scanner";
import Scanner from "../../database/etities/Scanner";
import ScannerMapper from "./ScannerMapper";

export default class ScannerMapperCreator implements IMapperCreator<Scanner, ScannerDomainModel> {
    createMapper(): IMapper<Scanner, ScannerDomainModel> {
        return new ScannerMapper();
    }

}