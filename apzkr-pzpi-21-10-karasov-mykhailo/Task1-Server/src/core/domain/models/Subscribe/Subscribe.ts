import UserDomainModel from "../User/User";

export default class Subscribe {
    constructor(
        public readonly id: number,
        public readonly code: string,
        public readonly validUntil: Date,
        public readonly isValid: boolean,
        public readonly userId: number | null
    ) {}
}