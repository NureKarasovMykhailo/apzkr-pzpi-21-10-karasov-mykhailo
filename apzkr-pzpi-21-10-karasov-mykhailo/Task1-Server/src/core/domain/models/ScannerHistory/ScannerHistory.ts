import UserDomainModel from "../User/User";

export default class ScannerHistoryDomainModel {
    constructor(
        public readonly id: number,
        public readonly temperature: number,
        public readonly pulse: number,
        public readonly activeWorkedTime: number,
        public readonly userId: number | null,
        public readonly scannerId: number | null,
        public readonly createdAt: Date,
        public readonly user: UserDomainModel | null = null
) {}
}