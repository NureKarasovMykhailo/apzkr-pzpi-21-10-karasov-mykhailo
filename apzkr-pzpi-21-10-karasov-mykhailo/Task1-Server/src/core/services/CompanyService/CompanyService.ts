import ICompanyRepository from "../../repositories/CompanyRepository/ICompanyRepository";
import CreateOrUpdateCompanyDto from "../../repositories/CompanyRepository/dto/CreateOrUpdateCompanyDto";
import ApiError from "../../common/error/ApiError";
import IUserRepository from "../../repositories/UserRepository/IUserRepository";
import JWT from "../../common/uttils/JWT";
import FileManager from "../../common/uttils/FileManager";
import {DEFAULT_COMPANY_IMAGE_NAME} from "../../../config";
import RolesEnum from "../../common/enums/RolesEnum";
import CompanyDomainModel from "../../domain/models/Company/Company";
import PaginationClass from "../../common/uttils/PaginationClass";
import i18n from "i18n";
import UserDomainModel from "../../domain/models/User/User";

export default class CompanyService {
    private readonly fileManager: FileManager = new FileManager();
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async createCompany(dto: CreateOrUpdateCompanyDto) {
        if (dto.creatingUserId && await this.userRepository.getUserById(dto.creatingUserId) === null) {
            throw ApiError.badRequest(i18n.__('userNotFound'))
        }

        if (!await this.isCompanyNameUnique(dto.companyName)) {
            throw ApiError.conflict(i18n.__('companyWithNameAlreadyExist'));
        }
        if (dto.creatingUserId && await this.isUserHasCompany(dto.creatingUserId)) {
            throw ApiError.forbidden(i18n.__('thisUserHasAlreadyCompany'));
        }

        let fileName = DEFAULT_COMPANY_IMAGE_NAME;
        if (dto.companyImage !== DEFAULT_COMPANY_IMAGE_NAME) {
            fileName = await this.fileManager.createFile(dto.companyImage);
        }

        const company = await this.companyRepository.createCompany(dto, fileName);
        console.log(company)
        if (dto.creatingUserId) {
            const creatingUser = await this.userRepository.getUserById(dto.creatingUserId);
            if (creatingUser) {
                const user = await this.userRepository.setCompanyId(dto.creatingUserId, company.id);
                if (!user) {
                    throw ApiError.notFound(i18n.__('userNotFound'));
                }
                const roles = await this.userRepository.getUserRoles(user.id);
                const jwt = new JWT(user, roles);
                const token = jwt.generateJwt();
                return {token: token, company: company};
            }
        }
        return { company };
    }

    async getCompanyById(companyId: number) {
        const company = await this.companyRepository.getCompanyById(companyId);
        if (!company) {
            throw ApiError.notFound(i18n.__('companyNotFound'));
        }
        return company;
    }

    async updateCompany(companyId: number, dto: CreateOrUpdateCompanyDto) {
        if (dto.creatingUserId && await this.userRepository.getUserById(dto.creatingUserId) === null) {
            throw ApiError.badRequest(i18n.__('userNotFound'))
        }

        const company = await this.getCompanyById(companyId);
        if (!await this.isCompanyNameUnique(dto.companyName) && dto.companyName !== company.companyName) {
            throw ApiError.conflict(i18n.__('companyWithNameAlreadyExist'));
        }

        let fileName = null;
        if (dto.companyImage) {
            if (company.companyImage !== DEFAULT_COMPANY_IMAGE_NAME) {
                await this.fileManager.deleteFile(company.companyImage);
            }
            fileName = await this.fileManager.createFile(dto.companyImage);
        }

        const updatedCompany = await this.companyRepository.updateCompany(companyId, dto, fileName);
        if (!updatedCompany) {
            throw ApiError.notFound(i18n.__('companyNotFound'));
        }
        return updatedCompany;
    }

    async deleteCompanyByToken(companyId: number, userId: number) {
        const company = await this.getCompanyById(companyId);
        if (company.companyImage !== DEFAULT_COMPANY_IMAGE_NAME) {
            await this.fileManager.deleteFile(company.companyImage);
        }
        if (company.ownerId !== userId) {
            throw ApiError.forbidden(i18n.__('youCannotDeleteOtherCompanyUser'));
        }
        await this.companyRepository.deleteCompany(companyId);
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        const roles = await this.userRepository.getUserRoles(user.id);
        const jwt = new JWT(user, roles);
        return jwt.generateJwt();

    }

