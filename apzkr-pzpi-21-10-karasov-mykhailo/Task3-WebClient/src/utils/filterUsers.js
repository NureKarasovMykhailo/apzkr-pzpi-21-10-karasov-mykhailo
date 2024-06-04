export const filterUsers = (userId, users) => {
    return users.filter(user => user.id !== userId);
}