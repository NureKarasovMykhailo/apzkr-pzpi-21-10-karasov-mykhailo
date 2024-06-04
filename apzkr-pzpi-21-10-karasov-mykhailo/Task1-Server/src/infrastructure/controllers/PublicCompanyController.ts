import {NextFunction, Response, Request} from "express";
import {DEFAULT_COMPANY_IMAGE_NAME} from "../../config";
import CreateOrUpdateCompanyDto from "../../core/repositories/CompanyRepository/dto/CreateOrUpdateCompanyDto";
import CompanyService from "../../core/services/CompanyService/CompanyService";
import ApiError from "../../core/common/error/ApiError";
import {validationResult} from "express-validator";
import formatValidationErrors from "../../core/common/uttils/ValidationErrorsUttils";
import i18n from "i18n";
import IMapper from "../mappers/IMapper";

export default class PublicCompanyController {
    constructor(
       private readonly companyService: CompanyService,
       private readonly companyMapper: IMapper<any, any>,
       private readonly userMapper: IMapper<any, any>
    ) {}

    public async createCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                companyName,
                description
            } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }

            let companyImage = DEFAULT_COMPANY_IMAGE_NAME;
            if (req.files) {
                // @ts-ignore
                companyImage = req.files.companyImage;
            }

            const dto: CreateOrUpdateCompanyDto = new CreateOrUpdateCompanyDto(
                companyName,
                description,
                companyImage,
                req.user.id
            );

            // @ts-ignore
            const {token, company} = await this.companyService.createCompany(dto);
            return res.status(201).json({ token: token, company: this.companyMapper.toPersistenceModel(company) });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getCompany(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            if (req.user.companyId) {
                // @ts-ignore
                const companyDomainModel = await this.companyService.getCompanyById(Number(req.user.companyId));
                const company = this.companyMapper.toPersistenceModel(companyDomainModel);
                return res.status(200).json({ company: company });
            } else {
                return next(ApiError.notFound(i18n.__('youHaveNotAnyCompany')));
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updateCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                companyName,
                description,
            } = req.body;
            let companyImage = null;
            // @ts-ignore
            if (req.files) {
                companyImage = req.files.companyImage;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = formatValidationErrors(errors.array());
                return next(ApiError.badRequest(errorMessages.join(', ')));
            }

            const dto: CreateOrUpdateCompanyDto = new CreateOrUpdateCompanyDto(
                companyName,
                description,
                companyImage,
                req.user.id
            );
            // @ts-ignore
            if (req.user.companyId) {
                // @ts-ignore
                const updatedCompanyDomain = await this.companyService.updateCompany(req.user.companyId, dto);
                const updatedCompany = this.companyMapper.toPersistenceModel(updatedCompanyDomain);
                return res.status(200).json({ company: updatedCompany } );
            } else {
                return next(ApiError.notFound(i18n.__('youHaveNotAnyCompany')));
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteCompany(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            if (req.user.companyId) {
                // @ts-ignore
                const token = await this.companyService.deleteCompanyByToken(req.user.companyId, req.user.id);
                return res.status(200).json({token: token});
            } else {
                return next(ApiError.notFound(i18n.__('youHaveNotAnyCompany')));
            }

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async addEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (req.user.companyId) {
                const addedEmployeeDomainModel = await this.companyService.addEmployee(Number(id), req.user.companyId);
                const addedEmployee = this.userMapper.toPersistenceModel(addedEmployeeDomainModel);
                return res.status(200).json({ addedUser: addedEmployee });
            } else {
                return next(ApiError.internalServerError(i18n.__('unknownError')));
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                await this.companyService.deleteEmployee(Number(id), req.user.companyId);
                return res.status(200).json({ });
            } else {
                return next(ApiError.internalServerError(`Unexpected error`));
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getAllCompanyEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const {email,  limit = '10', page = '1' } = req.query;
                const offset = Number(page) * Number(limit) - Number(limit);
                const paginatedUsers = await this.companyService.getCompanyEmployees(req.user.companyId, offset, Number(limit), email as string);

                return res.status(200).json({
                    users: paginatedUsers.paginatedItems,
                    pagination: {
                        totalItems: paginatedUsers.itemsCount,
                        totalPages: paginatedUsers.totalPages,
                        currentPage: page,
                        itemsPerPage: limit
                    }
                })
            }
        } catch (error){
            console.log(error);
            next(error);
        }
    }

    public async getCompanyEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user.companyId) {
                const { id } = req.params;
                const user = await this.companyService.getCompanyEmployee(req.user.companyId, Number(id));

                return res.status(200).json(user);
            }
        } catch (error){
            console.log(error);
            next(error);
        }
    }

    public async getUsersWithoutCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const {  limit = '10', page = '1' } = req.query;
            const offset = Number(page) * Number(limit) - Number(limit);
            const paginatedUsers = await this.companyService.getUsersWithoutCompany(offset, Number(limit));

            return res.status(200).json({
                users: paginatedUsers.paginatedItems,
                pagination: {
                    totalItems: paginatedUsers.itemsCount,
                    totalPages: paginatedUsers.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}