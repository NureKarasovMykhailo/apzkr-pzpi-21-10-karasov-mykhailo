import * as jwt from 'jsonwebtoken';
import {JWT_SECRET_KEY} from "../../../config";
import UserDomainModel from "../../domain/models/User/User";
import RoleDomainModel from "../../domain/models/Role/Role";


export default class JWT {

    private readonly payload: any;

    private readonly _user: UserDomainModel;
    private readonly _roles: RoleDomainModel[];

    constructor(user: UserDomainModel, roles: RoleDomainModel[]) {
        this._user = user;
        this._roles = roles;
    }

    generateJwt() {

        const payload = {
            id: this._user.id,
            email: this._user.email,
            firstName: this._user.firstName,
            secondName: this._user.secondName,
            birthday: this._user.birthday,
            userImage: this._user.userImage,
            phoneNumber: this._user.phoneNumber,
            companyId: this._user.companyId,
            roles: this._roles
        };

        return jwt.sign(payload, JWT_SECRET_KEY, {
            expiresIn: '24h'
        })
    }
}
