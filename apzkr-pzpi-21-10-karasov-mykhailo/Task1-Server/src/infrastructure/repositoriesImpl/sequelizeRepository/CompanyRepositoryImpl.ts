import ICompanyRepository from "../../../core/repositories/CompanyRepository/ICompanyRepository";
import CreateOrUpdateCompanyDto from "../../../core/repositories/CompanyRepository/dto/CreateOrUpdateCompanyDto";
import CompanyDomainModel from "../../../core/domain/models/Company/Company";
import Company from "../../database/etities/Company";
import IMapper from "../../mappers/IMapper";
import MapperFabric from "../../mappers/MapperFabric";
import MappersEnum from "../../../core/common/enums/MappersEnum";
import User from "../../database/etities/User";


export default class CompanyRepositoryImpl implements ICompanyRepository {
    private readonly companyMapper: IMapper<any, any> = MapperFabric.getMapper(MappersEnum.CompanyMapper);

    async getCompanyByTitle(companyTitle: string): Promise<CompanyDomainModel | null> {
        const company = await Company.findOne({where: { companyName: companyTitle}});
        if (!company) {
            return null;
        }
        return this.companyMapper.toDomainModel(company);
    }
    async getAllCompanies(): Promise<CompanyDomainModel[]> {
        const companies = await Company.findAll();
        return companies.map(company => {
            return this.companyMapper.toDomainModel(company);
        });
    }
    async createCompany(dto: CreateOrUpdateCompanyDto, companyImage: string): Promise<CompanyDomainModel> {
        const company = await Company.create({
            companyName: dto.companyName,
            description: dto.description,
            companyImage: companyImage,
        });
        if (dto.creatingUserId) {
            console.log('here')
            const user = await User.findOne({where: {id: dto.creatingUserId}});
            if (user) {
                company.userId = user.id;
                await company.save();
            }
        }

        return this.companyMapper.toDomainModel(company);
    }

    async getCompanyByName(companyName: string): Promise<CompanyDomainModel | null> {
        const company = await Company.findOne({ where: { companyName } });
        if (!company) {
            return null;
        }
        return this.companyMapper.toDomainModel(company);
    }

    async getCompanyByUserId(userId: number): Promise<CompanyDomainModel | null> {
        const company = await Company.findOne({
            where: { userId }
        });
        if (!company) {
            return null;
        }
        return this.companyMapper.toDomainModel(company);
    }

    async getCompanyById(companyId: number): Promise<CompanyDomainModel | null> {
        const company = await Company.findOne({ where: { id: companyId } });
        if (!company) {
            return null;
        }
        return this.companyMapper.toDomainModel(company);
    }

    async updateCompany(companyId: number, dto: CreateOrUpdateCompanyDto, companyImage: any): Promise<CompanyDomainModel | null> {
        const company = await Company.findOne({ where: { id: companyId } });
        if (!company) {
            return null;
        }

        company.companyName = dto.companyName;
        company.description = dto.description;
        if (companyImage) {
            company.companyImage = companyImage;
        }
        company.userId = dto.creatingUserId;
        await company.save();
        return this.companyMapper.toDomainModel(company);
    }

    async deleteCompany(companyId: number): Promise<void> {
        const company = await Company.findOne({ where: { id: companyId } });
        await company?.destroy();
        return;
    }
}