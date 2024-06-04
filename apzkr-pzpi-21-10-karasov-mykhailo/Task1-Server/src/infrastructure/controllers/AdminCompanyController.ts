import CompanyService from "../../core/services/CompanyService/CompanyService";
import {Request, NextFunction, Response} from "express";
import {validationResult} from "express-validator";
import formatValidationErrors from "../../core/common/uttils/ValidationErrorsUttils";
import ApiError from "../../core/common/error/ApiError";
import CreateOrUpdateCompanyDto from "../../core/repositories/CompanyRepository/dto/CreateOrUpdateCompanyDto";
import {DEFAULT_COMPANY_IMAGE_NAME} from "../../config";

export default class AdminCompanyController {
    constructor(
        private companyService: CompanyService
    ) {}

    public async create(req: Request, res: Response, next: NextFunction) {
        try {

            const {
                companyName,
                description,
                userId
            } = req.body;
            let companyImage = DEFAULT_COMPANY_IMAGE_NAME;
            if (req.files) {
                // @ts-ignore
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
                userId
            );
            // @ts-ignore
            const { company } = await this.companyService.createCompany(dto);
            return res.status(201).json({company: company});

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async  getCompanies(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                companyName,
                sortBy,
                limit= '10',
                page = '1'
            } = req.query;

            const offset: number = Number(page) * Number(limit) - Number(limit);
            const paginatedCompanies = await this.companyService.getCompanies(
                companyName as string,
                sortBy as string,
                offset,
                Number(limit)
            );

            return res.status(200).json({
                companies: paginatedCompanies.paginatedItems,
                pagination: {
                    totalItems: paginatedCompanies.itemsCount,
                    totalPages: paginatedCompanies.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async getCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const company = await this.companyService.getCompanyById(Number(id));
            return res.status(200).json({ company: company });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async updateCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const {
                companyName,
                description,
                userId
            } = req.body;
            let companyImage = null;

            if (req.files) {
                // @ts-ignore
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
                userId
            );
            const company = await this.companyService.updateCompany(Number(id), dto);
            return res.status(200).json({ company });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    public async deleteCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.companyService.deleteCompany(Number(id));
            return res.status(200).json({ });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}