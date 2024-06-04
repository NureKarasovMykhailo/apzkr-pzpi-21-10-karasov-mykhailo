export default class CreateOrUpdateCompanyDto {
    constructor(
        readonly companyName: string,
        readonly description: string,
        readonly companyImage: any,
        readonly creatingUserId: number
    ) {}
}