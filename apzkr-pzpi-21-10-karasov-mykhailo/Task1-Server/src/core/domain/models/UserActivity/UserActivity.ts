import UserDomainModel from "../User/User";

export default class UserActivityDomainModel {
    constructor(
       readonly id: number,
       readonly userId: number | null,
       readonly activityId: number | null,
    ) {}
}