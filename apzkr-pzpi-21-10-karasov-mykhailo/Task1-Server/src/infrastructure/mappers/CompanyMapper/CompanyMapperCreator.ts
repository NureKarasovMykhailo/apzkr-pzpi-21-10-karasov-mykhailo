import IMapperCreator from "../IMapperCreator";
import IMapper from "../IMapper";
import CompanyDomainModel from "../../../core/domain/models/Company/Company";
import Company from "../../database/etities/Company";
import CompanyMapper from "./CompanyMapper";

export default class CompanyMapperCreator implements IMapperCreator<Company, CompanyDomainModel> {
    createMapper(): IMapper<Company, CompanyDomainModel> {
        return new CompanyMapper();
    }

}