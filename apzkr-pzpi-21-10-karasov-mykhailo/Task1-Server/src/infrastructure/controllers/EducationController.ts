import {NextFunction, Request, Response} from "express";
import CreateEducationDto from "../../core/repositories/EducationRepository/dto/CreateEducation";
import {validationResult} from "express-validator";
import formatValidationErrors from "../../core/common/uttils/ValidationErrorsUttils";
import ApiError from "../../core/common/error/ApiError";
import EducationService from "../../core/services/EducationService/EducationService";
import EducationRepository from "../repositoriesImpl/sequelizeRepository/EducationRepository";
import EducationDomainModel from "../../core/domain/models/Education/Education";
import Education from "../database/etities/Education";
import IMapper from "../mappers/IMapper";
import MapperFabric from "../mappers/MapperFabric";
import MappersEnum from "../../core/common/enums/MappersEnum";

class EducationController {

    private readonly educationMapper: IMapper<any, any> = MapperFabric.getMapper(MappersEnum.EducationMapper);

    constructor(
       private readonly educationService: EducationService
    ) {}

    async createEducation(req: Request, res: Response, next: NextFunction) {
        try {
            const {educationTitle, description} = req.body;
            const dto: CreateEducationDto = new CreateEducationDto(educationTitle, description);

            const errors = validationResult(req.body);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }

            const education = await this.educationService.createEducation(dto);
            return res.status(201).json({ education: education });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                educationTitle,
                limit = '10',
                page = '1'
            } = req.query;

            const offset = Number(limit) * Number(page) - Number(limit);

            const paginatedEducationDomain = await this.educationService.getAll(
                offset,
                Number(limit),
                educationTitle as string
            );
            const educations = paginatedEducationDomain.paginatedItems.map(education => {
               return this.educationMapper.toPersistenceModel(education);
            });
            return res.status(200).json({
                educations: educations,
                pagination: {
                    totalItems: paginatedEducationDomain.itemsCount,
                    totalPages: paginatedEducationDomain.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const educationDomainModel = await this.educationService.getEducationById(Number(id));
            return res.status(200).json({ education: this.educationMapper.toPersistenceModel(educationDomainModel) });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async updateEducation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { educationTitle, description } = req.body;

            const errors = validationResult(req.body);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }

            const dto: CreateEducationDto = new CreateEducationDto(educationTitle, description);
            const educationDomain: EducationDomainModel
                = await this.educationService.updateEducation(Number(id), dto);
            const education: Education = this.educationMapper.toPersistenceModel(educationDomain);
            return res.status(200).json({ education: education });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async deleteEducation(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.educationService.deleteEducation(Number(id));
            return res.status(200).json({});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default new EducationController(new EducationService(new EducationRepository()));