import IMapper from "../IMapper";
import ScannerDomainModel from "../../../core/domain/models/Scanner/Scanner";
import Scanner from "../../database/etities/Scanner";
import UserMapper from "../UserMapper/UserMapper";
import CompanyMapper from "../CompanyMapper/CompanyMapper";

export default class ScannerMapper implements IMapper<Scanner, ScannerDomainModel> {
    private readonly userMapper: UserMapper = new UserMapper();
    private readonly companyMapper: CompanyMapper = new CompanyMapper();


    toDomainModel(data: Scanner): ScannerDomainModel {
        let user = data.user ? this.userMapper.toDomainModel(data.user) : null;
        let company = data.company ? this.companyMapper.toDomainModel(data.company) : null;

        return new ScannerDomainModel(
            data.id,
            data.companyId,
            data.userId,
            data.description,
            user,
            company
        );
    }

    toPersistenceModel(data: ScannerDomainModel): Scanner {
        let user = data.user ? this.userMapper.toPersistenceModel(data.user) : null;
        let company = data.company ? this.companyMapper.toPersistenceModel(data.company) : null;


        const scanner = new Scanner();
        scanner.id = data.id;
        scanner.userId = data.userId;
        scanner.companyId = data.companyId;
        scanner.description = data.description;
        scanner.user = user;
        scanner.company = company;

        return scanner;
    }
}