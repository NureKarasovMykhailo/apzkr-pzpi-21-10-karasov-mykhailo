class PaginationClass <T> {
    paginateItems(items: T[], offset: number, limit: number) {
        const itemsCount: number = items.length;
        const totalPages: number = Math.ceil(itemsCount / limit);
        const paginatedItems = items.slice(offset, offset + limit);

        return {items, paginatedItems, totalPages, itemsCount };
    }

}

export default PaginationClass;