import IMapperCreator from "../IMapperCreator";
import IMapper from "../IMapper";
import EducationDomainModel from "../../../core/domain/models/Education/Education";
import Education from "../../database/etities/Education";
import EducationMapper from "./EducationMapper";

export default class EducationMapperCreator implements IMapperCreator<Education, EducationDomainModel> {
    createMapper(): IMapper<Education, EducationDomainModel> {
        return new EducationMapper();
    }

}