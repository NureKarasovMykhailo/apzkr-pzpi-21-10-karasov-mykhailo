export const getPaginationArray = (pagesCount) => {
    const arr = [];
    for (let i = 1; i <= pagesCount; i++) {
        arr.push(i);
    }

    return arr;
}