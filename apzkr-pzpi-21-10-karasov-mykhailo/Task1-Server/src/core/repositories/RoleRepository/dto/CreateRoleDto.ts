export default class CreateRoleDto {
    constructor (
        public readonly roleTitle: string,
        public readonly description: string | null
    ) {}
}