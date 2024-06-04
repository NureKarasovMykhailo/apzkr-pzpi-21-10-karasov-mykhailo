import IMapper from "../IMapper";
import Complexity from "../../database/etities/Complexity";
import ComplexityDomainModel from "../../../core/domain/models/Complexity/Complexity";

export default class ComplexityMapper implements IMapper<Complexity, ComplexityDomainModel> {
    toDomainModel(data: Complexity): ComplexityDomainModel {
        return new ComplexityDomainModel(
            data.id,
            data.complexityTitle,
            data.evaluation
        );
    }

    toPersistenceModel(data: ComplexityDomainModel): Complexity {
        const complexity = new Complexity();
        complexity.id = data.id;
        complexity.complexityTitle = data.complexityTitle;
        complexity.evaluation = data.evaluation;

        return complexity;
    }

}