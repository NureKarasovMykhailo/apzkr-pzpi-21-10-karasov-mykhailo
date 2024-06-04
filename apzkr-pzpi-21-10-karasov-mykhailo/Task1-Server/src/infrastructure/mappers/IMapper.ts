export default interface IMapper<T, G> {
    toDomainModel(data: T): G;
    toPersistenceModel(data: G): T;
}