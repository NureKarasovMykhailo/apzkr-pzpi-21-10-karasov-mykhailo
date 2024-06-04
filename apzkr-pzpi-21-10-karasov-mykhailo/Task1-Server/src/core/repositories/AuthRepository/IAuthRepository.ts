import LoginDto from "./dto/LoginDto";
import {RegistrationDto} from "./dto/RegistrationDto";
import UserDomainModel from "../../domain/models/User/User";

export interface IAuthRepository {
    getUserByEmail(email: string): Promise<UserDomainModel | null>;
    userRegistration(dto: RegistrationDto): Promise<UserDomainModel>;
}