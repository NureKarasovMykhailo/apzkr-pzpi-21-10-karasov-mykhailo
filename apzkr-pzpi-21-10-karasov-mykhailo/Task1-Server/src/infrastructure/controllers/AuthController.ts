import {NextFunction, Request, Response} from "express";
import ApiError from "../../core/common/error/ApiError";
import {validationResult} from "express-validator";
import formatValidationErrors from "../../core/common/uttils/ValidationErrorsUttils";
import {RegistrationDto} from "../../core/repositories/AuthRepository/dto/RegistrationDto";
import AuthService from "../../core/services/AuthService/AuthService";
import LoginDto from "../../core/repositories/AuthRepository/dto/LoginDto";

class AuthController {

    constructor(private readonly authService: AuthService) {}

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const dto: LoginDto = new LoginDto(email, password);
            const token = await this.authService.login(dto);
            return res.status(200).json({ token: token });
        } catch (error) {
            next(error);
        }
    }

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                email,
                password,
                passwordConfirm,
                firstName,
                secondName,
                birthday,
                phoneNumber
            } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }
            let dto: RegistrationDto = new RegistrationDto(
                email,
                password,
                passwordConfirm,
                firstName,
                secondName,
                birthday,
                phoneNumber
            );
            const token = await this.authService.registration(dto);
            return res.status(201).json({token: token});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async checkAuth(req: Request, res: Response, next: NextFunction) {
        try {

            const token = await this.authService.checkAuth(req.user);
            return res.status(200).json({ token: token });
        } catch (error) {
            console.log(error);
            next(error);
        }

    }

}

export default AuthController;

