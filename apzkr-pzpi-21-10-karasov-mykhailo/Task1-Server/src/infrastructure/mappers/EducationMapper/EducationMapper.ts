import IMapper from "../IMapper";
import Education from "../../database/etities/Education";
import EducationDomainModel from "../../../core/domain/models/Education/Education";
export default class EducationMapper implements IMapper<Education, EducationDomainModel> {
    toDomainModel(data: Education): EducationDomainModel {
        return new EducationDomainModel(
            data.id,
            data.educationTitle,
            data.description,
        );
    }

    toPersistenceModel(data: EducationDomainModel): Education {
        const education = new Education();
        education.id = data.id;
        education.educationTitle = data.educationTitle;
        education.description = data.description;
        return education;
    }

}