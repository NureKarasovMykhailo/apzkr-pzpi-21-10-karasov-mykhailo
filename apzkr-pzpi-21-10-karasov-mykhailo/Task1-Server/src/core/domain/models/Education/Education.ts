import RoleDomainModel from "../Role/Role";

export default class EducationDomainModel {
    constructor(
        public readonly id: number,
        public readonly educationTitle: string,
        public readonly description: string | null
    ) {}
}