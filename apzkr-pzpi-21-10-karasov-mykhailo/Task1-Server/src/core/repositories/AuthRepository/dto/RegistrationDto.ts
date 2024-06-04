export class RegistrationDto {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly passwordConfirm: string,
        public readonly firstName: string,
        public readonly secondName: string,
        public readonly birthday: Date,
        public readonly phoneNumber: string | null,
    ) {}
}