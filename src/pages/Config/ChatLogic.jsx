export const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) {
        console.error("Invalid or empty users array.");
        return; 
    }
    const sender = getSender(loggedUser, users);
};









// export const getSender = (loggedUser, users) => {
//     return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
// };