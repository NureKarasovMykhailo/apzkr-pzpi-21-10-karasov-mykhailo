export default class CreateOrUpdateComplexityDto {
    constructor(
       readonly complexityTitle: string,
       readonly evaluation: number
    ) {}
}