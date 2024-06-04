export const hasUserRole = (userRoles, possibleRoles) => {
    return userRoles.some(role => possibleRoles.includes(role));
}