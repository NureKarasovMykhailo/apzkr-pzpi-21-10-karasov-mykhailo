export const getRoleTitles = (rolesArray) => {
    let roleTitles = [];
    rolesArray.map(role => {
        if (role.roleTitle) {
            roleTitles.push(role.roleTitle);
        }
    });

    return roleTitles;
}