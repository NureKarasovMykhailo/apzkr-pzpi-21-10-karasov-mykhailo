export default class CreateUserDto {
    constructor(
       public readonly email: string,
       public readonly firstName: string,
       public readonly secondName: string,
       public readonly password: string,
       public readonly birthday: Date,
       public readonly phoneNumber: string,
       public readonly userImage: any,
       public readonly companyId: number | null
    ) {}
}