import ComplexityDomainModel from "../Complexity/Complexity";
import EducationDomainModel from "../Education/Education";
import CompanyDomainModel from "../Company/Company";
import UserDomainModel from "../User/User";


export default class ActivityDomainModel {
    constructor(
        public readonly id: number,
        public readonly activityTitle: string,
        public readonly description: string | null,
        public readonly requiredWorkerCount: number,
        public readonly timeShift: number,
        public readonly complexityId: number | null,
        public readonly educationId: number | null,
        public readonly companyId: number | null,
        public readonly complexity: ComplexityDomainModel | null,
        public readonly education: EducationDomainModel | null,
        public readonly company: CompanyDomainModel | null,
        public readonly users: UserDomainModel[]
    ) {}
}