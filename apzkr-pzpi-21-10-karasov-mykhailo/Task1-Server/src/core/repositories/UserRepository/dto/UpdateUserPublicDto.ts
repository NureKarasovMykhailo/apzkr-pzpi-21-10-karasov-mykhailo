export default class UpdateUserPublicDto {
    constructor(
        public readonly firstName: string,
        public readonly secondName: string,
        public readonly birthday: Date,
        public readonly phoneNumber: string,
        public readonly userImage: any
    ) {}
}