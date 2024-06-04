import IEducationRepository from "../../../core/repositories/EducationRepository/IEducationRepository";
import EducationDomainModel from "../../../core/domain/models/Education/Education";
import Education from "../../database/etities/Education";
import CreateEducationDto from "../../../core/repositories/EducationRepository/dto/CreateEducation";
import IMapper from "../../mappers/IMapper";
import MapperFabric from "../../mappers/MapperFabric";
import MappersEnum from "../../../core/common/enums/MappersEnum";

export default class EducationRepository implements IEducationRepository{

    private educationMapper: IMapper<any, any> = MapperFabric.getMapper(MappersEnum.EducationMapper);
    async getEducationByTitle(educationTitle: string): Promise<EducationDomainModel | null> {
        const education = await Education.findOne({where: {educationTitle}});
        if (!education) {
            return null;
        }
        return this.educationMapper.toDomainModel(education);
    }

    async createEducation(dto: CreateEducationDto): Promise<EducationDomainModel> {
        const education = await Education.create({...dto});
        return this.educationMapper.toDomainModel(education)
    }

    async getAllEducations(): Promise<EducationDomainModel[]> {
        const educationsArr: Education[] = await Education.findAll();
        console.log(educationsArr);
        return educationsArr.map(education => {
            return this.educationMapper.toDomainModel(education);
        });
    }

    async getEducationById(id: number): Promise<EducationDomainModel | null> {
        const education = await Education.findOne({where: { id }});
        if (!education) {
            return null;
        }
        return this.educationMapper.toDomainModel(education);
    }

    async updateEducation(id: number, dto: CreateEducationDto): Promise<EducationDomainModel | null> {
        const education = await Education.findOne({ where: { id } });
        if (!education) {
            return null;
        }

        education.educationTitle = dto.educationTitle;
        education.description = dto.description;

        await education.save();
        return this.educationMapper.toDomainModel(education);
    }

    async deleteEducation(id: number): Promise<void> {
        const education = await Education.findOne({ where: { id } });
        education?.destroy();
    }


}