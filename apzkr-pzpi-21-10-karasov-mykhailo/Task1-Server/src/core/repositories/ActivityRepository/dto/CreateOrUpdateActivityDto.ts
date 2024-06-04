export default class CreateOrUpdateActivityDto {
    constructor(
        readonly activityTitle: string,
        readonly description: string | null,
        readonly requiredWorkerCount: number,
        readonly timeShift: number,
        readonly complexityId: number,
        readonly educationId: number,
        readonly companyId: number
    ) {}

}