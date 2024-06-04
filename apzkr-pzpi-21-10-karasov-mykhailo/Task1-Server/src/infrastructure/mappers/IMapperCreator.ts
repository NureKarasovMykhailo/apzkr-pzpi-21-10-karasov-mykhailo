import IMapper from "./IMapper";

export default interface IMapperCreator<T, G> {
    createMapper(): IMapper<T, G>;
}