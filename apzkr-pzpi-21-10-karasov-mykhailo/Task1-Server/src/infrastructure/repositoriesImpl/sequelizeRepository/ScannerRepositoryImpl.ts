import IScannerRepository from "../../../core/repositories/ScannerRepository/IScannerRepository";
import CreateOrUpdateScannerDto from "../../../core/repositories/ScannerRepository/dto/CreateOrUpdateScannerDto";
import ScannerDomainModel from "../../../core/domain/models/Scanner/Scanner";
import Scanner from "../../database/etities/Scanner";
import User from "../../database/etities/User";
import ApiError from "../../../core/common/error/ApiError";
import Company from "../../database/etities/Company";
import i18n from "i18n";
import IMapper from "../../mappers/IMapper";
import MapperFabric from "../../mappers/MapperFabric";
import MappersEnum from "../../../core/common/enums/MappersEnum";

export default class ScannerRepositoryImpl implements IScannerRepository {
    private readonly scannerMapper: IMapper<any, any> = MapperFabric.getMapper(MappersEnum.ScannerMapper);

    async createScanner(dto: CreateOrUpdateScannerDto): Promise<ScannerDomainModel> {
        const user = await User.findOne({
            where: {id: dto.userId},
        });

        const company = await Company.findOne({ where: { id: dto.companyId }});
        if (!company) {
            throw ApiError.notFound(i18n.__('companyNotFound'));
        }

        let scanner: Scanner | null = await Scanner.create({
            description:  dto.description,
            userId: user?.id,
            companyId: dto.companyId
        });

        scanner = await Scanner.findOne({where: {id: scanner.id}, include: [User, Company]});
        if (!scanner ) {
            throw ApiError.notFound(i18n.__('scannerNotFound'))
        }

        return this.scannerMapper.toDomainModel(scanner);
    }

    async getScannerById(id: number): Promise<ScannerDomainModel | null> {
        const scanner = await Scanner.findOne({
            where: { id },
            include: [User, Company]
        });
        if (!scanner) {
            return null;
        }
        return this.scannerMapper.toDomainModel(scanner);
    }

    async updateScanner(dto: CreateOrUpdateScannerDto, id: number): Promise<ScannerDomainModel> {
        const user = await User.findOne({ where: {
            id: dto.userId}});

        const company = await Company.findOne({ where: { id: dto.companyId }});
        if (!company) {
            throw ApiError.notFound(i18n.__('companyNotFound'));
        }

        const scanner = await Scanner.findOne({
            where: { id },
            include: [User, Company]
        });
        if (!scanner) {
            throw ApiError.notFound(i18n.__('scannerNotFound'));
        }
        console.log(user);
        scanner.user = user || null;
        scanner.userId = user?.id || null;
        console.log(scanner.user)

        scanner.companyId = company.id;
        scanner.description = dto.description;
        await scanner.save();
        return this.scannerMapper.toDomainModel(scanner);
    }

    async deleteScanner(id: number): Promise<void> {
        const scanner = await Scanner.findOne({where: { id }});
        if (!scanner) {
            throw ApiError.notFound(i18n.__('scannerNotFound'));
        }
        await scanner.destroy();
        return;
    }

    async getScanners(): Promise<ScannerDomainModel[]> {
        let scannersDomainModel: ScannerDomainModel[];
        const scanners = await Scanner.findAll({include: [User, Company]});
        scannersDomainModel = scanners.map(scanner => {
            return this.scannerMapper.toDomainModel(scanner)
        });
        return scannersDomainModel;
    }

    async getScannersByCompany(companyId: number): Promise<ScannerDomainModel[]> {
        let scannersDomainModel: ScannerDomainModel[];
        const scanners = await Scanner.findAll({where: { companyId }, include: [User, Company]});
        scannersDomainModel = scanners.map(scanner => {
            return this.scannerMapper.toDomainModel(scanner)
        });
        return scannersDomainModel;
    }


}