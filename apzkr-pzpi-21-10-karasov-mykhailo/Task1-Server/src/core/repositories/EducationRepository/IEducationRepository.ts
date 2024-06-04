import EducationDomainModel from "../../domain/models/Education/Education";
import CreateEducationDto from "./dto/CreateEducation";

export default interface IEducationRepository {
    getEducationByTitle(educationTitle: string): Promise<EducationDomainModel | null>;
    createEducation(dto: CreateEducationDto): Promise<EducationDomainModel>;
    getAllEducations(): Promise<EducationDomainModel[]>;
    getEducationById(id: number): Promise<EducationDomainModel | null>;
    updateEducation(id: number, dto: CreateEducationDto): Promise<EducationDomainModel | null>;
    deleteEducation(id: number): Promise<void>;
}