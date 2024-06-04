import IMapperCreator from "../IMapperCreator";
import IMapper from "../IMapper";
import Complexity from "../../database/etities/Complexity";
import ComplexityDomainModel from "../../../core/domain/models/Complexity/Complexity";
import ComplexityMapper from "./ComplexityMapper";

export default class ComplexityMapperCreator implements IMapperCreator<Complexity, ComplexityDomainModel> {
    createMapper(): IMapper<Complexity, ComplexityDomainModel> {
        return new ComplexityMapper();
    }

}