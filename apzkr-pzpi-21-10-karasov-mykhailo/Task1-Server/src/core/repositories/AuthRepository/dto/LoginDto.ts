export default class LoginDto {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {}
}