    public async addEmployee(addedEmployeeId: number, companyId: number) {
        let addedEmployee = await this.userRepository.getUserById(addedEmployeeId);
        if (!addedEmployee) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        if (addedEmployee.companyId) {
            throw ApiError.conflict(i18n.__('userHasAlreadyWorkingInCompany'));
        }

        addedEmployee = await this.userRepository.setCompanyId(addedEmployeeId, companyId);
        if (!addedEmployee) {
            throw ApiError.internalServerError(i18n.__('errorWithAddingEmployee'));
        }

        return addedEmployee;
    }

    public async deleteEmployee(deletingUserId: number, companyId: number) {
        const deletingUser = await this.userRepository.getUserById(deletingUserId);

        if (!deletingUser) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }

        if (deletingUser.companyId !== companyId) {
            throw ApiError.forbidden(i18n.__('youCannotDeleteOtherCompanyUser'));
        }

        const deletingUserRoles = await this.userRepository.getUserRoles(deletingUserId);
        deletingUserRoles.map(role => {
            if (role.roleTitle === RolesEnum.SUBSCRIBER) {
                throw ApiError.forbidden(i18n.__('youCannotDeleteUserWithThisRole'));
            }
        });
        const unpinUser = await this.userRepository.unpinUserFromCompany(deletingUserId);
        if (!unpinUser) {
            throw ApiError.internalServerError(i18n.__('unknownError'));
        }
        const roles = await this.userRepository.getUserRoles(unpinUser.id);
        const jwt = new JWT(unpinUser, roles);
        return jwt.generateJwt();
    }

    public async getCompanies(companyName: string, sortBy: string, offset: number, limit: number) {
        let companies: CompanyDomainModel[] = [];

        if (companyName) {
            const company = await this.companyRepository.getCompanyByTitle(companyName);
            if (company) {
                companies.push(company);
            }
        } else {
            companies = await this.companyRepository.getAllCompanies();

            if (sortBy) {
                companies = this.sortCompany(sortBy, companies);
            }
        }
        console.log(companies)

        const pagination: PaginationClass<CompanyDomainModel> = new PaginationClass();

        return pagination.paginateItems(companies, offset, limit);

    }

    public async deleteCompany(companyId: number) {
        const company = await this.getCompanyById(companyId);
        if (company.companyImage !== DEFAULT_COMPANY_IMAGE_NAME) {
            await this.fileManager.deleteFile(company.companyImage);
        }

        await this.companyRepository.deleteCompany(companyId);
        return;
    }

    public async getCompanyEmployees(companyId: number, offset: number, limit: number, email?: string) {
        let employees = await this.userRepository.getUserByCompanyId(companyId);
        if (email) {
            employees = employees.filter(user => user.email === email);
        }
        const pagination: PaginationClass<UserDomainModel> = new PaginationClass();
        return pagination.paginateItems(employees, offset, limit);
    }

    public async getCompanyEmployee(companyId: number, userId: number) {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
        if (user.companyId !== companyId) {
            throw ApiError.notFound(i18n.__('youHaveNotAccessToThisInformation'));
        }

        return user;
    }

    public async getUsersWithoutCompany(offset: number, limit: number) {
        const users = await this.userRepository.getUserWithoutCompany();
        const pagination: PaginationClass<UserDomainModel> = new PaginationClass();
        return pagination.paginateItems(users, offset, limit);
    }

    private async isUserHasCompany(userId: number): Promise<boolean> {
        const candidateCompany = await this.companyRepository.getCompanyByUserId(userId);
        return candidateCompany !== null;
    }

    private async isCompanyNameUnique(companyName: string): Promise<boolean> {
        const candidateCompany = await this.companyRepository.getCompanyByName(companyName);
        return candidateCompany === null;
    }

    private sortCompany(sortBy: string, companies: CompanyDomainModel[]) {
        if (sortBy ===  'asc') {
            companies.sort((a, b) => a.companyName.localeCompare(b.companyName));
        } else if (sortBy === 'desc') {
            companies.sort((a, b) => b.companyName.localeCompare(a.companyName));
        }
        return companies;
    }
}