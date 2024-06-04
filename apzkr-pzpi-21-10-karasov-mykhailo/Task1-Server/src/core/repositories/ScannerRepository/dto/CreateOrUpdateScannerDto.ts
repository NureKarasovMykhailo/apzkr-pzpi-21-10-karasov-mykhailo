export default class CreateOrUpdateScannerDto {
    constructor(
       public readonly description: string | null,
       public readonly userId: number | null = null,
       public readonly companyId: number | null = null
    ) {}
}