import CreateOrUpdateComplexityDto from "./dto/CreateOrUpdateComplexityDto";
import ComplexityDomainModel from "../../domain/models/Complexity/Complexity";

export default interface IComplexityRepository {
    createComplexity(dto: CreateOrUpdateComplexityDto): Promise<ComplexityDomainModel>;
    getAllComplexities(): Promise<ComplexityDomainModel[]>;
    getComplexityById(id: number): Promise<ComplexityDomainModel | null>;
    updateComplexity(id: number, dto: CreateOrUpdateComplexityDto): Promise<ComplexityDomainModel>;
    deleteComplexityById(id: number): Promise<void>;
}