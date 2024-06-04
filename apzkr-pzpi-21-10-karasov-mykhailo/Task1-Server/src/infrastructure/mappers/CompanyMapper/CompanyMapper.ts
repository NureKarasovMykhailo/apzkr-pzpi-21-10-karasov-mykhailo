import IMapper from "../IMapper";
import CompanyDomainModel from "../../../core/domain/models/Company/Company";
import Company from "../../database/etities/Company";
import UserMapper from "../UserMapper/UserMapper";
import UserDomainModel from "../../../core/domain/models/User/User";

export default class CompanyMapper implements IMapper<Company, CompanyDomainModel>{


    toDomainModel(data: Company): CompanyDomainModel {

        return new CompanyDomainModel(
            data.id,
            data.companyName,
            data.description,
            data.companyImage,
            data.userId
        );
    }

    toPersistenceModel(data: CompanyDomainModel): Company {
        const company = new Company();
        company.id = data.id;
        company.companyName = data.companyName;
        company.description = data.description || null;
        company.companyImage = data.companyImage;
        company.userId = data.id

        return company;
    }

}