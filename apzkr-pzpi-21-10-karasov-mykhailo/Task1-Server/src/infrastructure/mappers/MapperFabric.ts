import IMapper from "./IMapper";
import MappersEnum from "../../core/common/enums/MappersEnum";
import IMapperCreator from "./IMapperCreator";
import ActivityMapperCreator from "./ActivityMapper/ActivityMapperCreator";
import CompanyMapperCreator from "./CompanyMapper/CompanyMapperCreator";
import ComplexityMapperCreator from "./ComplexityMapper/ComplexityMapperCreator";
import EducationMapperCreator from "./EducationMapper/EducationMapperCreator";
import RoleMapperCreator from "./RoleMapper/RoleMapperCreator";
import ScannerHistoryMapperCreator from "./ScannerHistoryMapper/ScannerHistoryMapperCreator";
import ScannerMapperCreator from "./ScannerMapper/ScannerMapperCreator";
import UserMapperCreator from "./UserMapper/UserMapperCreator";
import ApiError from "../../core/common/error/ApiError";

export default class MapperFabric {

    static getMapper(mapperName: string): IMapper<any, any> {
        let mapperCreator: IMapperCreator<any, any>
        switch (mapperName) {
            case MappersEnum.ActivityMapper:
                mapperCreator = new ActivityMapperCreator()
                break;
            case MappersEnum.CompanyMapper:
                mapperCreator = new CompanyMapperCreator()
                break;
            case MappersEnum.ComplexityMapper:
                mapperCreator = new ComplexityMapperCreator()
                break;
            case MappersEnum.EducationMapper:
                mapperCreator = new EducationMapperCreator()
                break;
            case MappersEnum.RoleMapper:
                mapperCreator = new RoleMapperCreator()
                break;
            case MappersEnum.ScannerHistoryMapper:
                mapperCreator = new ScannerHistoryMapperCreator()
                break;
            case MappersEnum.ScannerMapper:
                mapperCreator = new ScannerMapperCreator()
                break;
            case MappersEnum.UserMapper:
                mapperCreator = new UserMapperCreator();
                break;
            default:
                throw ApiError.internalServerError(`Unexpected error`);

        }

        return mapperCreator.createMapper();

    }

}