import IComplexityRepository from "../../repositories/ComplexityRepository/IComplexityRepository";
import CreateOrUpdateComplexityDto from "../../repositories/ComplexityRepository/dto/CreateOrUpdateComplexityDto";
import ApiError from "../../common/error/ApiError";
import PaginationClass from "../../common/uttils/PaginationClass";
import ComplexityDomainModel from "../../domain/models/Complexity/Complexity";
import i18n from "i18n";

export default class ComplexityService {
    constructor(
        private readonly complexityRepository: IComplexityRepository ,
    ) {}

    public async createComplexity(dto: CreateOrUpdateComplexityDto) {
        return await this.complexityRepository.createComplexity(dto);
    }

    public async getAllComplexity(offset: number, limit: number) {
        const complexities = await this.complexityRepository.getAllComplexities();
        const pagination: PaginationClass<ComplexityDomainModel> = new PaginationClass();
        return pagination.paginateItems(complexities, offset, limit);
    }

    public async getComplexityById(id: number) {
        const complexity = await this.complexityRepository.getComplexityById(id);
        if (!complexity) {
            throw ApiError.notFound(i18n.__('complexityNotFound'));
        }
        return complexity;
    }

    public async updateComplexity(id: number, dto: CreateOrUpdateComplexityDto) {
        const complexity = await this.complexityRepository.getComplexityById(id);
        if (!complexity) {
            throw ApiError.notFound(i18n.__('complexityNotFound'));
        }
        return await this.complexityRepository.updateComplexity(id, dto);

    }

    public async deleteComplexity(id: number) {
        await this.complexityRepository.deleteComplexityById(id);
        return;
    }
}