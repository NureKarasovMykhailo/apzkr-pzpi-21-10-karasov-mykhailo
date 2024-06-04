import UserDomainModel from "../User/User";
import CompanyDomainModel from "../Company/Company";

export default class ScannerDomainModel {
    constructor(
        public readonly id: number,
        public readonly companyId: number | null,
        public readonly userId: number | null,
        public readonly description: string | null,
        public readonly user: UserDomainModel | null,
        public readonly company: CompanyDomainModel | null
    ) {}

}