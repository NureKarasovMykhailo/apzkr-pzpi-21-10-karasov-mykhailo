import User from "../User/User";
import RoleDomainModel from "../Role/Role";

export default class CompanyDomainModel {
    constructor(
        public readonly id: number,
        public readonly companyName: string,
        public readonly description: string | null,
        public readonly companyImage: string,
        public readonly ownerId: number
    ) {}
}