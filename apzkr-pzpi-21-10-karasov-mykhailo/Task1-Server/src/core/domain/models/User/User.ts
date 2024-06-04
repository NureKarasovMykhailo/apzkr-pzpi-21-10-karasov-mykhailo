import Company from "../Company/Company";
import RoleDomainModel from "../Role/Role";
import EducationDomainModel from "../Education/Education";


export default class UserDomainModel {
    constructor(
        public readonly id: number,
        public readonly email: string,
        public readonly firstName: string,
        public readonly secondName: string,
        public readonly password: string,
        public readonly phoneNumber: string | null,
        public readonly birthday: Date,
        public readonly userImage: string,
        public readonly companyId: number | null,
        public readonly roles: RoleDomainModel[] | null,
        public readonly educations: EducationDomainModel[] | null
    ) {}
}