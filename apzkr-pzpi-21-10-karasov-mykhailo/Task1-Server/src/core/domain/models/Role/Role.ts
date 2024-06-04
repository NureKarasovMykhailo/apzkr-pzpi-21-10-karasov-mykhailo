import User from "../User/User";

export default class RoleDomainModel {
    constructor(
        public readonly id: number,
        public readonly roleTitle: string,
        public readonly description: string | null,
    ) {}
}