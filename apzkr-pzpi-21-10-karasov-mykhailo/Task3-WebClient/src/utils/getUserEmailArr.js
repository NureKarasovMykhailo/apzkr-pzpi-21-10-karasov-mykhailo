
export const getUserEmailArr = (users) => {
    const usersEmail = [];
    for (let i = 0; i < users.length; i++) {
        usersEmail.push(users[i].email);
    }
    return usersEmail;
}