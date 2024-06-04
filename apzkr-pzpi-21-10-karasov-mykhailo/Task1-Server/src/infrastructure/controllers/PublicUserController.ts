
import {NextFunction, Response, Request} from "express";
import UpdateUserPublicDto from "../../core/repositories/UserRepository/dto/UpdateUserPublicDto";
import PublicUserService from "../../core/services/PublicUserService/PublicUserService";
import AddOrDeleteEducationDto from "../../core/repositories/UserRepository/dto/AddOrDeleteEducationDto";

class PublicUserController {

    constructor(
        private readonly userService: PublicUserService,
    ) {}

   public async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                firstName,
                secondName,
                birthday,
                phoneNumber,
            } = req.body;

            let userImage;

            if (req.files) {
                userImage = req.files.userImage;
            }

            const dto: UpdateUserPublicDto = new UpdateUserPublicDto(
                firstName,
                secondName,
                birthday,
                phoneNumber,
                userImage || null
            );


            const token = await this.userService.updateUser(req.user.id, dto);
            return res.status(200).json({ token: token });

        } catch (error) {
            console.log(error);
            next(error);
        }
   }

   public async addEducation(req: Request, res: Response, next: NextFunction) {
        try {
            const { educationTitle } = req.body;
            const dto: AddOrDeleteEducationDto = new AddOrDeleteEducationDto(educationTitle);


            const token = await this.userService.addEducation(req.user.id, dto);
            return res.status(200).json({ token: token});
        } catch (error) {
            console.log(error);
            next(error);
        }
   }

   public async deleteEducation(req: Request, res: Response, next: NextFunction) {
        try {
            const { educationTitle } = req.body;
            const dto: AddOrDeleteEducationDto = new AddOrDeleteEducationDto(educationTitle);

            const token = await this.userService.deleteEducation(req.user.id, dto);
            return res.status(200).json({ token: token});
        } catch (error) {
            console.log(error);
            next(error);
        }
   }

   public async subscribe(req: Request, res: Response, next: NextFunction) {
        try {
            const subscriptionDetails = await this.userService.subscribe(req.user.id);

            res.send(subscriptionDetails);
        } catch (error) {
            console.log(error);
            next(error);
        }
   }

   public async getUserInfoByToken(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user) {
                const userData = await this.userService.getUserInfo(req.user.id);

                return res.status(200).json({user: userData});
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
   }

}

export default PublicUserController;