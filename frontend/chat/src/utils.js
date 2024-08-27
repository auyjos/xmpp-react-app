
//"usertest123@alumchat.lol/gajim.FVZNYWDQ"
export const extractUser = (userString = '') => {
    return userString.split('/')[0];
}

export const getUserId = () => {
    let user = localStorage.getItem('authentication');
    return user
}