import RoleDomainModel from "../core/domain/models/Role/Role";


interface User {
    id: number,
    email: string,
    firstName: string,
    secondName: string,
    birthday: Date,
    userImage: string,
    phoneNumber: string,
    companyId: number | null,
    roles: RoleDomainModel[]
}

export { User };
