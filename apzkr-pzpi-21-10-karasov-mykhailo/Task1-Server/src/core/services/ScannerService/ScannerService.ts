import IScannerRepository from "../../repositories/ScannerRepository/IScannerRepository";
import CreateOrUpdateScannerDto from "../../repositories/ScannerRepository/dto/CreateOrUpdateScannerDto";
import ApiError from "../../common/error/ApiError";
import IUserRepository from "../../repositories/UserRepository/IUserRepository";
import PaginationClass from "../../common/uttils/PaginationClass";
import ScannerDomainModel from "../../domain/models/Scanner/Scanner";
import i18n from "i18n";
import RolesEnum from "../../common/enums/RolesEnum";

export default class ScannerService {
    constructor(
        private readonly scannerRepository: IScannerRepository,
        private readonly userRepository: IUserRepository,
    ){}

    public async createScanner(dto: CreateOrUpdateScannerDto) {
        if (dto.userId && dto.companyId) {
            await this.checkUser(dto.userId, dto.companyId);
        }
        return await this.scannerRepository.createScanner(dto);
    }

    public async updateScanner(dto: CreateOrUpdateScannerDto, scannerId: number) {

        //@ts-ignore
        if (dto.userId !== null && dto.companyId !== null) {
            console.log('here')
            // @ts-ignore
            await this.checkUser(dto.userId, dto.companyId);
        }
        console.log('here')
        return await this.scannerRepository.updateScanner(dto, scannerId);
    }



    public async getScanner(id: number, companyId: number) {
        const scanner = await this.scannerRepository.getScannerById(id);
        if (!scanner) {
            throw ApiError.notFound(i18n.__('scannerNotFound'));
        }
        if (scanner.companyId !== companyId) {
            throw ApiError.forbidden(i18n.__('youHaveNotAccessToThisInformation'));
        }
        return scanner;
    }


    public async getCompanyScanners(companyId: number, limit: number, offset: number) {
        const scanners = await this.scannerRepository.getScannersByCompany(companyId);
        const paginationClass: PaginationClass<ScannerDomainModel> = new PaginationClass();
        return paginationClass.paginateItems(scanners, offset, limit);
    }

    public async deleteScanner(id: number, companyId: number) {
        const scanner = await this.scannerRepository.getScannerById(id);
        if (scanner) {
            if (scanner.companyId !== companyId) {
                throw ApiError.forbidden(i18n.__('youHaveNotAccessToThisInformation'));
            }
            await this.scannerRepository.deleteScanner(id);
        }
        return;
    }

    public async deleteScannerAdmin(id: number) {
        await this.scannerRepository.deleteScanner(id);
        return;
    }

    private async checkUser(userId: number, companyId: number) {
        const user = await this.userRepository.getUserById(userId);
        if (user) {
            //if (user.companyId !== companyId && !user.roles?.includes(RolesEnum.ADMIN)) {
              //  throw ApiError.forbidden(i18n.__('youHaveNotAccessToThisInformation'));
            //}
        } else {
            throw ApiError.notFound(i18n.__('userNotFound'));
        }
    }

    public async getScannerById(scannerId: number) {
        const scanner = await this.scannerRepository.getScannerById(scannerId);
        if (!scanner) {
            throw ApiError.notFound(i18n.__('scannerNotFound'));
        }
        return scanner;
    }

    public async getScanners(offset: number, limit: number) {
        const scanners =  await this.scannerRepository.getScanners();
        const paginationClass: PaginationClass<ScannerDomainModel> = new PaginationClass();
        return paginationClass.paginateItems(scanners, offset, limit);
    }

}